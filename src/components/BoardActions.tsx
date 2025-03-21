// src/components/BoardActions.tsx
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useState } from "react";
import { useGame } from "../contexts/GameContext";
import ErrorBoundary from "./ErrorBoundary";

const BoardActions = () => {
    const [value, setValue] = useState(60);
    const { state, dispatch } = useGame();
    const { isGameStarted, phase } = state;

    const startGame = () => {
        dispatch({ type: 'START_GAME', payload: { playerCount: 6 } });
        // Deal cards after starting the game
        setTimeout(() => {
            dispatch({ type: 'DEAL_CARDS' });
        }, 500);
        
        // Automatically progress through phases for demo purposes
        // In a real app, you'd wait for player actions
        if (process.env.NODE_ENV === 'development') {
            setTimeout(() => dispatch({ type: 'DEAL_FLOP' }), 2000);
            setTimeout(() => dispatch({ type: 'DEAL_TURN' }), 4000);
            setTimeout(() => dispatch({ type: 'DEAL_RIVER' }), 6000);
        }
    };

    const handleFold = () => {
        // Implement fold logic
        console.log("Player folded");
    };

    const handleCheck = () => {
        // Implement check logic
        console.log("Player checked");
    };

    const handleRaise = () => {
        // Implement raise logic
        console.log(`Player raised to ${value}`);
    };

    return (
        <ErrorBoundary>
            <div className="w-72 flex flex-col items-center gap-4 h-fit">
                {isGameStarted ? (
                    <>
                        <div className="px-2 py-0.5 rounded-md shadow-md text-white-950 bg-primary-blue-300 text-xs">
                            {state.pot || 0}
                        </div>
                        <div className="flex w-full gap-2 items-center p-2 ring-1 ring-primary-900 rounded-md">
                            <div className="text-xs text-white-300">Put</div>
                            <input
                                type="range"
                                min={1}
                                max={100}
                                value={value}
                                onChange={(e) => setValue(parseFloat(e.target.value))}
                                className="flex-1 bg-primary-blue-300"
                            />
                            <div className="text-xs text-white-300">All in</div>
                        </div>
                        <div className="mt-6 flex w-full gap-2">
                            <button
                                onClick={handleFold}
                                className="bg-primary-blue-300 py-0.5 rounded-md shadow-lg flex-1 justify-center flex gap-2 items-center"
                            >
                                <CancelOutlined className="!text-white-950" />
                                <span className="text-xs text-white-950">Fold</span>
                            </button>
                            <button
                                onClick={handleCheck}
                                className="bg-primary-blue-300 py-0.5 rounded-md shadow-lg flex-1 justify-center flex gap-2 items-center"
                            >
                                <CancelOutlined className="!text-white-950 !text-md" />
                                <span className="text-xs text-white-950">Check</span>
                            </button>
                            <button
                                onClick={handleRaise}
                                className="bg-primary-blue-300 py-0.5 rounded-md shadow-lg flex-1 justify-center flex gap-2 items-center"
                            >
                                <CancelOutlined className="!text-white-950" />
                                <span className="text-xs text-white-950">Raise</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <button
                        onClick={startGame}
                        className="bg-secondary-950 text-white-950 px-6 py-2 rounded-md shadow-lg flex items-center gap-2"
                    >
                        <PlayArrowIcon />
                        <span>Start 6-Player Game</span>
                    </button>
                )}
            </div>
        </ErrorBoundary>
    );
};

export default BoardActions;