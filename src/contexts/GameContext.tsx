// src/contexts/GameContext.tsx
import React, { createContext, useContext, useReducer } from 'react';
import { buildDeck } from '../utils/web3/buildDeck';

type PlayerType = {
  id: string;
  name: string;
  chips: number;
  cards: any[];
  isActive: boolean;
  position: number;
  isTurn: boolean;
  // Web3 additions
  address?: string;         // Player's wallet address
  isConnected: boolean;     // Is player currently connected
  betTxHash?: string;       // Hash of their last bet transaction
  lastAction?: string;      // Last action taken (fold, check, call, raise)
  pendingAction?: boolean;  // Is there a pending transaction
};

type GameState = {
  isGameStarted: boolean;
  deck: any[];
  players: PlayerType[];
  communityCards: any[];
  pot: number;
  currentBet: number;
  turn: number;
  phase: 'idle' | 'preflop' | 'flop' | 'turn' | 'river' | 'showdown';
  // Web3 additions
  tableId?: string;          // Unique table ID on blockchain
  handId?: string;           // Current hand ID
  tokenSymbol?: string;      // Symbol for the token being used (MATIC, ETH, etc)
  contractAddress?: string;  // Address of the poker game contract
  currentPlayerAddress?: string; // Current user's wallet address
  pendingTransactions: any[]; // List of pending txns
};

const initialState: GameState = {
  isGameStarted: false,
  deck: [],
  players: [],
  communityCards: [],
  pot: 0,
  currentBet: 0,
  turn: 0,
  phase: 'idle',
  pendingTransactions: [],
};

type GameAction =
  | { type: 'START_GAME'; payload: { playerCount: number } }
  | { type: 'DEAL_CARDS' }
  | { type: 'DEAL_FLOP' }
  | { type: 'DEAL_TURN' }
  | { type: 'DEAL_RIVER' }
  | { type: 'PLAYER_ACTION'; payload: { action: string; amount?: number } }
  | { type: 'RESET_GAME' };

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      const { playerCount } = action.payload;
      const deck = buildDeck();
      // Shuffle the deck
      const shuffledDeck = [...deck].sort(() => Math.random() - 0.5);
      
      // Create players (6 by default)
      const players = Array(playerCount || 6).fill(null).map((_, index) => ({
        id: `player-${index}`,
        name: index === 0 ? 'You' : `Player ${index}`,
        chips: 5000, // Starting chips
        cards: [],
        isActive: true,
        position: index,
        isTurn: index === 0, // First player starts
        isConnected: true, // Web3 addition
      }));
      
      return {
        ...state,
        isGameStarted: true,
        deck: shuffledDeck,
        players,
        phase: 'preflop',
      };

    case 'DEAL_CARDS':
      // Deal 2 cards to each player
      const dealtCards = [...state.deck];
      const updatedPlayers = state.players.map(player => {
        // Take 2 cards from the deck for each player
        const cards = [dealtCards.shift(), dealtCards.shift()];
        return { ...player, cards };
      });
      
      return {
        ...state,
        deck: dealtCards,
        players: updatedPlayers,
      };

    case 'DEAL_FLOP':
      // Deal flop (3 community cards)
      const deckAfterFlop = [...state.deck];
      // Burn a card
      deckAfterFlop.shift();
      // Deal 3 cards
      const flopCards = [
        deckAfterFlop.shift(),
        deckAfterFlop.shift(),
        deckAfterFlop.shift(),
      ];
      
      return {
        ...state,
        deck: deckAfterFlop,
        communityCards: flopCards,
        phase: 'flop',
      };

    case 'DEAL_TURN':
      // Deal turn (4th community card)
      const deckAfterTurn = [...state.deck];
      // Burn a card
      deckAfterTurn.shift();
      // Deal 1 card
      const turnCard = deckAfterTurn.shift();
      
      return {
        ...state,
        deck: deckAfterTurn,
        communityCards: [...state.communityCards, turnCard],
        phase: 'turn',
      };

    case 'DEAL_RIVER':
      // Deal river (5th community card)
      const deckAfterRiver = [...state.deck];
      // Burn a card
      deckAfterRiver.shift();
      // Deal 1 card
      const riverCard = deckAfterRiver.shift();
      
      return {
        ...state,
        deck: deckAfterRiver,
        communityCards: [...state.communityCards, riverCard],
        phase: 'river',
      };

    case 'PLAYER_ACTION':
      // Handle player actions (fold, check, call, raise)
      // This would be more complex in a real implementation
      return state;

    case 'RESET_GAME':
      return initialState;

    default:
      return state;
  }
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