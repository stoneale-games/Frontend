// src/components/game/GameSidebar.tsx
import { Button } from "@/components/ui/button";
import { Users, DollarSign, PlayCircle, LogOut, Play } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useGameStore } from "@/store/gameStore";
import { useMutation } from "urql";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import {LEAVE_GAME, START_GAME} from "@/query-types/game.ts";
import {getErrorMessage} from "@/lib/helpers.ts";

export const GameRightSidebar = () => {
    const { game, clearGame } = useGameStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [{ fetching: leaving }, leaveGame] = useMutation(LEAVE_GAME);
    const [{ fetching: starting }, startGame] = useMutation(START_GAME);

    if (!game) return null;

    const me = game.players.find((p) => p.userId === user?.id);

    const handleLeave = async () => {
        try {
            const result = await leaveGame({ gameId: game.id, userId: user?.id });
            if (result.error) {
                toast.error("Failed to leave game", { description: result.error.message });
                return;
            }
            if (result.data?.leaveGame) {
                toast.success("You left the game", {
                    description: "Your progress was saved automatically.",
                    action: {
                        label: "Undo",
                        onClick: () => console.log("Undo action"),
                    },
                });

                clearGame();
                navigate({ to: "/app/lobby" });
            }
        } catch (error: unknown) {
            const err = getErrorMessage(error);
            toast.error("Unexpected error", {
                description: err,
                className: "bg-red-600 text-white rounded-xl shadow-lg border border-red-700",
            });

        }
    };

    const handleStart = async () => {
        try {
            const result = await startGame({ gameId: game.id });
            if (result.error) {
                toast.error("Unexpected error", {
                    description: result.error.message ?? "Something went wrong",
                    className: "bg-red-600 text-white rounded-xl shadow-lg border border-red-700",
                });
                return;
            }
            if (result.data?.startGame) toast.success("Game started!");
        } catch (error: unknown) {
            const err = getErrorMessage(error);
            toast.error("Unexpected error", {
                description: err,
                className: "bg-red-600 text-white rounded-xl shadow-lg border border-red-700",
            });

        }
    };

    return (
        <div className="absolute top-4 right-4 bg-white shadow-lg rounded-xl border p-4 w-64 space-y-3">
            <h1 className="text-xl font-bold">Phase: {game.phase}</h1>
            <h2 className="font-bold text-sm mb-2">Table {game.id.substring(0, 6)}...</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" /> Pot: ${game.pot}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <PlayCircle className="h-4 w-4" /> Phase: {game.phase}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" /> {game.players.length} Players
            </div>

            {me && (
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                    You: ${me.chips}
                </div>
            )}

            {game.phase === "waiting" && (
                <Button
                    variant="default"
                    size="sm"
                    className="w-full mt-2 bg-green-600 hover:bg-green-700"
                    onClick={handleStart}
                    disabled={starting}
                >
                    <Play className="h-4 w-4 mr-2" />
                    {starting ? "Starting..." : "Start Game"}
                </Button>
            )}

            <Button
                variant="destructive"
                size="sm"
                className="w-full mt-2"
                onClick={handleLeave}
                disabled={leaving}
            >
                <LogOut className="h-4 w-4 mr-2" />
                {leaving ? "Leaving..." : "Leave Table"}
            </Button>
        </div>
    );
};
