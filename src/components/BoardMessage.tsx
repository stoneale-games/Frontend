// src/components/BoardMessage.tsx
import { useEffect, useState } from "react";
import avatar from "../assets/avatar.png";
import { useGame } from "../contexts/GameContext";
import ErrorBoundary from "./ErrorBoundary";

const BoardMessage = () => {
    const { state } = useGame();
    const { isGameStarted, phase, players, pot, winners } = state;
    const [gameMessages, setGameMessages] = useState<string[]>([]);
    
    // Keep track of last actions to avoid duplicate messages
    const [lastActionMap, setLastActionMap] = useState<Record<string, string>>({});
    
    // Update messages when game state changes
    useEffect(() => {
        if (isGameStarted) {
            switch (phase) {
                case 'betting1':
                    if (!gameMessages.some(msg => msg.includes("Game started"))) {
                        setGameMessages(prev => [
                            "Game started! Dealing cards...",
                            "Blinds posted!",
                            ...prev
                        ]);
                    }
                    break;
                case 'flop':
                    setGameMessages(prev => [
                        "Dealing the flop...",
                        ...prev
                    ]);
                    break;
                case 'turn':
                    setGameMessages(prev => [
                        "Dealing the turn card...",
                        ...prev
                    ]);
                    break;
                case 'river':
                    setGameMessages(prev => [
                        "Dealing the river card...",
                        "Final betting round",
                        ...prev
                    ]);
                    break;
                case 'showdown':
                    if (winners.length > 0) {
                        const winnerNames = winners.map(w => w.name).join(', ');
                        setGameMessages(prev => [
                            `${winnerNames} wins pot of ${pot} chips!`,
                            "Showdown! Revealing cards...",
                            ...prev
                        ]);
                    }
                    break;
                default:
                    break;
            }
        }
    }, [isGameStarted, phase, pot, winners, gameMessages]);
    
    // Add player action messages
    useEffect(() => {
        if (!isGameStarted) return;
        
        const newActionMap: Record<string, string> = {};
        let newMessages: string[] = [];
        
        players.forEach(player => {
            if (player.lastAction && player.lastAction !== '' && lastActionMap[player.id] !== player.lastAction) {
                newActionMap[player.id] = player.lastAction;
                
                switch (player.lastAction) {
                    case 'fold':
                        newMessages.push(`${player.name} folds`);
                        break;
                    case 'check':
                        newMessages.push(`${player.name} checks`);
                        break;
                    case 'call':
                        newMessages.push(`${player.name} calls ${player.bet}`);
                        break;
                    case 'raise':
                        newMessages.push(`${player.name} raises to ${player.bet}`);
                        break;
                    case 'all-in':
                        newMessages.push(`${player.name} is all-in with ${player.bet}!`);
                        break;
                    case 'small blind':
                        newMessages.push(`${player.name} posts small blind`);
                        break;
                    case 'big blind':
                        newMessages.push(`${player.name} posts big blind`);
                        break;
                    case 'winner':
                        newMessages.push(`${player.name} wins the pot!`);
                        break;
                    default:
                        break;
                }
            }
        });
        
        if (newMessages.length > 0) {
            setGameMessages(prev => [...newMessages, ...prev]);
            setLastActionMap(prev => ({...prev, ...newActionMap}));
        }
    }, [isGameStarted, players, lastActionMap]);

    return (
        <ErrorBoundary>
            <div className="w-64 rounded-md h-72 flex-col flex shadow-lg bg-primary-blue-300">
                <ul className="flex-1 flex flex-col-reverse gap-2 overflow-auto p-3">
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
                            setGameMessages(prev => [`You: ${e.currentTarget.value}`, ...prev]);
                            e.currentTarget.value = '';
                        }
                    }}
                />
            </div>
        </ErrorBoundary>
    );
};

export default BoardMessage;