// /components/game/CommunityCards.tsx
import React from 'react';
import { Card} from './Card';
import type {CardType, Rank, Suit} from "@/components/game/types"; // Assuming CardId is exported from Card.tsx or types.ts
// Assuming CardId is exported from Card.tsx or types.ts

interface CommunityCardsProps {
    cards: Array<{rank:Rank,suit:Suit}>; // e.g., ['As', 'Ks', 'Qs'] for a flop
}

export const CommunityCards: React.FC<CommunityCardsProps> = ({ cards }) => {
    return (
        <div className="flex justify-center items-center gap-2">
            {cards.map((card, i) => {


                const r : Rank = card.rank as Rank;
                const s : Suit = card.suit as Suit;
                const cardType : CardType = `${r}-${s}`;
                console.log("Console logging cards" ,cardType);
                return  <Card
                    key={i}
                    cardType={cardType}
                    height={60}
                    width={42}
                    isFaceDown={false}
                />
            })}
        </div>
    );
};