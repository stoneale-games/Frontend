import { create } from "zustand/react";
import type { PlayerState, CardType, PlayerAction } from "@/components/game/types";

// --- Define the shape of our state ---
interface GameState {
    phase: 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown';
    pot: number;
    communityCards: CardType[];
    players: PlayerState[];
    turnIndex: number;
    isActive: boolean;
    lastAction: PlayerAction | null;
}

// --- Actions ---
interface GameActions {
    setGame: (game: Partial<GameState>) => void;
    updateGame: (updates: Partial<GameState>) => void;
    reset: () => void;
}

const initialState: GameState = {
    phase: 'pre-flop',
    pot: 0,
    communityCards: [],
    players: [],
    turnIndex: 0,
    isActive: false,
    lastAction: null,
};

// --- Store ---
const useGameStore = create<GameState & GameActions>((set) => ({
    ...initialState,

    setGame: (game) => set({ ...initialState, ...game }),
    updateGame: (updates) => set((state) => ({ ...state, ...updates })),
    reset: () => set(initialState),
}));

export default useGameStore;
