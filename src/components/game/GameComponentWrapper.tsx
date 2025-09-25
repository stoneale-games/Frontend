import {useGameStore} from "@/store/gameStore.ts";
import {GameTable} from "@/components/game/GameTable.tsx";
import {GameRightSidebar} from "@/components/game/GameRightSideBar.tsx";
import {useAuthStore} from "@/store/authStore.ts";
import {useEffect, useState} from "react";
import {gql, useMutation} from "urql";
import {END_GAME} from "@/api/game.ts";
import {WinnerDisplay} from "@/components/game/player/PlayerWinningHand.tsx";
import {useNavigate} from "@tanstack/react-router";

const LEAVE_GAME = gql`
    mutation LeaveGame($gameId: ID!, $userId: ID!) {
        leaveGame(gameId: $gameId, userId: $userId)
    }
`;

export const GameComponentWrapper = () => {
    const [showWinner, setShowWinner] = useState(false);
    const { game } = useGameStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const checkIfUserInGame =
        game?.players.some(player => player.userId === user?.id) || false;
    const gameEnded = game?.phase === "showdown" || game?.phase === "completed";
    const [, endGame] = useMutation(END_GAME);
    const [, leaveGame] = useMutation(LEAVE_GAME);

    // Prevent page refresh
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = 'Are you sure you want to leave the game?';
            return 'Are you sure you want to leave the game?';
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent F5, Ctrl+R, Cmd+R
            if (
                e.key === 'F5' ||
                (e.ctrlKey && e.key === 'r') ||
                (e.metaKey && e.key === 'r')
            ) {
                e.preventDefault();
                return false;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // Auto-show winner display when there's a winner
    useEffect(() => {
        if (game?.winner && !showWinner) {
            setShowWinner(true);
        }
    }, [game?.winner, showWinner]);

    const handleWinnerClose = async () => {
        console.log("clcicking here..")
        try {
            if (game?.id && user?.id) {
                await leaveGame({
                    gameId: game.id,
                    userId: user.id
                });

                // Navigate back to lobby or game list
                navigate({ to: '/app/lobby' }); // Adjust path as needed
            }
        } catch (error) {
            console.error('Error leaving game:', error);
        } finally {
            setShowWinner(false);
        }
    };

    console.log("logging game winner", game?.winner);

    useEffect(() => {
        if(gameEnded && game?.isActive) {
            endGame({gameId: game.id});
        }
    }, [endGame, game?.id, game?.isActive, game?.phase, gameEnded]);

    return (
        <div className="relative flex flex-col h-screen">
            {/* Always render GameTable and sidebar - winner display will overlay */}
            <GameTable userInGame={checkIfUserInGame}/>
            {checkIfUserInGame && <GameRightSidebar />}

            {/* Winner Display Overlay */}
            {game?.winner && (
                <WinnerDisplay
                    winner={game.winner}
                    isVisible={showWinner}
                    onClose={handleWinnerClose}
                    onContinue={async () => await handleWinnerClose()}
                />
            )}
        </div>
    );
};