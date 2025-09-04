'use client';
// /components/game/PlayerProfile.tsx

import React from 'react';
import { cn } from '@/lib/utils.ts';
import type { PlayerState } from '../types.ts';
import { useTablePositions } from '@/hooks/useTablePositions.ts';
import {AvartaUsernameWrapper} from "@/components/AvartaUsernameWrapper.tsx";
import {PlayerCurrentChips} from "@/components/game/player/PlayerCurrentChips.tsx";
import {PlayerCards} from "@/components/game/player/PlayerCards.tsx";

interface PlayerProfileProps {
    player: PlayerState;
    isSelf: boolean;
    position?: 'bottom' | 'left' | 'top-left' | 'top-center' | 'top-right' | 'right';
    seatNumber?: number; // seat number for table positioning
}

export const PlayerProfile: React.FC<PlayerProfileProps> = ({
                                                                player,
                                                                seatNumber = 1
                                                            }) => {
    const isFolded = player.status === 'folded';
    const {
        getTablePosition,
    } = useTablePositions();

    // Get the table position data for this seat
    const tablePosition = getTablePosition(seatNumber);



    return (
        <div className={cn(
            'relative flex flex-col items-center gap-2 transition-all duration-300  ',
            isFolded && 'opacity-40',
            tablePosition.customClasses?.container
        )}>

            {/* Avatar + Username wrapper */}
            <AvartaUsernameWrapper player={player}/>

            <PlayerCurrentChips player={player}/>

            <PlayerCards player={player}/>

        </div>
    );
};










