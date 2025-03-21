// src/components/BoardMessage.tsx
import { useEffect, useState } from "react";
import avatar from "../assets/avatar.png";
import { useGame } from "../contexts/GameContext";
import ErrorBoundary from "./ErrorBoundary";

const BoardMessage = () => {
    const { state } = useGame();
    const { isGameStarted, phase, players } = state;
    const [gameMessages, setGameMessages] = useState<string[]|[]>([]);
    
    // Update messages when game state changes
    useEffect(() => {
        if (isGameStarted) {
            switch (phase) {
                case 'preflop':
                    setGameMessages(prev => [
                        "Game started! Dealing cards...",
                        "Your turn to act",
                        ...prev
                    ]);
                    break;
                case 'flop':
                    setGameMessages(prev => [
                        "Dealing the flop",
                        "Action is on you",
                        ...prev
                    ]);
                    break;
                case 'turn':
                    setGameMessages(prev => [
                        "Dealing the turn card",
                        "Your action",
                        ...prev
                    ]);
                    break;
                case 'river':
                    setGameMessages(prev => [
                        "Dealing the river card",
                        "Final betting round",
                        ...prev
                    ]);
                    break;
                default:
                    break;
            }
        }
    }, [isGameStarted, phase]);

    return (
        <ErrorBoundary>
            <div className="w-64 rounded-md h-72 flex-col flex shadow-lg bg-primary-blue-300">
                <ul className="flex-1 flex flex-col gap-4 overflow-auto p-3">
                    {gameMessages.map((msg, index) => (
                        <li key={index}>
                            <article className="flex items-center gap-2 px-2">
                                <img src={avatar} alt="avatar" className="h-6 rounded-full" />
                                <p className="p-2 rounded-md text-xs shadow-2xl text-white-300">{msg}</p>
                            </article>
                        </li>
                    ))}
                </ul>
                <input 
                    className="w-full h-12 rounded-b-md px-3" 
                    placeholder="Send a message" 
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value) {
                            setGameMessages(prev => [e.currentTarget.value, ...prev]);
                            e.currentTarget.value = '';
                        }
                    }}
                />
            </div>
        </ErrorBoundary>
    );
};

export default BoardMessage;