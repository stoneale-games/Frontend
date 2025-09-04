import { PlayerProfile } from "@/components/game/player/PlayerProfile";
import { useAuthStore } from "@/store/authStore";
import { useTablePositions } from "@/hooks/useTablePositions";
import { useEffect } from "react";
import { useGameStore } from "@/store/gameStore";

export const RenderTablePositions = () => {
    const game = useGameStore((s) => s.game);
    const { user } = useAuthStore();
    const { tablePositions, assignSeats, getPlayerPositionType, seatAssignments } = useTablePositions();

    // Only assign seats if game and players exist
    useEffect(() => {
        if (game?.players?.length) {
            assignSeats(game.players);
        }
    }, [assignSeats, game?.players]);

    // If game is null or no table positions, don't render anything
    if (!game || !tablePositions?.length) return null;

    return (
        <>
            {tablePositions.map((position, index) => {
                const player = seatAssignments[index];

                return (
                    <div
                        key={`seat-${index}`}
                        className="absolute"
                        style={{
                            top: position.top,
                            bottom: position.bottom,
                            left: position.left,
                            right: position.right,
                            transform: position.transform,
                        }}
                    >
                        {player && (
                            <PlayerProfile
                                player={player}
                                isSelf={player.userId === user?.id}
                                position={getPlayerPositionType(position.positionType)}
                                seatNumber={index}
                            />
                        )}
                    </div>
                );
            })}
        </>
    );
};
