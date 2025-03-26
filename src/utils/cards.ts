import { cloneDeep } from 'lodash';
import { handleOverflowIndex, determinePhaseStartActivePlayer } from './players';
import { Card, GameState, FrequencyHistogramMetaData, PopCardsResult } from './types';

const totalNumCards = 52;
const suits = ['Heart', 'Spade', 'Club', 'Diamond'] as const;
const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'] as const;

const VALUE_MAP: Record<string, number> = {
  '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8,
  '10': 9, 'J': 10, 'Q': 11, 'K': 12, 'A': 13,
};

const randomizePosition = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateDeckOfCards = (): Card[] => {
  const deck: Card[] = [];
  for (const suit of suits) {
    for (const card of cards) {
      deck.push({
        cardFace: card,
        suit: suit,
        value: VALUE_MAP[card]
      });
    }
  }
  return deck;
}

export const shuffle = (deck: Card[]): Card[] => {
  let shuffledDeck: (Card | undefined)[] = new Array(totalNumCards);
  let filledSlots: number[] = [];
  
  for (let i = 0; i < totalNumCards; i++) {
    if (i === 51) {
      const lastSlot = shuffledDeck.findIndex((el) => typeof el === 'undefined');
      shuffledDeck[lastSlot] = deck[i];
      filledSlots.push(lastSlot);
    } else {
      let shuffleToPosition = randomizePosition(0, totalNumCards - 1);
      while (filledSlots.includes(shuffleToPosition)) {
        shuffleToPosition = randomizePosition(0, totalNumCards - 1);
      }
      shuffledDeck[shuffleToPosition] = deck[i];
      filledSlots.push(shuffleToPosition);
    }
  }
  return shuffledDeck as Card[];
}

export const popCards = (deck: Card[], numToPop: number): PopCardsResult => {
  const mutableDeckCopy = [...deck];
  let chosenCards: Card | Card[];
  
  if (numToPop === 1) {
    chosenCards = mutableDeckCopy.pop()!;
  } else {
    chosenCards = [];
    for (let i = 0; i < numToPop; i++) {
      chosenCards.push(mutableDeckCopy.pop()!);
    }
  }
  return { mutableDeckCopy, chosenCards };
}

export const popShowdownCards = (deck: Card[], numToPop: number): PopCardsResult => {
  const mutableDeckCopy = [...deck];
  let chosenCards: Card[];
  
  if (numToPop === 1) {
    chosenCards = [mutableDeckCopy.pop()!];
  } else {
    chosenCards = [];
    for (let i = 0; i < numToPop; i++) {
      chosenCards.push(mutableDeckCopy.pop()!);
    }
  }
  return { mutableDeckCopy, chosenCards };
}

export const dealPrivateCards = (state: GameState): GameState => {
  state.clearCards = false;
  let animationDelay = 0;
  
  while (state.players[state.activePlayerIndex].cards.length < 2) {
    const { mutableDeckCopy, chosenCards } = popCards(state.deck, 1);
    const card = Array.isArray(chosenCards) ? chosenCards[0] : chosenCards;
    
    card.animationDelay = animationDelay;
    animationDelay += 250;

    state.players[state.activePlayerIndex].cards.push(card);
    state.deck = mutableDeckCopy;
    state.activePlayerIndex = handleOverflowIndex(state.activePlayerIndex, 1, state.players.length, 'up');
  }
  
  if (state.players[state.activePlayerIndex].cards.length === 2) {
    state.activePlayerIndex = handleOverflowIndex(state.blindIndex.big, 1, state.players.length, 'up');
    state.phase = 'betting1';
  }
  return state;
}

export const dealFlop = (state: GameState): GameState => {
  let animationDelay = 0;
  const { mutableDeckCopy, chosenCards } = popCards(state.deck, 3);
  
  for (const card of chosenCards as Card[]) {
    card.animationDelay = animationDelay;
    animationDelay += 250;
    state.communityCards.push(card);
  }

  state.deck = mutableDeckCopy;
  state = determinePhaseStartActivePlayer(state);
  state.phase = 'betting2';
  return state;
}

export const dealTurn = (state: GameState): GameState => {
  const { mutableDeckCopy, chosenCards } = popCards(state.deck, 1);
  const card = Array.isArray(chosenCards) ? chosenCards[0] : chosenCards;
  
  card.animationDelay = 0;
  state.communityCards.push(card);
  state.deck = mutableDeckCopy;
  state = determinePhaseStartActivePlayer(state);
  state.phase = 'betting3';
  return state;
}

export const dealRiver = (state: GameState): GameState => {
  const { mutableDeckCopy, chosenCards } = popCards(state.deck, 1);
  const card = Array.isArray(chosenCards) ? chosenCards[0] : chosenCards;
  
  card.animationDelay = 0;
  state.communityCards.push(card);
  state.deck = mutableDeckCopy;
  state = determinePhaseStartActivePlayer(state);
  state.phase = 'betting4';
  return state;
}

export const showDown = (state: GameState): GameState => {
  for (const player of state.players) {
    const frequencyHistogram: Record<string, number> = {};
    const suitHistogram: Record<string, number> = {};

    player.showDownHand.hand = [...player.cards, ...state.communityCards];
    player.showDownHand.descendingSortHand = [...player.showDownHand.hand].sort((a, b) => b.value - a.value);

    player.showDownHand.descendingSortHand.forEach(card => {
      frequencyHistogram[card.cardFace] = (frequencyHistogram[card.cardFace] || 0) + 1;
      suitHistogram[card.suit] = (suitHistogram[card.suit] || 0) + 1;
    });

    player.frequencyHistogram = frequencyHistogram;
    player.suitHistogram = suitHistogram;

    const valueSet = buildValueSet(player.showDownHand.descendingSortHand);

    const { isFlush, flushedSuit } = checkFlush(suitHistogram);
    const flushCards = isFlush ? player.showDownHand.descendingSortHand.filter(card => card.suit === flushedSuit) : [];
    const isRoyalFlush = isFlush && checkRoyalFlush(flushCards);
    const { 
      isStraightFlush, 
      isLowStraightFlush, 
      concurrentSFCardValues, 
      concurrentSFCardValuesLow 
    } = isFlush ? checkStraightFlush(flushCards) : {
      isStraightFlush: false,
      isLowStraightFlush: false,
      concurrentSFCardValues: [],
      concurrentSFCardValuesLow: []
    };
    const { 
      isStraight, 
      isLowStraight, 
      concurrentCardValues, 
      concurrentCardValuesLow 
    } = checkStraight(valueSet);
    const { 
      isFourOfAKind, 
      isFullHouse, 
      isThreeOfAKind, 
      isTwoPair, 
      isPair, 
      frequencyHistogramMetaData 
    } = analyzeHistogram(player.showDownHand.descendingSortHand, frequencyHistogram);
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
    
    player.showDownHand.bools = {
      isRoyalFlush,
      isStraightFlush,
      isFourOfAKind,
      isFullHouse,
      isFlush,
      isStraight,
      isThreeOfAKind,
      isTwoPair,
      isPair,
      isNoPair,
    };

    player.showDownHand.heldRankHierarchy = [
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
    ];

    player.metaData = frequencyHistogramMetaData;

    const highRankPosition = player.showDownHand.heldRankHierarchy.findIndex(el => el.match === true);
    player.showDownHand.bestHandRank = player.showDownHand.heldRankHierarchy[highRankPosition].name;
    player.showDownHand.bestHand = buildBestHand(
      player.showDownHand.descendingSortHand, 
      player.showDownHand.bestHandRank, 
      flushedSuit, 
      flushCards, 
      concurrentCardValues, 
      concurrentCardValuesLow, 
      isLowStraight, 
      isLowStraightFlush, 
      concurrentSFCardValues, 
      concurrentSFCardValuesLow, 
      frequencyHistogramMetaData
    );
  }
  
  return distributeSidePots(state);
}

export const buildBestHand = (
  hand: Card[],
  bestRank: string,
  _: string | null,
  flushCards: Card[],
  concurrentCardValues: number[],
  concurrentCardValuesLow: number[],
  isLowStraight: boolean,
  isLowStraightFlush: boolean,
  concurrentSFCardValues: number[],
  concurrentSFCardValuesLow: number[],
  frequencyHistogramMetaData: FrequencyHistogramMetaData
): Card[] => {
  switch(bestRank) {
    case 'Royal Flush':
      return flushCards.slice(0, 5);
    case 'Straight Flush':
      if (isLowStraightFlush && concurrentSFCardValues.length < 5) {
        concurrentSFCardValuesLow[0] = 13;
        return concurrentSFCardValuesLow
          .reduce((acc: Card[], cur, index) => {
            if (index < 5) {
              acc.push(flushCards[flushCards.findIndex((match:Card )=> match.value === cur)]!);
            }
            return acc;
          }, [])
          .reverse();
      } else {
        return concurrentSFCardValues
          .reduce((acc: Card[], cur, index) => {
            if (index < 5) {
              acc.push(flushCards[flushCards.findIndex((match:Card )=> match.value === cur)]!);
            }
            return acc;
          }, []);
      }
    case 'Four Of A Kind': {
      const bestHand: Card[] = [];
      let mutableHand = cloneDeep(hand);

      for (let i = 0; i < 4; i++) {
        const indexOfQuad = mutableHand.findIndex((match:Card ) => match.cardFace === frequencyHistogramMetaData.quads[0].face);
        bestHand.push(mutableHand[indexOfQuad]!);
        mutableHand = mutableHand.filter((_:any, index:number) => index !== indexOfQuad);
      }

      return bestHand.concat(mutableHand.slice(0, 1));
    }
    case 'Full House': {
      const bestHand: Card[] = [];
      let mutableHand = cloneDeep(hand);
      
      if (frequencyHistogramMetaData.tripples.length > 1) {
        for (let i = 0; i < 3; i++) {
          const indexOfTripple = mutableHand.findIndex((match:Card )=> match.cardFace === frequencyHistogramMetaData.tripples[0].face);
          bestHand.push(mutableHand[indexOfTripple]!);
          mutableHand = mutableHand.filter((_:any, index:number) => index !== indexOfTripple);
        }
        for (let i = 0; i < 2; i++) {
          const indexOfPair = mutableHand.findIndex((match:Card )=> match.cardFace === frequencyHistogramMetaData.tripples[1].face);
          bestHand.push(mutableHand[indexOfPair]!);
          mutableHand = mutableHand.filter((_:any, index:number) => index !== indexOfPair);
        }
        return bestHand;
      } else {
        for (let i = 0; i < 3; i++) {
          const indexOfTripple = mutableHand.findIndex((match:Card )=> match.cardFace === frequencyHistogramMetaData.tripples[0].face);
          bestHand.push(mutableHand[indexOfTripple]!);
          mutableHand = mutableHand.filter((_:any, index:number) => index !== indexOfTripple);
        }
        for (let i = 0; i < 2; i++) {
          const indexOfPair = mutableHand.findIndex((match:Card )=> match.cardFace === frequencyHistogramMetaData.pairs[0].face);
          bestHand.push(mutableHand[indexOfPair]!);
          mutableHand = mutableHand.filter((_:any, index:number) => index !== indexOfPair);
        }
        return bestHand;
      }
    }
    case 'Flush':
      return flushCards.slice(0, 5);
    case 'Straight':
      if (isLowStraight && concurrentCardValues.length < 5) {
        concurrentCardValuesLow[0] = 13;
        return concurrentCardValuesLow
          .reduce((acc: Card[], cur, index) => {
            if (index < 5) {
              acc.push(hand[hand.findIndex((match:Card )=> match.value === cur)]!);
            }
            return acc;
          }, [])
          .reverse();
      } else {
        return concurrentCardValues
          .reduce((acc: Card[], cur, index) => {
            if (index < 5) {
              acc.push(hand[hand.findIndex((match:Card )=> match.value === cur)]!);
            }
            return acc;
          }, []);
      }
    case 'Three Of A Kind': {
      const bestHand: Card[] = [];
      let mutableHand = cloneDeep(hand);

      for (let i = 0; i < 3; i++) {
        const indexOfTripple = mutableHand.findIndex((match:Card )=> match.cardFace === frequencyHistogramMetaData.tripples[0].face);
        bestHand.push(mutableHand[indexOfTripple]!);
        mutableHand = mutableHand.filter((_:any, index:number) => index !== indexOfTripple);
      }

      return bestHand.concat(mutableHand.slice(0, 2));
    }
    case 'Two Pair': {
      const bestHand: Card[] = [];
      let mutableHand = cloneDeep(hand);
      
      for (let i = 0; i < 2; i++) {
        const indexOfPair = mutableHand.findIndex((match:Card )=> match.cardFace === frequencyHistogramMetaData.pairs[0].face);
        bestHand.push(mutableHand[indexOfPair]!);
        mutableHand = mutableHand.filter((_:any, index:number) => index !== indexOfPair);
      }
      
      for (let i = 0; i < 2; i++) {
        const indexOfPair = mutableHand.findIndex((match:Card )=> match.cardFace === frequencyHistogramMetaData.pairs[1].face);
        bestHand.push(mutableHand[indexOfPair]!);
        mutableHand = mutableHand.filter((_:any, index:number) => index !== indexOfPair);
      }
      
      return bestHand.concat(mutableHand.slice(0, 1));
    }
    case 'Pair': {
      const bestHand: Card[] = [];
      let mutableHand = cloneDeep(hand);            
      
      for (let i = 0; i < 2; i++) {
        const indexOfPair = mutableHand.findIndex((card:Card )=> card.cardFace === frequencyHistogramMetaData.pairs[0].face);
        bestHand.push(mutableHand[indexOfPair]!);
        mutableHand = mutableHand.filter((_:any, index:number) => index !== indexOfPair);
      }
      
      return bestHand.concat(mutableHand.slice(0, 3));
    }
    case 'No Pair':
      return hand.slice(0, 5);
    default: 
      throw new Error('Received unfamiliar rank argument in buildBestHand()');
  }
}

const distributeSidePots = (state: GameState): GameState => {
  state.playerHierarchy = buildAbsolutePlayerRankings(state);
  console.log("Ultimate Player Hierarchy Determined:");
  console.log(state.playerHierarchy);
  
  for (const sidePot of state.sidePots) {
    const rankMap = rankPlayerHands(state, sidePot.contestants);
    state = battleRoyale(state, rankMap, sidePot.potValue);
  }

  state.players = state.players.map(player => ({
    ...player,
    roundEndChips: player.chips
  }));
  
  return state;
}

const buildAbsolutePlayerRankings = (state: GameState): Array<{
  name: string;
  bestHand: Card[];
  handRank: string;
}> => {
  const activePlayers = state.players.filter(player => !player.folded);
  let hierarchy: Array<{
    name: string;
    bestHand: Card[];
    handRank: string;
  }> = [];
  
  const rankMap = new Map<string, Array<{
    name: string;
    playerIndex: number;
    bestHand: Card[];
  }>>([
    ['Royal Flush', []], 
    ['Straight Flush', []],
    ['Four Of A Kind', []],
    ['Full House', []],
    ['Flush', []],
    ['Straight', []],
    ['Three Of A Kind', []],
    ['Two Pair', []],
    ['Pair', []],
    ['No Pair', []]
  ]);

  activePlayers.forEach((player, playerIndex) => {
    const { name, showDownHand: { bestHandRank, bestHand } } = player;
    rankMap.get(bestHandRank!)!.push({
      name,
      bestHand: bestHand!,
      playerIndex
    });
  });
  
  for (const [handRank, playersWhoHoldThisRank] of rankMap) {
    if (playersWhoHoldThisRank.length > 0) {
      if (handRank === 'Royal Flush') {
        const formattedPlayers = playersWhoHoldThisRank.map(player => ({
          name: player.name,
          bestHand: player.bestHand,
          handRank
        }));
        hierarchy = hierarchy.concat(formattedPlayers);
        continue;
      } 
      
      if (playersWhoHoldThisRank.length === 1) {
        const { name, bestHand } = playersWhoHoldThisRank[0];
        hierarchy.push({ name, bestHand, handRank });
      } else if (playersWhoHoldThisRank.length > 1) {
        const sortedComparator = buildComparator(handRank, playersWhoHoldThisRank)
          .map(snapshot => snapshot.sort((a, b) => b.card.value - a.card.value));
        const winnerHierarchy = determineContestedHierarchy(sortedComparator, handRank);
        hierarchy = hierarchy.concat(winnerHierarchy);
      }
    }
  }

  return hierarchy;
}

const determineContestedHierarchy = (
  sortedComparator: Array<Array<{
    name: string;
    card: Card;
    playerIndex?: number;
    bestHand?: Card[];
  }>>,
  handRank: string
): Array<{
  name: string;
  bestHand: Card[];
  handRank: string;
}> => {
  let winnerHierarchy: Array<{
    name: string;
    bestHand: Card[];
    handRank: string;
  }> = [];
  let loserHierarchy: any[] = [];
  
  const processComparator = (comparator: typeof sortedComparator, round = 0) => {
    if (comparator[0].length === 1) {
      const { name, bestHand } = comparator[0][0];
      winnerHierarchy.push({ name, bestHand: bestHand!, handRank });
      return;
    }
    
    let filterableComparator = [...comparator];
    const frame = comparator[round];
    const { winningFrame, losingFrame } = processSnapshotFrame(frame);
    
    if (losingFrame.length > 0) {
      const lowerTierComparator = filterableComparator.map(frame => {
        return frame.filter(snapshot => {
          return losingFrame.some(snapshotToMatchName => {
            return snapshotToMatchName.name === snapshot.name;
          });
        });
      });
      
      loserHierarchy = [lowerTierComparator].concat(loserHierarchy);
    }
    
    if (winningFrame.length === 1) {
      const { name, bestHand } = winningFrame[0];
      winnerHierarchy.push({ name, bestHand: bestHand!, handRank });
    } else if (round === (sortedComparator.length - 1)) {
      const filteredWinnerSnapshots = winningFrame.map(snapshot => ({
        name: snapshot.name,
        bestHand: snapshot.bestHand!,
        handRank
      }));
      winnerHierarchy = winnerHierarchy.concat(filteredWinnerSnapshots);
    } else {
      const higherTierComparator = filterableComparator.map(frame => {
        return frame.filter(snapshot => {
          return winningFrame.some(snapshotToMatchName => {
            return snapshotToMatchName.name === snapshot.name;
          });
        });
      });
      processComparator(higherTierComparator, (round + 1));
    }
  }

  const processLowTierComparators = (loserHierarchyFrame: any[]) => {
    if (loserHierarchy.length > 0) {
      const loserComparatorToProcess = loserHierarchyFrame[0];
      loserHierarchy = loserHierarchyFrame.slice(1);
      processComparator(loserComparatorToProcess);
      processLowTierComparators(loserHierarchy);
    }
  }
  
  processComparator(sortedComparator);
  processLowTierComparators(loserHierarchy);
  return winnerHierarchy;
}

const processSnapshotFrame = (frame: Array<{
  name: string;
  card: Card;
  playerIndex?: number;
  bestHand?: Card[];
}>): {
  winningFrame: typeof frame;
  losingFrame: typeof frame;
} => {
  const highValue = frame[0].card.value;
  const winningFrame = frame.filter(snapshot => snapshot.card.value === highValue);
  const losingFrame = frame.filter(snapshot => snapshot.card.value < highValue);
  return { winningFrame, losingFrame };
}

const rankPlayerHands = (state: GameState, contestants: string[]) => {
  const rankMap = new Map<string, Array<{
      name: string;
      playerIndex: number;
      bestHand: Card[];
    }>>([
      ['Royal Flush', []], 
      ['Straight Flush', []],
      ['Four Of A Kind', []],
      ['Full House', []],
      ['Flush', []],
      ['Straight', []],
      ['Three Of A Kind', []],
      ['Two Pair', []],
      ['Pair', []],
      ['No Pair', []]
    ]);

  for (const contestant of contestants) {
    const playerIndex = state.players.findIndex(player => player.name === contestant);
    const player = state.players[playerIndex];
    if (!player.folded) {
      rankMap.get(player.showDownHand.bestHandRank!)!.push({
        name: player.name,
        playerIndex,
        bestHand: player.showDownHand.bestHand!,
      });
    }
  }
  return rankMap;
}

const battleRoyale = (
  state: GameState,
  rankMap: Map<string, Array<{
    name: string;
    playerIndex: number;
    bestHand: Card[];
  }>>,
  prize: number
): GameState => {
  let winnerFound = false;

  rankMap.forEach((contestants, rank) => {
    if (!winnerFound) {
      if (contestants.length === 1) {
        winnerFound = true;
        console.log("Uncontested Winner, ", contestants[0].name, " , beating out the competition with a ", rank);
        state = payWinners(state, contestants, prize, rank);
      } else if (contestants.length > 1) {
        console.log(contestants);
        winnerFound = true;
        const winners = determineWinner(buildComparator(rank, contestants), rank);
        if (winners.length === 1) {
          console.log("Uncontested Winner, ", winners[0].name, " , beating out the competition with a ", rank);
          state = payWinners(state, winners, prize, rank);
        } else {
          console.log("We have a tie! Split the pot amongst ", winners, " Who will take the pot with their ", rank);
          state = payWinners(state, winners, prize, rank);
        }
      }
    }
  });
  
  return state;
}

const payWinners = (
  state: GameState,
  winners: Array<{
    name: string;
    playerIndex?: number;
  }>,
  prize: number,
  rank: string
): GameState => {
  if (winners.length === 1) {
    state.showDownMessages = state.showDownMessages!.concat([{
      users: [winners[0].name],
      prize,
      rank
    }]);
    console.log("Transferring ", prize, " chips to ", winners[0].name);
    state.players[winners[0].playerIndex!].chips += prize;
    state.pot -= prize;
  } else if (winners.length > 1) {
    const overflow = prize % winners.length;
    const splitPot = Math.floor(prize / winners.length);
    console.log("Mediating Tie. Total Prize ", prize, " split into ", winners.length, " portions with an overflow of ", overflow);
    state.showDownMessages = state.showDownMessages!.concat([{
      users: winners.map(winner => winner.name),
      prize: splitPot,
      rank
    }]);
    
    winners.forEach(winner => {
      state.players[winner.playerIndex!].chips += splitPot;
      state.pot -= splitPot;
    });
  }
  return state;
}

const buildComparator = (
  rank: string,
  playerData: Array<{
    name: string;
    playerIndex?: number;
    bestHand: Card[];
  }>
): Array<Array<{
  name: string;
  card: Card;
  playerIndex?: number;
  bestHand: Card[];
}>> => {
  let comparator: Array<Array<{
    name: string;
    card: Card;
    playerIndex?: number;
    bestHand: Card[];
  }>> = [];
  
  switch(rank) {
    case 'Royal Flush':
      comparator = Array.from({length: 1}, () => []);
      playerData.forEach((_, index) => {
        comparator[0].push({
          name: playerData[index].name,
          playerIndex: playerData[index].playerIndex,
          bestHand: playerData[index].bestHand,
          card: playerData[index].bestHand[0] // Dummy card for typing
        });
      });
      break;
    case 'Four Of A Kind':
      comparator = Array.from({length: 2}, () => []);
      playerData.forEach((_, index) => {
        comparator[0].push({
          card: playerData[index].bestHand[0],
          name: playerData[index].name,
          playerIndex: playerData[index].playerIndex,
          bestHand: playerData[index].bestHand
        });
        comparator[1].push({
          card: playerData[index].bestHand[4],
          name: playerData[index].name,
          playerIndex: playerData[index].playerIndex,
          bestHand: playerData[index].bestHand
        });
      });
      break;
    case 'Full House':
      comparator = Array.from({length: 2}, () => []);
      playerData.forEach((_, index) => {
        comparator[0].push({
          card: playerData[index].bestHand[0],
          name: playerData[index].name,
          playerIndex: playerData[index].playerIndex,
          bestHand: playerData[index].bestHand
        });
        comparator[1].push({
          card: playerData[index].bestHand[3],
          name: playerData[index].name,
          playerIndex: playerData[index].playerIndex,
          bestHand: playerData[index].bestHand
        });
      });
      break;
    case 'Flush':
    case 'No Pair':
      comparator = Array.from({length: 5}, () => []);
      playerData.forEach((_, index) => {
        for (let i = 0; i < 5; i++) {
          comparator[i].push({
            card: playerData[index].bestHand[i],
            name: playerData[index].name,
            playerIndex: playerData[index].playerIndex,
            bestHand: playerData[index].bestHand
          });
        }
      });
      break;
    case 'Three Of A Kind':
      comparator = Array.from({length: 3}, () => []);
      playerData.forEach((_, index) => {
        comparator[0].push({
          card: playerData[index].bestHand[0],
          name: playerData[index].name,
          playerIndex: playerData[index].playerIndex,
          bestHand: playerData[index].bestHand
        });
        comparator[1].push({
          card: playerData[index].bestHand[3],
          name: playerData[index].name,
          playerIndex: playerData[index].playerIndex,
          bestHand: playerData[index].bestHand
        });
        comparator[2].push({
          card: playerData[index].bestHand[4],
          name: playerData[index].name,
          playerIndex: playerData[index].playerIndex,
          bestHand: playerData[index].bestHand
        });
      });
      break;
    case 'Straight':
    case 'Straight Flush':
      comparator = Array.from({length: 1}, () => []);
      playerData.forEach((_, index) => {
        comparator[0].push({
          card: playerData[index].bestHand[0],
          name: playerData[index].name,
          playerIndex: playerData[index].playerIndex,
          bestHand: playerData[index].bestHand
        });
      });
      break;
    case 'Two Pair':
      comparator = Array.from({length: 3}, () => []);
      playerData.forEach((_, index) => {
        comparator[0].push({
          card: playerData[index].bestHand[0],
          name: playerData[index].name,
          playerIndex: playerData[index].playerIndex,
          bestHand: playerData[index].bestHand
        });
        comparator[1].push({
          card: playerData[index].bestHand[2],
          name: playerData[index].name,
          playerIndex: playerData[index].playerIndex,
          bestHand: playerData[index].bestHand
        });
        comparator[2].push({
          card: playerData[index].bestHand[4],
          name: playerData[index].name,
          playerIndex: playerData[index].playerIndex,
          bestHand: playerData[index].bestHand
        });
      });
      break;
    case 'Pair':
      comparator = Array.from({length: 4}, () => []);
      playerData.forEach((_, index) => {
        comparator[0].push({
          card: playerData[index].bestHand[0],
          name: playerData[index].name,
          playerIndex: playerData[index].playerIndex,
          bestHand: playerData[index].bestHand
        });
        comparator[1].push({
          card: playerData[index].bestHand[2],
          name: playerData[index].name,
          playerIndex: playerData[index].playerIndex,
          bestHand: playerData[index].bestHand
        });
        comparator[2].push({
          card: playerData[index].bestHand[3],
          name: playerData[index].name,
          playerIndex: playerData[index].playerIndex,
          bestHand: playerData[index].bestHand
        });
        comparator[3].push({
          card: playerData[index].bestHand[4],
          name: playerData[index].name,
          playerIndex: playerData[index].playerIndex,
          bestHand: playerData[index].bestHand
        });
      });
      break;
    default: 
      throw new Error('Received unfamiliar rank argument in buildComparator()');
  }
  return comparator;
}

const determineWinner = (
  comparator: Array<Array<{
    name: string;
    card: Card;
    playerIndex?: number;
    bestHand?: Card[];
  }>>,
  rank: string
): Array<{
  name: string;
  playerIndex?: number;
}> => {
  let winners: Array<{
    name: string;
    playerIndex?: number;
  }> = [];
  
  if (rank === 'Royal Flush') return comparator[0].map(player => ({
    name: player.name,
    playerIndex: player.playerIndex
  }));

  for (let i = 0; i < comparator.length; i++) {
    let highValue = 0;
    let losers: string[] = [];
    
    winners = comparator[i]
      .sort((a, b) => b.card.value - a.card.value)
      .reduce((acc, cur) => {
        if (cur.card.value > highValue) {
          highValue = cur.card.value;
          acc = [{
            name: cur.name,
            playerIndex: cur.playerIndex,
          }];
        } else if (cur.card.value === highValue) {
          acc.push({
            name: cur.name,
            playerIndex: cur.playerIndex,
          });
        } else if (cur.card.value < highValue) {
          losers.push(cur.name);
        }
        return acc;
      }, [] as typeof winners);

    if (winners.length === 1 || i === comparator.length) {
      return winners;
    } else {
      if (losers.length >= 1) {
        losers.forEach(nameToExtract => {
          comparator = comparator.map(snapshot => 
            snapshot.filter(el => el.name !== nameToExtract)
          );
        });
      }
    }
  }
  return winners;
}

export const checkFlush = (suitHistogram: Record<string, number>): {
  isFlush: boolean;
  flushedSuit: string | null;
} => {
  for (const suit in suitHistogram) {
    if (suitHistogram[suit] >= 5) {
      return { 
        isFlush: true,
        flushedSuit: suit,
      };
    } 
  }
  return {
    isFlush: false,
    flushedSuit: null,
  };
}

export const checkRoyalFlush = (flushMatchCards: Card[]): boolean => {
  return (
    flushMatchCards[0].value === 13 &&
    flushMatchCards[1].value === 12 &&
    flushMatchCards[2].value === 11 &&
    flushMatchCards[3].value === 10 &&
    flushMatchCards[4].value === 10
  );
}

export const checkStraightFlush = (flushMatchCards: Card[]): {
  isStraightFlush: boolean;
  isLowStraightFlush: boolean;
  concurrentSFCardValues: number[];
  concurrentSFCardValuesLow: number[];
} => {
  const valueSet = buildValueSet(flushMatchCards);
  const { 
    isStraight, 
    isLowStraight, 
    concurrentCardValues, 
    concurrentCardValuesLow 
  } = checkStraight(valueSet);
  
  return {
    isStraightFlush: isStraight,
    isLowStraightFlush: isLowStraight,
    concurrentSFCardValues: concurrentCardValues,
    concurrentSFCardValuesLow: concurrentCardValuesLow,
  };
}

export const analyzeHistogram = (
  _: Card[],
  frequencyHistogram: Record<string, number>
): {
  isFourOfAKind: boolean;
  isFullHouse: boolean;
  isThreeOfAKind: boolean;
  isTwoPair: boolean;
  isPair: boolean;
  frequencyHistogramMetaData: FrequencyHistogramMetaData;
} => {
  let isFourOfAKind = false;
  let isFullHouse = false;
  let isThreeOfAKind = false;
  let isTwoPair = false;
  let isPair = false;
  let numTripples = 0;
  let numPairs = 0;
  
  const frequencyHistogramMetaData: FrequencyHistogramMetaData = {
    pairs: [],
    tripples: [],
    quads: [],
  };

  for (const cardFace in frequencyHistogram) {
    if (frequencyHistogram[cardFace] === 4) {
      isFourOfAKind = true;
      frequencyHistogramMetaData.quads.push({
        face: cardFace,
        value: VALUE_MAP[cardFace]
      });
    }
    if (frequencyHistogram[cardFace] === 3) {
      isThreeOfAKind = true;
      numTripples++;
      frequencyHistogramMetaData.tripples.push({
        face: cardFace,
        value: VALUE_MAP[cardFace]
      });
    }
    if (frequencyHistogram[cardFace] === 2) {
      isPair = true;
      numPairs++;
      frequencyHistogramMetaData.pairs.push({
        face: cardFace,
        value: VALUE_MAP[cardFace]
      });
    }
  }

  frequencyHistogramMetaData.pairs = [...frequencyHistogramMetaData.pairs].sort((a, b) => b.value - a.value);
  frequencyHistogramMetaData.tripples = [...frequencyHistogramMetaData.tripples].sort((a, b) => b.value - a.value);
  frequencyHistogramMetaData.quads = [...frequencyHistogramMetaData.quads].sort((a, b) => b.value - a.value);

  if ((numTripples >= 2) || (numPairs >= 1 && numTripples >= 1)) {
    isFullHouse = true;
  }
  if (numPairs >= 2) {
    isTwoPair = true;
  }

  return {
    isFourOfAKind,
    isFullHouse,
    isThreeOfAKind,
    isTwoPair,
    isPair,
    frequencyHistogramMetaData
  };
}

export const checkStraight = (valueSet: number[]): {
  isStraight: boolean;
  isLowStraight: boolean;
  concurrentCardValues: number[];
  concurrentCardValuesLow: number[];
} => {
  if (valueSet.length < 5) {
    return {
      isStraight: false,
      isLowStraight: false,
      concurrentCardValues: [],
      concurrentCardValuesLow: []
    };
  }

  let numConcurrentCards = 0;
  let concurrentCardValues: number[] = [];
  
  for (let i = 1; i < valueSet.length; i++) {
    if (numConcurrentCards === 5) {
      return {
        isStraight: true,
        isLowStraight: false,
        concurrentCardValues,
        concurrentCardValuesLow: []
      };
    }
    
    if ((valueSet[i] - valueSet[i - 1]) === -1) {
      if (numConcurrentCards === 0) {
        numConcurrentCards = 2;
        concurrentCardValues.push(valueSet[i - 1]);
        concurrentCardValues.push(valueSet[i]);
      } else { 
        numConcurrentCards++;
        concurrentCardValues.push(valueSet[i]);
      }
    } else {
      numConcurrentCards = 0;
      concurrentCardValues = []; 
    }
  }
  
  if (numConcurrentCards >= 5) {
    return {
      isStraight: true,
      isLowStraight: false,
      concurrentCardValues,
      concurrentCardValuesLow: []
    };
  } else {
    if (valueSet[0] === 13) {
      const { isLowStraight, concurrentCardValuesLow } = checkLowStraight([...valueSet]);
      if (isLowStraight) {
        return {
          isStraight: true,
          isLowStraight,
          concurrentCardValues, 
          concurrentCardValuesLow,
        };
      }
    } 
    
    return { 
      isStraight: false,
      isLowStraight: false, 
      concurrentCardValues, 
      concurrentCardValuesLow: []
    }; 
  }
}

const checkLowStraight = (valueSetCopy: number[]): {
  isLowStraight: boolean;
  concurrentCardValuesLow: number[];
} => {
  let numConcurrentCards = 0;
  let concurrentCardValuesLow: number[] = [];
  valueSetCopy[0] = 0; // Convert Ace High Value (13) to Low Wildcard Value (0)
  const sortedValueSetCopy = [...valueSetCopy].sort((a, b) => a - b);
  
  for (let i = 1; i < 5; i++) {
    if (numConcurrentCards >= 5) {
      return {
        isLowStraight: true,
        concurrentCardValuesLow,
      };
    }
    
    if ((sortedValueSetCopy[i] - sortedValueSetCopy[i - 1]) === 1) {
      if (numConcurrentCards === 0) {
        numConcurrentCards = 2;
        concurrentCardValuesLow.push(sortedValueSetCopy[i - 1]);
        concurrentCardValuesLow.push(sortedValueSetCopy[i]);
      } else { 
        numConcurrentCards++;
        concurrentCardValuesLow.push(sortedValueSetCopy[i]); 
      }	
    } else { 
      numConcurrentCards = 0;
      concurrentCardValuesLow = [];
    }
  }
  
  if (numConcurrentCards >= 5) {
    return {
      isLowStraight: true,
      concurrentCardValuesLow,
    };
  } else { 
    return {
      isLowStraight: false,
      concurrentCardValuesLow,
    }; 
  }
}

export const buildValueSet = (hand: Card[]): number[] => {
  return Array.from(new Set(hand.map(cardInfo => cardInfo.value)));
}

export const dealMissingCommunityCards = (state: GameState): GameState => {
  const cardsToPop = 5 - state.communityCards.length;
  if (cardsToPop >= 1) {
    let animationDelay = 0;
    const { mutableDeckCopy, chosenCards } = popShowdownCards(state.deck, cardsToPop);
    
    const cardsArray = Array.isArray(chosenCards) ? chosenCards : [chosenCards];
    for (const card of cardsArray) {
      card.animationDelay = animationDelay;
      animationDelay += 250;
      state.communityCards.push(card);
    }

    state.deck = mutableDeckCopy;
  }
  state.phase = 'showdown';
  return state;
}