export type Suit = 'Spades' | 'Clubs' | 'Hearts' | 'Diamonds';
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';
type HiddenCard = '_?';
export type CardType = `${Rank}-${Suit}` | HiddenCard;
export type ChipValue = 5 | 10 | 25 | 100 | 500 | 1000;
export type PlayerAction = 'fold' | 'check' | 'call' | 'bet' | 'raise';


export interface PlayerState {
    id: string;
    name: string;
    chips:number;
    isAllIn:boolean;
    isFolded:boolean;
    seat:number;
    userId: string;
    avatarUrl: string;
    status: string;
    isDealer: boolean;
    isTurn: boolean;
    hand: Array<{rank:Rank,suit:Suit}>;
}



export interface GameState {
    id: string;
    players: PlayerState[];
    communityCards: Array<{rank:Rank,suit:Suit}>;
    pot:number;
    phase:"pre-flop"|"waiting"|"showdown"|"completed"|"turn"|"flop";
    turnIndex:number;
    isActive:boolean;
    lastAction:string;
    winner:GameWinner;
    completedAt:string;

}

export interface GameWinner {
    playerId: string;
    userId: string;
    handRank: number;
    winningHand?: Array<{rank:Rank,suit:Suit}>;
    amountWon: number;
}



