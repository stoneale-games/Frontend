'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import {Card} from "@/components/game/Card";
import type {CardType} from "@/components/game/types";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import {AnimatedButton} from "@/components/AnimatedButton";
import {MoveUpRight} from "lucide-react";
import React from "react";


interface HandOffer {
    id: string;
    avatarUrl: string;
    offeredCards: CardType[]; // 👈 strictly typed!
    requiredCards: CardType[];
}

interface WinningHandExchangeListProps {
    offers: HandOffer[];
    onSendOffer: (offerId: string) => void;
}

export const WinningHandExchangeList: React.FC<WinningHandExchangeListProps> = ({
                                                                                    offers,
                                                                                    onSendOffer,
                                                                                }) => {
    return (
        <ScrollArea className="">
            <div className={"flex justify-end mb-4 "}>
                 <p className={"dark:bg-neutral-800  text-red-500 font-bold bg-neutral-100 p-2 rounded-full "}>{offers.length} offers</p>
            </div>
            <div className="flex flex-col gap-4 max-h-[600px] w-full pr-2 overflow-y-auto">
                {offers.map((offer) => (
                    <div
                        key={offer.id}
                        className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-900 p-3 rounded-xl shadow-sm"
                    >
                        <div className={"flex flex-col gap-4"}>
                            {/* Avatar */}
                            <Avatar>
                                <AvatarImage src={offer.avatarUrl} alt={offer.avatarUrl} />
                            </Avatar>
                            {/* Offer Button */}
                            <AnimatedButton variant={"secondary"}  className={" hover:bg-red-900 hover:text-white "} onClick={() => onSendOffer(offer.id)}>
                                <div className={"flex items-center justify-center gap-2"}>
                                    <MoveUpRight /> Send offer
                                </div>
                            </AnimatedButton>

                        </div>

                        {/* Offered hand (2 cards) */}
                        <div className="flex gap-1 min-w-[90px]">
                            {offer.offeredCards.map((cardType, idx) => (
                                <Card key={idx} cardType={cardType} className={" w-16 h-24"} />
                            ))}
                        </div>

                        {/* Required hand (5 cards) */}
                        <div className="flex gap-1 min-w-[180px]">
                            {offer.requiredCards.map((cardType, idx) => (
                                <Card key={idx} cardType={cardType} className={" w-16 h-24"} />
                            ))}
                        </div>

                    </div>
                ))}
            </div>
        </ScrollArea>
    );
};
