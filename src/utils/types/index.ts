export type TImg = {
  src: string;
  alt: string;
};

export type TDisplays = {
  message: boolean;
};

export interface Card {
  id?: number;
  display: string;
  value: number;
  suit: string;
  solo?: string;
  ipfs_cid?: string;
  cardFace: string;

}
// export interface Card {

// }

export interface Player {
  name: string;
  
  // Chips and betting properties
  chips: number;
  bet: number;
  betReconciled: boolean;
  currentRoundChipsInvested: number;
  stackInvestment?: number;
  sidePotStack: number;
  
  // Player status
  folded: boolean;
  allIn: boolean;
  canRaise?: boolean;
  
  // Player cards
  cards: Card[];
}

export interface SidePot {
  contestants: string[];
  potValue: number;
}

export interface GameState {
  // Players
  players: Player[];
  activePlayerIndex: number;
  numPlayersAllIn: number;
  numPlayersFolded: number;
  numPlayersActive: number;
  
  // Betting
  pot: number;
  highBet: number;
  minBet: number;
  betInputValue: number;
  sidePots: SidePot[];
  
  // Game progression
  phase: 'betting1' | 'betting2' | 'betting3' | 'betting4' | 'flop' | 'turn' | 'river' | 'showdown';
  communityCards: Card[];
}

export interface Histogram {
  frequencyHistogram: Record<string, number>;
  suitHistogram: Record<string, number>;
}

export interface FrequencyHistogramMetaData {
  [key: string]: any;
}

export interface BlindIndices {
  bigBlindIndex: number;
  smallBlindIndex: number;
}

export type PushAnimationStateFn = (playerIndex: number, message: string) => void;