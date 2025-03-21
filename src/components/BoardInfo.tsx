// src/components/BoardInfo.tsx
import plug from "../assets/plug.png";
import { useGame } from "../contexts/GameContext";
import ErrorBoundary from "./ErrorBoundary";

const BoardInfo = () => {
    const { state } = useGame();
    const { isGameStarted, phase, players } = state;
    
    // Get the current player (user)
    const currentPlayer = players.find(player => player.position === 0);
    
    // Determine hand strength (this would be more complex in a real app)
    const getHandStrength = () => {
        if (!isGameStarted) return "";
        
        // This is a placeholder - in a real game you'd analyze the cards
        // and determine the actual hand strength
        const hands = ["High Card", "Pair", "Two Pair", "Three of a Kind", 
                      "Straight", "Flush", "Full House", "Four of a Kind", 
                      "Straight Flush", "Royal Flush"];
        
        return hands[Math.floor(Math.random() * 3)]; // Just for demo
    };

    return (
        <ErrorBoundary>
            <div className="flex flex-col gap-2 w-64">
                {isGameStarted && (
                    <div className="flex items-center justify-end gap-2">
                        <img src={plug} className="h-4" alt="info" />
                        <span className="text-xs text-white-950">
                            {phase !== 'idle' ? `You have ${getHandStrength()}` : 'Waiting to start...'}
                        </span>
                    </div>
                )}
                <div className="h-40 flex flex-col mt-4">
                    {isGameStarted ? (
                        <div className="bg-white-950 flex-1 p-2 rounded-t-md">
                            <h3 className="text-sm font-semibold">Game Status</h3>
                            <p className="text-xs mt-2">Phase: {phase}</p>
                            {currentPlayer && (
                                <p className="text-xs mt-1">Your chips: {currentPlayer.chips}</p>
                            )}
                            <p className="text-xs mt-1">Pot: {state.pot || 0}</p>
                            <p className="text-xs mt-1">Players: {players.length}</p>
                        </div>
                    ) : (
                        <div className="bg-white-950 flex-1 flex items-center justify-center rounded-t-md">
                            <p className="text-sm text-center">
                                Start a game to see information here
                            </p>
                        </div>
                    )}
                    <button className="w-full h-10 rounded-b-md bg-primary-blue-300 text-white-950 text-sm">
                        Ok
                    </button>
                </div>
            </div>
        </ErrorBoundary>
    );
};

export default BoardInfo;