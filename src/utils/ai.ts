import { 
	handleBet, 
	handleFold, 
	determineMinBet 
  } from './bet';
  import { 
	analyzeHistogram, 
	checkFlush, 
	checkRoyalFlush, 
	checkStraightFlush, 
	checkStraight, 
	buildValueSet,

  } from './cards';
//   import { 
// 	renderActionButtonText 
//   } from './ui';
  import { GameState, Card, Player

   } from './types/index';
  
  const BET_HIERARCHY: Record<string, number> = {
	blind: 0,
	insignificant: 1,
	lowdraw: 2,
	meddraw: 3,
	hidraw: 4,
	strong: 5,
	major: 6,
	aggro: 7,
	beware: 8,
  };
  const renderActionButtonText = (highBet:number, betInputValue:number, activePlayer:Player) => {
	if ((highBet === 0) && (betInputValue === 0)) {
		return 'Check'
	} else if ((highBet === betInputValue)) {
		return 'Call'
	} else if ((highBet === 0) && (betInputValue > highBet)) {
		return 'Bet'
	} else if ((betInputValue < highBet) || (betInputValue === activePlayer.chips + activePlayer.bet)) {
		return 'All-In!'
	} else if (betInputValue > highBet) {
		return 'Raise'
	} 
  }
  
  export const handleAI = (state: GameState, pushAnimationState: (index: number, action: string) => void): GameState => {
	const { highBet } = state;
	const activePlayer = state.players[state.activePlayerIndex];
	const min = determineMinBet(highBet, activePlayer.chips, activePlayer.bet);
	const max = activePlayer.chips + activePlayer.bet;
	const totalInvestment = activePlayer.chips + activePlayer.bet + activePlayer.stackInvestment;
	const investmentRequiredToRemain = (highBet / totalInvestment) * 100; 
	const descendingSortHand = [...activePlayer.cards, ...state.communityCards].sort((a, b) => b.value - a.value);
	const { frequencyHistogram, suitHistogram } = generateHistogram(descendingSortHand);
	const stakes = classifyStakes(investmentRequiredToRemain);
	
	switch(state.phase) {
	  case 'betting1': {
		const preFlopValues = activePlayer.cards.map(el => el.value);
		const highCard = Math.max(...preFlopValues);
		const lowCard = Math.min(...preFlopValues);
		const suited = Object.entries(suitHistogram).find(([_, count]) => count === 2);      
		const straightGap = (highCard - lowCard <= 4);
		const { callLimit, raiseChance, raiseRange } = buildPreFlopDeterminant(highCard, lowCard, !!suited, straightGap);      
		const willCall = (BET_HIERARCHY[stakes] <= BET_HIERARCHY[callLimit]);
		const callValue = (activePlayer.chips + activePlayer.bet >= highBet) ? highBet : activePlayer.chips + activePlayer.bet;
		
		if (willCall) {
		  if (willRaise(raiseChance)) {
			const determinedRaiseRange = raiseRange[Math.floor(Math.random() * raiseRange.length)];
			const wantRaise = (BET_HIERARCHY[stakes] <= BET_HIERARCHY[determinedRaiseRange]);
			
			if (wantRaise) {
			  let betValue = Math.floor(decideBetProportion(determinedRaiseRange) * activePlayer.chips);
			  if (betValue < highBet) {
				if (highBet < max) {
				  betValue = highBet;
				}
			  }
			  if (betValue > max) {
				activePlayer.canRaise = false;
			  }
			  pushAnimationState(state.activePlayerIndex, `${renderActionButtonText(highBet, betValue, activePlayer)} ${betValue}`);
			  return handleBet(state, betValue, min, max);
			} else {
			  pushAnimationState(state.activePlayerIndex, `${renderActionButtonText(highBet, callValue, activePlayer)} ${(callValue > activePlayer.bet) ? callValue : ""}`);
			  return handleBet(state, callValue, min, max);
			}  
		  } else {
			pushAnimationState(state.activePlayerIndex, `${renderActionButtonText(highBet, callValue, activePlayer)} ${(callValue > activePlayer.bet) ? callValue : ""}`);
			return handleBet(state, callValue, min, max);
		  }
		} else {
		  pushAnimationState(state.activePlayerIndex, `FOLD`);
		  return handleFold(state);
		}
	  }
	  case 'betting2':
	  case 'betting3':
	  case 'betting4': {
		const { 
		  isPair,
		  isTwoPair,
		  isThreeOfAKind,
		  isFourOfAKind,
		  isFullHouse,
		  frequencyHistogramMetaData, 
		} = analyzeHistogram(descendingSortHand, frequencyHistogram);      
		const valueSet = buildValueSet(descendingSortHand);
		const { 
		  isStraight, 
		
		} = checkStraight(valueSet);
		const { 
		  isFlush, 
		  flushedSuit, 
		} = checkFlush(suitHistogram);
		const flushCards = isFlush ? descendingSortHand.filter(card => card.suit === flushedSuit) : [];
		const { 
		  isStraightFlush, 
		 
		} = isFlush ? checkStraightFlush(flushCards) : {
		  isStraightFlush: false, 
		};
		const isRoyalFlush = isFlush && checkRoyalFlush(flushCards);
		const isNoPair = (
		  !isRoyalFlush && 
		  !isStraightFlush && 
		  !isFourOfAKind && 
		  !isFullHouse && 
		  !isFlush && 
		  !isStraight && 
		  !isThreeOfAKind && 
		  !isTwoPair && 
		  !isPair
		);
		
		const highRank = [
		  { name: 'Royal Flush', match: isRoyalFlush },
		  { name: 'Straight Flush', match: isStraightFlush },
		  { name: 'Four Of A Kind', match: isFourOfAKind },
		  { name: 'Full House', match: isFullHouse },
		  { name: 'Flush', match: isFlush },
		  { name: 'Straight', match: isStraight },
		  { name: 'Three Of A Kind', match: isThreeOfAKind },
		  { name: 'Two Pair', match: isTwoPair },
		  { name: 'Pair', match: isPair },
		  { name: 'No Pair', match: isNoPair }
		].find(el => el.match)!.name;
		
		const { callLimit, raiseChance, raiseRange } = buildGeneralizedDeterminant(descendingSortHand, highRank, frequencyHistogramMetaData!);
		const willCall = (BET_HIERARCHY[stakes] <= BET_HIERARCHY[callLimit]);
		const callValue = (activePlayer.chips + activePlayer.bet >= highBet) ? highBet : activePlayer.chips + activePlayer.bet;
		
		if (willCall) {
		  if (willRaise(raiseChance)) {
			const determinedRaiseRange = raiseRange[Math.floor(Math.random() * raiseRange.length)];
			const wantRaise = (BET_HIERARCHY[stakes] <= BET_HIERARCHY[determinedRaiseRange]);
			
			if (wantRaise) {
			  let betValue = Math.floor(decideBetProportion(determinedRaiseRange) * activePlayer.chips);
			  if (betValue < highBet) {
				betValue = highBet;
			  }
			  activePlayer.canRaise = false;
			  pushAnimationState(state.activePlayerIndex, `${renderActionButtonText(highBet, betValue, activePlayer)} ${betValue}`);
			  return handleBet(state, betValue, min, max);
			} else {
			  pushAnimationState(state.activePlayerIndex, `${renderActionButtonText(highBet, callValue, activePlayer)} ${(callValue > activePlayer.bet) ? callValue : ""}`);
			  return handleBet(state, callValue, min, max);
			}  
		  } else {
			pushAnimationState(state.activePlayerIndex, `${renderActionButtonText(highBet, callValue, activePlayer)} ${(callValue > activePlayer.bet) ? callValue : ""}`);
			return handleBet(state, callValue, min, max);
		  }
		} else {
		  pushAnimationState(state.activePlayerIndex, `FOLD`);
		  return handleFold(state);
		}
	  }
	  default: 
		throw new Error("Handle AI Running during incorrect phase");
	}
  }
  
  const buildGeneralizedDeterminant = (
	hand: Card[],
	highRank: string,
	frequencyHistogramMetaData: {
	  pairs: Array<{ face: string; value: number }>;
	  tripples: Array<{ face: string; value: number }>;
	  quads: Array<{ face: string; value: number }>;
	}
  ): {
	callLimit: string;
	raiseChance: number;
	raiseRange: string[];
  } => {
	if (highRank === 'Royal Flush') {
	  return {
		callLimit: 'beware',
		raiseChance: 1,
		raiseRange: ['beware']
	  };
	} else if (highRank === 'Straight Flush') {
	  return {
		callLimit: 'beware',
		raiseChance: 1,
		raiseRange: ['strong','aggro', 'beware']
	  };
	} else if (highRank === 'Four Of A Kind') {
	  return {
		callLimit: 'beware',
		raiseChance: 1,
		raiseRange: ['strong','aggro', 'beware']
	  };
	} else if (highRank === 'Full House') {
	  return {
		callLimit: 'beware',
		raiseChance: 1,
		raiseRange: ['hidraw', 'strong', 'aggro', 'beware']
	  };
	  } else if (highRank === 'Flush') {
		return {
		  callLimit: 'beware',
		  raiseChance: 1,
		  raiseRange: ['strong', 'aggro', 'beware'],
		};
	  } else if (highRank === 'Straight') {
		return {
		  callLimit: 'beware',
		  raiseChance: 1,
		  raiseRange: ['lowdraw', 'meddraw', 'hidraw, strong'],
		};
	  } else if (highRank === 'Three Of A Kind') {
		return {
		  callLimit: 'beware',
		  raiseChance: 1,
		  raiseRange: ['lowdraw', 'meddraw', 'hidraw, strong'],
		};
	  } else if (highRank === 'Two Pair') {
		return {
		  callLimit: 'beware',
		  raiseChance: 0.7,
		  raiseRange: ['lowdraw', 'meddraw', 'hidraw, strong'],
		};
	  } else if (highRank === 'Pair') {
		const pairValue = frequencyHistogramMetaData.pairs[0].value;
		if (pairValue >= 10) { // Pair of 10s or better
		  return {
			callLimit: 'beware',
			raiseChance: 0.5,
			raiseRange: ['meddraw', 'hidraw', 'strong'],
		  };
		} else {
		  return {
			callLimit: 'hidraw',
			raiseChance: 0.3,
			raiseRange: ['lowdraw', 'meddraw'],
		  };
		}
	  } else { // No Pair
		const highCard = Math.max(...hand.map(card => card.value));
		if (highCard >= 11) { // High card Jack or better
		  return {
			callLimit: 'meddraw',
			raiseChance: 0.1,
			raiseRange: ['lowdraw'],
		  };
		} else {
		  return {
			callLimit: 'insignificant',
			raiseChance: 0,
			raiseRange: [],
		  };
		}
	}
  };
  
  const buildPreFlopDeterminant = (
	highCard: number,
	lowCard: number,
	suited: boolean,
	straightGap: boolean
  ): {
	callLimit: string;
	raiseChance: number;
	raiseRange: string[];
  } => {
	if (highCard === lowCard) {
	  switch(true) {
		case (highCard > 8):
		  return {
			callLimit: 'beware',
			raiseChance: 0.9,
			raiseRange: ['lowdraw', 'meddraw', 'hidraw', 'strong'],
		  };
		case (highCard > 5):
		  return {
			callLimit: 'aggro',
			raiseChance: 0.75,
			raiseRange: ['insignificant', 'lowdraw', 'meddraw'],
		  };
		case (highCard < 5):
		default:
		  return {
			callLimit: 'aggro',
			raiseChance: 0.5,
			raiseRange: ['insignificant', 'lowdraw', 'meddraw'],
		  };
	  }
	} else if (highCard > 9 && lowCard > 9) {
	  // Two high cards
	  return suited ? {
		callLimit: 'beware',
		raiseChance: 1,
		raiseRange: ['insignificant', 'lowdraw', 'meddraw', 'hidraw'],
	  } : {
		callLimit: 'beware',
		raiseChance: 0.75,
		raiseRange: ['insignificant', 'lowdraw', 'meddraw', 'hidraw'],
	  };
	} else if (highCard > 8 && lowCard > 6) {
	  // One high card
	  return suited ? {
		callLimit: 'beware',
		raiseChance: 0.65,
		raiseRange: ['insignificant', 'lowdraw', 'meddraw', 'hidraw'],
	  } : {
		callLimit: 'beware',
		raiseChance: 0.45,
		raiseRange: ['insignificant', 'lowdraw', 'meddraw', 'hidraw'],
	  };
	} else if (highCard > 8 && lowCard < 6) {
	  return suited ? {
		callLimit: 'major',
		raiseChance: 0.45,
		raiseRange: ['insignificant', 'lowdraw'],
	  } : {
		callLimit: 'aggro',
		raiseChance: 0.35,
		raiseRange: ['insignificant', 'lowdraw'],
	  };
	} else if (highCard > 5 && lowCard > 3) {
	  return suited ? {
		callLimit: 'strong',
		raiseChance: 0.1,
		raiseRange: ['insignificant', 'lowdraw'],
	  } : straightGap ? {
		callLimit: 'aggro',
		raiseChance: 0,
		raiseRange: [],
	  } : {
		callLimit: 'strong',
		raiseChance: 0,
		raiseRange: [],
	  };
	} else {
	  return suited ? {
		callLimit: 'strong',
		raiseChance: 0.1,
		raiseRange: ['insignificant'],
	  } : straightGap ? {
		callLimit: 'strong',
		raiseChance: 0,
		raiseRange: [],
	  } : {
		callLimit: 'insignificant',
		raiseChance: 0,
		raiseRange: [],
	  };
	}
  };
  
  const classifyStakes = (percentage: number): string => {
	switch (true) {
	  case (percentage > 75):
		return 'beware';
	  case (percentage > 40):
		return 'aggro';
	  case (percentage > 35): 
		return 'major';
	  case (percentage > 25): 
		return 'strong';
	  case (percentage > 15):
		return 'hidraw';
	  case (percentage > 10): 
		return 'meddraw';
	  case (percentage > 3):
		return 'lowdraw';
	  case (percentage >= 1): 
		return 'insignificant';
	  case (percentage < 1):
	  default:  
		return 'blind';
	}
  };
  
  const decideBetProportion = (stakes: string): number => {
	switch(stakes) {
	  case 'blind':
		return Math.random() * (0.1 - 0) + 0;
	  case 'insignificant':
		return Math.random() * (0.03 - 0.01) + 0.01;
	  case 'lowdraw':
		return Math.random() * (0.10 - 0.03) + 0.03;
	  case 'meddraw':
		return Math.random() * (0.15 - 0.10) + 0.10;
	  case 'hidraw':
		return Math.random() * (0.25 - 0.15) + 0.15;
	  case 'strong':
		return Math.random() * (0.35 - 0.25) + 0.25;
	  case 'major':
		return Math.random() * (0.40 - 0.35) + 0.35;
	  case 'aggro':
		return Math.random() * (0.75 - 0.40) + 0.40;
	  case 'beware':
		return Math.random() * (1 - 0.75) + 0.75;
	  default:
		return 0;
	}
  };
  
  const willRaise = (chance: number): boolean => {
	return Math.random() < chance;
  };
  
  const generateHistogram = (hand: Card[]): {
	frequencyHistogram: Record<string, number>;
	suitHistogram: Record<string, number>;
  } => {
	return hand.reduce((acc, cur) => {
	  acc.frequencyHistogram[cur.cardFace] = (acc.frequencyHistogram[cur.cardFace] || 0) + 1;
	  acc.suitHistogram[cur.suit] = (acc.suitHistogram[cur.suit] || 0) + 1;
	  return acc;
	}, { 
	  frequencyHistogram: {} as Record<string, number>, 
	  suitHistogram: {} as Record<string, number> 
	});
  };