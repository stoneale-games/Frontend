// src/store/gameStore.ts
import { create } from "zustand";
import type { GameState } from "@/components/game/types";

interface GameStore {
    game: GameState | null;
    setGame: (game: GameState) => void;
    clearGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
    game: null,
    setGame: (game) => set({ game }),
    clearGame: () => set({ game: null }),
}));
