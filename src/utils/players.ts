import { v1 as uuid } from 'uuid';
import { handlePhaseShift, reconcilePot, anteUpBlinds, determineBlindIndices } from './bet';
import { dealMissingCommunityCards, showDown, generateDeckOfCards, shuffle, dealPrivateCards } from './cards';
import axios from 'axios';
import { GameState, Player } from './types/index';

export const generateTable = async (): Promise<Player[]> => {
  const users: Player[] = [{
    id: uuid(),
    name: 'Player 1',
    avatarURL: '/player.ng',
    cards: [],
    showDownHand: {
      hand: [],
      descendingSortHand: [], 
    },
    chips: 20000,
    roundStartChips: 20000,
    roundEndChips: 20000,
    currentRoundChipsInvested: 0,
    bet: 0,
    betReconciled: false,
    folded: false,
    allIn: false,
    canRaise: true,
    stackInvestment: 0,
    robot: false
  }];

  const response = await axios.get(`https://randomuser.me/api/?results=4&nat=us,gb,fr`);
  response.data.results
    .map((user:any) => {
      const randomizedChips = Math.floor(Math.random() * (20000 - 18000)) + 18000;
      return {
        id: uuid(),
        name: `${user.name.first.charAt(0).toUpperCase()}${user.name.first.slice(1)} ${user.name.last.charAt(0).toUpperCase()}${user.name.last.slice(1)}`,
        avatarURL: user.picture.large,
        cards: [],
        chips: randomizedChips,
        roundStartChips: randomizedChips,
        roundEndChips: randomizedChips,
        currentRoundChipsInvested: 0,
        showDownHand: {
          hand: [],
          descendingSortHand: [],
        },
        bet: 0,
        betReconciled: false,
        folded: false,
        allIn: false,
        robot: true,
        canRaise: true,
        stackInvestment: 0,
      };
    })
    .forEach((user:any) => users.push(user));

  return users;
}

export const generatePersonality = (seed: number): string => {
  if (seed > 0.5) return 'standard';
  if (seed > 0.35) return 'aggressive';
  return 'conservative';
}

export const handleOverflowIndex = (
  currentIndex: number, 
  incrementBy: number, 
  arrayLength: number, 
  direction: 'up' | 'down'
): number => {
  switch (direction) {
    case 'up': return (currentIndex + incrementBy) % arrayLength;
    case 'down': return ((currentIndex - incrementBy) % arrayLength) + arrayLength;
    default: throw new Error("Attempted to overflow index on unfamiliar direction");
  }
}

export const determinePhaseStartActivePlayer = (state: GameState, recursion = false): GameState => {
  if (!recursion) {
    state.activePlayerIndex = handleOverflowIndex(state.blindIndex.big, 1, state.players.length, 'up');
  } else if (recursion) {
    state.activePlayerIndex = handleOverflowIndex(state.activePlayerIndex, 1, state.players.length, 'up');
  }
  
  if (state.players[state.activePlayerIndex].folded) {
    return determinePhaseStartActivePlayer(state, true);
  }
  if (state.players[state.activePlayerIndex].chips === 0) {
    return determinePhaseStartActivePlayer(state, true);
  }
  return state;
}

export const determineNextActivePlayer = (state: GameState): GameState => {
  state.activePlayerIndex = handleOverflowIndex(state.activePlayerIndex, 1, state.players.length, 'up');
  const activePlayer = state.players[state.activePlayerIndex];

  const allButOnePlayersAreAllIn = (state.numPlayersActive - state.numPlayersAllIn === 1);
  if (state.numPlayersActive === 1) {
    console.log("Only one player active, skipping to showdown.");
    return showDown(reconcilePot(dealMissingCommunityCards(state)));
  }
  if (activePlayer.folded) {
    console.log("Current player index is folded, going to next active player.");
    return determineNextActivePlayer(state);
  }

  if (allButOnePlayersAreAllIn && !activePlayer.folded && activePlayer.betReconciled) {
    return showDown(reconcilePot(dealMissingCommunityCards(state)));
  }

  if (activePlayer.chips === 0) {
    if (state.numPlayersAllIn === state.numPlayersActive) {
      console.log("All players are all in.");
      return showDown(reconcilePot(dealMissingCommunityCards(state)));
    } else if (allButOnePlayersAreAllIn && activePlayer.allIn) {
      return showDown(reconcilePot(dealMissingCommunityCards(state)));
    } else {
      return determineNextActivePlayer(state);
    }
  }

  if (activePlayer.betReconciled) {
    console.log("Player is reconciled with pot, round betting cycle complete, proceed to next round.");
    return handlePhaseShift(state);
  }

  return state;
}

export const passDealerChip = (state: GameState): GameState => {
  state.dealerIndex = handleOverflowIndex(state.dealerIndex, 1, state.players.length, 'up');
  const nextDealer = state.players[state.dealerIndex];
  if (nextDealer.chips === 0) {
    return passDealerChip(state);
  }
  return filterBrokePlayers(state, nextDealer.name);
}

export const filterBrokePlayers = (state: GameState, dealerID: string): GameState => {
  state.players = state.players.filter(player => player.chips > 0);
  const newDealerIndex = state.players.findIndex(player => player.name === dealerID);
  state.dealerIndex = newDealerIndex;
  state.activePlayerIndex = newDealerIndex;
  
  if (state.players.length === 1) {
    return state;
  } else if (state.players.length === 2) {
    state.blindIndex.small = newDealerIndex;
    state.blindIndex.big = handleOverflowIndex(newDealerIndex, 1, state.players.length, 'up');
    state.players = anteUpBlinds(state.players, { 
      bigBlindIndex: state.blindIndex.big, 
      smallBlindIndex: state.blindIndex.small 
    }, state.minBet).map(player => ({
      ...player,
      cards: [],
      showDownHand: {
        hand: [],
        descendingSortHand: [],
      },
      roundStartChips: player.chips + player.bet,
      currentRoundChipsInvested: 0,
      betReconciled: false,
      folded: false,
      allIn: false,
    }));
    state.numPlayersAllIn = 0;
    state.numPlayersFolded = 0;
    state.numPlayersActive = state.players.length;
  } else {
    const blindIndices = determineBlindIndices(newDealerIndex, state.players.length);
    state.blindIndex = {
      big: blindIndices.bigBlindIndex,
      small: blindIndices.smallBlindIndex,
    };
    state.players = anteUpBlinds(state.players, blindIndices, state.minBet).map(player => ({
      ...player,
      cards: [],
      showDownHand: {
        hand: [],
        descendingSortHand: [],
      },
      roundStartChips: player.chips + player.bet,
      currentRoundChipsInvested: 0,
      betReconciled: false,
      folded: false,
      allIn: false,
    }));
    state.numPlayersAllIn = 0;
    state.numPlayersFolded = 0;
    state.numPlayersActive = state.players.length;
  }
  return dealPrivateCards(state);
}

export const beginNextRound = (state: GameState): GameState => {
  state.communityCards = [];
  state.sidePots = [];
  state.playerHierarchy = [];
  state.showDownMessages = [];
  state.deck = shuffle(generateDeckOfCards());
  state.highBet = 20;
  state.betInputValue = 20;
  state.minBet = 20;
  
  const { players } = state;
  const clearPlayerCards = players.map(player => ({
    ...player, 
    cards: []
  }))
  state.players = clearPlayerCards;
  return passDealerChip(state);
}

export const checkWin = (players: Player[]): boolean => {
  return (players.filter(player => player.chips > 0).length === 1);
}