
import { ScrollArea } from '@/components/ui/scroll-area';
import type {CardType} from "@/components/game/types";
import {Card} from "@/components/game/Card";
import {AnimatedButton} from "@/components/AnimatedButton";
import {Coins} from "lucide-react";


export interface OwnHand {
    id: string;
    hand: CardType[]; // always 5 cards
}

interface WinningHandOwnListProps {
    hands: OwnHand[];
    onConvert: (handId: string) => void;
    onListForExchange: (handId: string) => void;
}

export const WinningHandOwnList: React.FC<WinningHandOwnListProps> = ({
                                                                          hands,
                                                                          onConvert,
                                                                          onListForExchange,
                                                                      }) => {
    return (
        <ScrollArea className="max-h-[600px] w-full pr-2">
            <div className="flex flex-col gap-4">
                {hands.map((entry) => (
                    <div
                        key={entry.id}
                        className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-900  p-3 rounded-xl shadow-sm"
                    >
                        {/* Hand Cards */}
                        <div className="flex gap-1 min-w-[200px]">
                            {entry.hand.map((cardType, idx) => (
                                <Card key={idx} cardType={cardType} className={" w-16 h-24"}  />
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 ml-4">
                            <AnimatedButton  variant={"secondary"}  className={" hover:bg-red-900 hover:text-white "} onClick={() => onConvert(entry.id)}>
                                <div className={"flex items-center justify-center gap-2"}>
                                    <Coins/> Convert to chip
                                </div>
                            </AnimatedButton>


                            <AnimatedButton   className={"bg-orange-100 hover:bg-orange-200  text-black hover:text-black"}  onClick={() => onListForExchange(entry.id)}>
                                List for Exchange
                            </AnimatedButton>

                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
};
