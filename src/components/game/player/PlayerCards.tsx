
import {useAuthStore} from "@/store/authStore.ts";
import {useTablePositions} from "@/hooks/useTablePositions.ts";
import {Card} from "@/components/game/Card.tsx";
import type {CardType, PlayerState, Rank, Suit} from "@/components/game/types.ts";

export const PlayerCards = ({player}:{player:PlayerState}) => {
    const {user} = useAuthStore();
    const {getCardPositionClasses} = useTablePositions();
    const isSelf = user?.id === player.userId;
    if(!player.hand) return null;
    return (

            <div className={getCardPositionClasses(player.seat)}>
                {
                    player.hand.map((card, i) => {
                        const r : Rank = card.rank as Rank;
                        const s : Suit = card.suit as Suit;
                        const cardType : CardType = `${r}-${s}`;
                        console.log("Console logging cards" ,cardType);
                        return  <Card
                            key={i}
                            cardType={cardType}
                            height={60}
                            width={42}
                            isFaceDown={!isSelf || player.isFolded}
                        />
                    })
                }

            </div>
    );
};