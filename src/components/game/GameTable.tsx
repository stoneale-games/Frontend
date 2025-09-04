"use client";

import GameBoard from "@/components/game/GameBoard";
import {RenderTablePositions} from "@/components/game/player/RenderTablePositions.tsx";
import {TableCenter} from "@/components/game/TableCenter.tsx";
import {PlayerActions} from "@/components/game/player/PlayerActions.tsx";
import {useGameStore} from "@/store/gameStore.ts";

export function GameTable({userInGame}:{userInGame:boolean}) {

    const game = useGameStore((s) => s.game);
    if (!game) return null;


    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-neutral-800">
            <GameBoard className="w-full h-full max-w-5xl relative">
                {/* Render all table positions */}
                <RenderTablePositions />
                {/* Center of the table */}
                <TableCenter />
            </GameBoard>

             <div className={"bg-gray-600 flex-1 text-white p-4 rounded-lg"}>
                 {game.lastAction}
             </div>

            {userInGame && (
                <div>
                    <PlayerActions />
                </div>
            )}
        </div>
    );
}
