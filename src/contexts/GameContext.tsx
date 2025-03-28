// src/contexts/GameContext.tsx
import React, { createContext, useContext, useReducer } from 'react';
import { generateDeckOfCards, shuffle} from '../utils/cards';
import {  determineBlindIndices, anteUpBlinds } from '../utils/bet';
// import { handleOverflowIndex, determineNextActivePlayer, generateTable } from '../utils/players';
// import { handleAI } from '../utils/ai';
import { Card, Player } from '../utils/types';

// Types for our game context
export type CardType = {
  cardFace: string;
  suit: string;
  value: number;
  ipfs_cid?: string; // Added for UI display compatibility
  display?: string;   // Added for UI display compatibility
  animationDelay?: number;
};

export type PlayerType = {
  id: string;
  name: string;
  chips: number;
  roundStartChips?: number;
  roundEndChips?: number;
  currentRoundChipsInvested?: number;
  bet: number;
  currentBet: number;
  sidePotStack?: number;
  betReconciled?: boolean;
  cards: CardType[];
  showDownHand?: any;
  folded: boolean;
  allIn: boolean;
  canRaise?: boolean;
  position: number;
  isTurn: boolean;
  isDealer?: boolean;
  isSmallBlind?: boolean;
  isBigBlind?: boolean;
  lastAction?: string;
  stackInvestment?: number;
  avatarURL?: string;
  robot?: boolean;
};

export type SidePot = {
  contestants: string[];
  potValue: number;
};

export type GameState = {
  isGameStarted: boolean;
  deck: Card[];
  players: PlayerType[];
  communityCards: Card[];
  pot: number;
  highBet: number;
  currentBet: number;
  minBet: number;
  minRaise: number;
  betInputValue: number;
  sidePots: SidePot[];
  dealerIndex: number;
  blindIndex: {
    big: number;
    small: number;
  };
  activePlayerIndex: number;
  numPlayersAllIn: number;
  numPlayersFolded: number;
  numPlayersActive: number;
  phase: 'idle' | 'betting1' | 'flop' | 'betting2' | 'turn' | 'betting3' | 'river' | 'betting4' | 'showdown';
  tableId: string;
  handId: string;
  roundOver: boolean;
  winners: PlayerType[];
  handStrengths: Record<string, { rank: string; value: number[] }>;
  showDownMessages?: any[];
  playerHierarchy?: any[];
};

const initialState: GameState = {
  isGameStarted: false,
  deck: [],
  players: [],
  communityCards: [],
  pot: 0,
  highBet: 0,
  currentBet: 0,
  minBet: 20,
  minRaise: 20,
  betInputValue: 20,
  sidePots: [],
  dealerIndex: 0,
  blindIndex: {
    big: 0,
    small: 0
  },
  activePlayerIndex: 0,
  numPlayersAllIn: 0,
  numPlayersFolded: 0,
  numPlayersActive: 0,
  phase: 'idle',
  tableId: 'T' + Math.floor(Math.random() * 1000),
  handId: 'H' + Math.floor(Math.random() * 10000),
  roundOver: false,
  winners: [],
  handStrengths: {},
  showDownMessages: [],
  playerHierarchy: []
};

type GameAction =
  | { type: 'START_GAME'; payload: { playerCount: number } }
  | { type: 'DEAL_CARDS' }
  | { type: 'DEAL_FLOP' }
  | { type: 'DEAL_TURN' }
  | { type: 'DEAL_RIVER' }
  | { type: 'PLAYER_ACTION'; payload: { playerId: string; action: string; amount?: number } }
  | { type: 'NEXT_PLAYER' }
  | { type: 'EVALUATE_HANDS' }
  | { type: 'END_ROUND' }
  | { type: 'RESET_ROUND' }
  | { type: 'RESET_GAME' };

// Add a function to generate mock IPFS CID for card images
const generateMockIpfsCid = (card: CardType): string => {
  const suitMap: Record<string, string> = {
    'Heart': 'h',
    'Spade': 's',
    'Club': 'c',
    'Diamond': 'd'
  };
  
  const valueMap: Record<string, string> = {
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '10': '10',
    'J': 'j',
    'Q': 'q',
    'K': 'k',
    'A': 'a'
  };
  
  // In a real implementation, this would be an actual IPFS CID
  // For now, we'll return a placeholder that represents the card
  return `QmCard${valueMap[card.cardFace]}${suitMap[card.suit]}`;
};

// Function to push animation state messages to the UI
// const pushAnimationState = (state: GameState, playerIndex: number, message: string): GameState => {
//   // In a real implementation, this would update some UI state
//   // For now, just return the state unchanged
//   return state;
// };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME': {
      // Initialize a new game
      const deck = shuffle(generateDeckOfCards());
      
      // Create players (6 by default)
      const numPlayers = action.payload.playerCount || 6;
      const players: PlayerType[] = Array(numPlayers).fill(null).map((_, index) => ({
        id: `player-${index}`,
        name: index === 0 ? 'You' : `AI Player ${index}`,
        chips: 1000,
        bet: 0,
        currentBet: 0,
        betReconciled: false,
        cards: [],
        folded: false,
        allIn: false,
        position: index,
        isTurn: false,
        lastAction: ''
      }));
      
      // Set up dealer and blinds
      const dealerIndex = 0;
      const blindIndices = determineBlindIndices(dealerIndex, numPlayers);
      
      // Post blinds
      const updatedPlayers = anteUpBlinds(players as unknown as Player[], blindIndices, state.minBet) as unknown as PlayerType[];
      
      // Mark player roles
      players.forEach((player, index) => {
        player.isDealer = index === dealerIndex;
        player.isSmallBlind = index === blindIndices.smallBlindIndex;
        player.isBigBlind = index === blindIndices.bigBlindIndex;
        if (index === blindIndices.smallBlindIndex) player.lastAction = 'small blind';
        if (index === blindIndices.bigBlindIndex) player.lastAction = 'big blind';
      });
      
      // First player to act after blinds
      const firstToAct = (blindIndices.bigBlindIndex + 1) % numPlayers;
      players[firstToAct].isTurn = true;
      
      return {
        ...state,
        isGameStarted: true,
        deck,
        players: updatedPlayers,
        pot: state.minBet + (state.minBet / 2), // big blind + small blind
        currentBet: state.minBet,
        highBet: state.minBet,
        activePlayerIndex: firstToAct,
        dealerIndex,
        blindIndex: {
          big: blindIndices.bigBlindIndex,
          small: blindIndices.smallBlindIndex
        },
        numPlayersActive: numPlayers,
        phase: 'betting1',
        roundOver: false,
        winners: [],
        handStrengths: {}
      };
    }

    case 'DEAL_CARDS': {
      // Deal 2 cards to each player
      const dealtCards = [...state.deck];
      let cardIndex = 0;
      
      const updatedPlayers = state.players.map(player => {
        // Take 2 cards from the deck for each player
        const playerCards = [
          { ...dealtCards[cardIndex++], ipfs_cid: generateMockIpfsCid(dealtCards[cardIndex-1]), display: `${dealtCards[cardIndex-1].cardFace} of ${dealtCards[cardIndex-1].suit}` },
          { ...dealtCards[cardIndex++], ipfs_cid: generateMockIpfsCid(dealtCards[cardIndex-1]), display: `${dealtCards[cardIndex-1].cardFace} of ${dealtCards[cardIndex-1].suit}` }
        ];
        
        return { ...player, cards: playerCards };
      });
      
      // Remove the dealt cards from the deck
      const remainingDeck = dealtCards.slice(cardIndex);
      
      return {
        ...state,
        deck: remainingDeck,
        players: updatedPlayers
      };
    }

    case 'DEAL_FLOP': {
      // Burn a card and deal the flop (3 community cards)
      const updatedDeck = [...state.deck];
      let cardIndex = 1; // Skip the first card (burn card)
      
      const flopCards = [
        { ...updatedDeck[cardIndex++], ipfs_cid: generateMockIpfsCid(updatedDeck[cardIndex-1]), display: `${updatedDeck[cardIndex-1].cardFace} of ${updatedDeck[cardIndex-1].suit}` },
        { ...updatedDeck[cardIndex++], ipfs_cid: generateMockIpfsCid(updatedDeck[cardIndex-1]), display: `${updatedDeck[cardIndex-1].cardFace} of ${updatedDeck[cardIndex-1].suit}` },
        { ...updatedDeck[cardIndex++], ipfs_cid: generateMockIpfsCid(updatedDeck[cardIndex-1]), display: `${updatedDeck[cardIndex-1].cardFace} of ${updatedDeck[cardIndex-1].suit}` }
      ];
      
      // Reset betting for the new round
    const updatedPlayers = state.players.map(player => ({
  ...player,
  currentBet: 0,
  lastAction: '', // Ensure this is always reset
  isTurn: false
}));
      // Find first active player after dealer
      let firstToAct = state.dealerIndex;
      do {
        firstToAct = (firstToAct + 1) % state.players.length;
      } while (state.players[firstToAct].folded || state.players[firstToAct].allIn);
      
      const finalUpdatedPlayers = updatedPlayers.map((p, i) => ({
        ...p,
        isTurn: i === firstToAct && !p.folded && !p.allIn
      }));
      
      return {
        ...state,
        deck: updatedDeck.slice(cardIndex),
        communityCards: flopCards,
        phase: 'betting2',
        players: finalUpdatedPlayers,
        currentBet: 0,
        highBet: 0,
        activePlayerIndex: firstToAct
      };
    }

    case 'DEAL_TURN': {
      // Burn a card and deal the turn
      const updatedDeck = [...state.deck];
      let cardIndex = 1; // Skip the first card (burn card)
      
      const turnCard = {
        ...updatedDeck[cardIndex],
        ipfs_cid: generateMockIpfsCid(updatedDeck[cardIndex]),
        display: `${updatedDeck[cardIndex].cardFace} of ${updatedDeck[cardIndex].suit}`
      };
      
      // Reset betting for the new round
      const updatedPlayers = state.players.map(player => ({
        ...player,
        currentBet: 0,
        lastAction: '',
        isTurn: false
      }));
      
      // Find first active player after dealer
      let firstToAct = state.dealerIndex;
      do {
        firstToAct = (firstToAct + 1) % state.players.length;
      } while (state.players[firstToAct].folded || state.players[firstToAct].allIn);
      
      const finalUpdatedPlayers = updatedPlayers.map((p, i) => ({
        ...p,
        isTurn: i === firstToAct && !p.folded && !p.allIn
      }));
      
      return {
        ...state,
        deck: updatedDeck.slice(cardIndex + 1),
        communityCards: [...state.communityCards, turnCard],
        phase: 'betting3',
        players: finalUpdatedPlayers,
        currentBet: 0,
        highBet: 0,
        activePlayerIndex: firstToAct
      };
    }

    case 'DEAL_RIVER': {
      // Burn a card and deal the river
      const updatedDeck = [...state.deck];
      let cardIndex = 1; // Skip the first card (burn card)
      
      const riverCard = {
        ...updatedDeck[cardIndex],
        ipfs_cid: generateMockIpfsCid(updatedDeck[cardIndex]),
        display: `${updatedDeck[cardIndex].cardFace} of ${updatedDeck[cardIndex].suit}`
      };
      
      // Reset betting for the new round
      const updatedPlayers = state.players.map(player => ({
        ...player,
        currentBet: 0,
        lastAction: '',
        isTurn: false
      }));
      
      // Find first active player after dealer
      let firstToAct = state.dealerIndex;
      do {
        firstToAct = (firstToAct + 1) % state.players.length;
      } while (state.players[firstToAct].folded || state.players[firstToAct].allIn);
      
      const finalUpdatedPlayers = updatedPlayers.map((p, i) => ({
        ...p,
        isTurn: i === firstToAct && !p.folded && !p.allIn
      }));
      
      return {
        ...state,
        deck: updatedDeck.slice(cardIndex + 1),
        communityCards: [...state.communityCards, riverCard],
        phase: 'betting4',
        players: finalUpdatedPlayers,
        currentBet: 0,
        highBet: 0,
        activePlayerIndex: firstToAct
      };
    }

    case 'PLAYER_ACTION': {
      const { playerId, action: actionType, amount = 0 } = action.payload;
      const playerIndex = state.players.findIndex(p => p.id === playerId);
      
      if (playerIndex === -1) return state;
      
      const player = state.players[playerIndex];
      let updatedPlayers = [...state.players];
      let newPot = state.pot;
      let newCurrentBet = state.currentBet;
      let newHighBet = state.highBet;
      
      // Handle different player actions
      switch (actionType) {
        case 'fold':
          updatedPlayers[playerIndex] = {
            ...player,
            folded: true,
            isTurn: false,
            lastAction: 'fold'
          };
          break;
          
        case 'check':
          updatedPlayers[playerIndex] = {
            ...player,
            lastAction: 'check',
            isTurn: false
          };
          break;
          
        case 'call':
          const callAmount = Math.min(player.chips, state.currentBet - player.bet);
          updatedPlayers[playerIndex] = {
            ...player,
            chips: player.chips - callAmount,
            bet: player.bet + callAmount,
            lastAction: 'call',
            isTurn: false,
            allIn: (player.chips - callAmount) === 0
          };
          newPot += callAmount;
          break;
          
        case 'raise':
          const raiseAmount = Math.min(player.chips, amount);
          if (raiseAmount > 0) {
            updatedPlayers[playerIndex] = {
              ...player,
              chips: player.chips - raiseAmount,
              bet: player.bet + raiseAmount,
              lastAction: 'raise',
              isTurn: false,
              allIn: (player.chips - raiseAmount) === 0
            };
            newPot += raiseAmount;
            newCurrentBet = player.bet + raiseAmount;
            newHighBet = Math.max(newHighBet, newCurrentBet);
            
            // Reset other players' isTurn since someone raised
            updatedPlayers = updatedPlayers.map((p, i) => {
              if (i !== playerIndex && !p.folded && !p.allIn) {
                return {
                  ...p,
                  isTurn: false
                };
              }
              return p;
            });
          }
          break;
      }
      
      // Find next player's turn
      let nextPlayerIndex = (playerIndex + 1) % state.players.length;
while (
  nextPlayerIndex !== playerIndex && 
  (updatedPlayers[nextPlayerIndex].folded || 
   updatedPlayers[nextPlayerIndex].allIn)
) {
  nextPlayerIndex = (nextPlayerIndex + 1) % state.players.length;
}
      
      // If we've gone all the way around, no active players left
      if (nextPlayerIndex === playerIndex || allPlayersActed(updatedPlayers)) {
        // Move to next phase
        return {
          ...state,
          players: updatedPlayers,
          pot: newPot,
          currentBet: newCurrentBet,
          highBet: newHighBet,
          activePlayerIndex: 0 // Will be updated in next phase
        };
      }
      
      // Set next player's turn
      updatedPlayers[nextPlayerIndex].isTurn = true;
      
      console.log("Next player to act:", nextPlayerIndex, updatedPlayers[nextPlayerIndex]?.name);
      
      return {
        ...state,
        players: updatedPlayers,
        pot: newPot,
        currentBet: newCurrentBet,
        highBet: newHighBet,
        activePlayerIndex: nextPlayerIndex
      };
    }

    case 'NEXT_PLAYER': {
      // Find the next active player
      let nextPlayerIndex = (state.activePlayerIndex + 1) % state.players.length;
      let foundNextPlayer = false;
      
      const updatedPlayers = state.players.map((player, _) => ({
        ...player,
        isTurn: false
      }));
      
      // Find the next player who can act
      while (!foundNextPlayer && nextPlayerIndex !== state.activePlayerIndex) {
        if (!updatedPlayers[nextPlayerIndex].folded && !updatedPlayers[nextPlayerIndex].allIn) {
          foundNextPlayer = true;
          updatedPlayers[nextPlayerIndex].isTurn = true;
        } else {
          nextPlayerIndex = (nextPlayerIndex + 1) % state.players.length;
        }
      }
      
      // Check if the round of betting is complete
      if (!foundNextPlayer || allPlayersBetEqual(updatedPlayers, state.currentBet)) {
        // Move to next phase based on current phase
        let nextPhase = state.phase;
        switch (state.phase) {
          case 'betting1': nextPhase = 'flop'; break;
          case 'betting2': nextPhase = 'turn'; break;
          case 'betting3': nextPhase = 'river'; break;
          case 'betting4': nextPhase = 'showdown'; break;
        }
        
        return {
          ...state,
          players: updatedPlayers,
          phase: nextPhase,
          activePlayerIndex: nextPlayerIndex
        };
      }
      
      return {
        ...state,
        players: updatedPlayers,
        activePlayerIndex: nextPlayerIndex
      };
    }

    case 'EVALUATE_HANDS': {
      // In a real implementation, we'd evaluate poker hands here
      // For now, just pick a random winner
      const activePlayers = state.players.filter(p => !p.folded);
      
      // If only one player remains, they win
      if (activePlayers.length === 1) {
        return {
          ...state,
          phase: 'showdown',
          roundOver: true,
          winners: activePlayers
        };
      }
      
      // For demo purposes, pick the human player as winner
      const winner = activePlayers.find(p => p.position === 0) || activePlayers[0];
      
      return {
        ...state,
        phase: 'showdown',
        roundOver: true,
        winners: [winner],
        handStrengths: {
          [winner.id]: { rank: 'Pair', value: [10, 10, 8, 5, 2] }
        }
      };
    }

    case 'END_ROUND': {
      // Distribute the pot to the winners
      const winners = state.winners;
      const potPerWinner = Math.floor(state.pot / winners.length);
      
      const updatedPlayers = state.players.map(player => {
        const isWinner = winners.some(w => w.id === player.id);
        return {
          ...player,
          chips: isWinner ? player.chips + potPerWinner : player.chips,
          lastAction: isWinner ? 'winner' : player.lastAction
        };
      });
      
      return {
        ...state,
        players: updatedPlayers,
        pot: 0,
        roundOver: true
      };
    }

    case 'RESET_ROUND': {
      // Move the dealer button and reset for a new hand
      const newDealerPosition = (state.dealerIndex + 1) % state.players.length;
      const blindIndices = determineBlindIndices(newDealerPosition, state.players.length);
      
      // Reset player states for a new hand
      let updatedPlayers = state.players.map((player, index) => ({
        ...player,
        cards: [],
        bet: 0,
        currentBet: 0,
        lastAction: '',
        folded: false,
        allIn: false,
        isDealer: index === newDealerPosition,
        isSmallBlind: index === blindIndices.smallBlindIndex,
        isBigBlind: index === blindIndices.bigBlindIndex,
        isTurn: false
      }));
      
      // Post blinds
      const playersForBlinds = updatedPlayers.map(player => ({
        ...player,
        cards: [] as Card[]  // This ensures compatibility with Player type
      }));
      
      const playersWithBlinds = anteUpBlinds(playersForBlinds as unknown as Player[], blindIndices, state.minBet);
      
      // Merge the blind changes back to our players
      updatedPlayers = updatedPlayers.map((player, idx) => ({
        ...player,
        chips: playersWithBlinds[idx].chips,
        bet: playersWithBlinds[idx].bet,
        currentBet: playersWithBlinds[idx].currentBet || 0
      }));
      
      // Set action to player after big blind
      const firstToAct = (blindIndices.bigBlindIndex + 1) % state.players.length;
      updatedPlayers[firstToAct].isTurn = true;
      
      // Set blind actions
      updatedPlayers[blindIndices.smallBlindIndex].lastAction = 'small blind';
      updatedPlayers[blindIndices.bigBlindIndex].lastAction = 'big blind';
      
      return {
        ...state,
        dealerIndex: newDealerPosition,
        blindIndex: {
          big: blindIndices.bigBlindIndex,
          small: blindIndices.smallBlindIndex
        },
        deck: shuffle(generateDeckOfCards()),
        communityCards: [],
        players: updatedPlayers,
        pot: state.minBet + (state.minBet / 2), // big blind + small blind
        currentBet: state.minBet,
        highBet: state.minBet,
        phase: 'betting1',
        handId: 'H' + Math.floor(Math.random() * 10000),
        roundOver: false,
        winners: [],
        handStrengths: {},
        activePlayerIndex: firstToAct,
        numPlayersAllIn: 0,
        numPlayersFolded: 0,
        numPlayersActive: updatedPlayers.length
      };
    }

    case 'RESET_GAME':
      return initialState;

    default:
      return state;
  }
};

// Helper functions
const allPlayersActed = (players: PlayerType[]): boolean => {
  return players.every(player => 
    player.folded || 
    player.allIn || 
    player.lastAction !== ''
  );
};

const allPlayersBetEqual = (players: PlayerType[], currentBet: number): boolean => {
  return players.every(player => 
    player.folded || 
    player.allIn || 
    player.bet === currentBet
  );
};

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};