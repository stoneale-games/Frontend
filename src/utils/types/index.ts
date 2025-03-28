export type TImg = {
  src: string;
  alt: string;
};

export type TDisplays = {
  message: boolean;
};

export interface Card {
  id?: number;
  display?: string;
  value: number;
  suit: string;
  solo?: string;
  ipfs_cid?: string;
  cardFace: string;
  animationDelay?: number;

}


export interface ShowDownHand {
  hand: Card[];
  descendingSortHand: Card[];
  bestHandRank?: string;
  bestHand?: Card[];
  bools?: {
    isRoyalFlush: boolean;
    isStraightFlush: boolean;
    isFourOfAKind: boolean;
    isFullHouse: boolean;
    isFlush: boolean;
    isStraight: boolean;
    isThreeOfAKind: boolean;
    isTwoPair: boolean;
    isPair: boolean;
    isNoPair: boolean;
  };
  heldRankHierarchy?: Array<{
    name: string;
    match: boolean;
  }>;
}

export interface Player {
  id: string;
  name: string;
  avatarURL: string;
  cards: Card[];
  showDownHand: ShowDownHand;
  chips: number;
  roundStartChips: number;
  roundEndChips: number;
  currentRoundChipsInvested: number;
  bet: number;
  betReconciled: boolean;
  folded: boolean;
  allIn: boolean;
  canRaise: boolean;
  stackInvestment: number;
  robot: boolean;
  sidePotStack?: number;
  frequencyHistogram?: Record<string, number>;
  suitHistogram?: Record<string, number>;
  metaData?: any;
  currentBet?: number;
}

export interface SidePot {
  contestants: string[];
  potValue: number;
}

export interface GameState {
  loading?: boolean;
  players: Player[];
  communityCards: Card[];
  deck: Card[];
  phase: string;
  activePlayerIndex: number;
  dealerIndex: number;
  blindIndex: {
    big: number;
    small: number;
  };
  highBet: number;
  minBet: number;
  betInputValue: number;
  pot: number;
  sidePots: SidePot[];
  numPlayersAllIn: number;
  numPlayersFolded: number;
  numPlayersActive: number;
  playerHierarchy?: any[];
  showDownMessages?: Array<{
    users: string[];
    prize: number;
    rank: string;
  }>;
  clearCards?: boolean;
  playerAnimationSwitchboard?: Record<number, {isAnimating: boolean, content: string | null}>;
  winnerFound?: any;
  playActionMessages: any[];
}

export type Phase = 
  | 'loading' 
  | 'initialDeal' 
  | 'betting1' 
  | 'flop' 
  | 'betting2' 
  | 'turn' 
  | 'betting3' 
  | 'river' 
  | 'betting4' 
  | 'showdown';

export type Suit = 'Heart' | 'Diamond' | 'Spade' | 'Club';

export interface BlindIndices {
  bigBlindIndex: number;
  smallBlindIndex: number;
}

export interface FrequencyHistogramMetaData {
  pairs: Array<{ face: string; value: number }>;
  tripples: Array<{ face: string; value: number }>;
  quads: Array<{ face: string; value: number }>;
}

export interface PopCardsResult {
  mutableDeckCopy: Card[];
  chosenCards: Card | Card[];
}