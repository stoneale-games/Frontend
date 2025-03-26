// src/components/BoardActions.tsx
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useEffect, useState } from "react";
import { useGame } from "../contexts/GameContext";
import ErrorBoundary from "./ErrorBoundary";


const BoardActions = () => {
    const [betValue, setBetValue] = useState(20);
    const { state, dispatch } = useGame();
    const { 
        isGameStarted, 
        players, 
        currentBet, 
        phase, 
        activePlayerIndex,
        roundOver,
        pot,
        minBet,
        minRaise
    } = state;

    // Find the human player (position 0)
    const humanPlayer = players.find(p => p.position === 0);
    
    // Calculate minimum and maximum bet amounts
    const minBetValue = currentBet > 0 ? currentBet + minRaise : minBet;
    const maxBet = humanPlayer ? humanPlayer.chips : 100;
    
    // Initialize bet slider when a new betting round starts
    useEffect(() => {
        if (humanPlayer) {
            setBetValue(Math.min(minBetValue, humanPlayer.chips));
        }
    }, [phase, humanPlayer, minBetValue]);
    
    // Handle AI player turns
    useEffect(() => {
        // Only proceed if game is started and it's not over
        if (!isGameStarted || roundOver) return;
        
        // Check if it's an AI player's turn
        const currentPlayer = players[activePlayerIndex];
        if (currentPlayer && currentPlayer.position !== 0 && currentPlayer.isTurn) {
            // Add a small delay to make it feel more natural
            const timer = setTimeout(() => {
                // For AI decision, we'll use a simple strategy
                const aiAction = determineAIAction(currentPlayer, currentBet, state);
                
                // Make the AI move
                dispatch({
                    type: 'PLAYER_ACTION',
                    payload: {
                        playerId: currentPlayer.id,
                        action: aiAction.action,
                        amount: aiAction.amount
                    }
                });
                
                // Move to next player
                setTimeout(() => {
                    dispatch({ type: 'NEXT_PLAYER' });
                }, 500);
            }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
            
            return () => clearTimeout(timer);
        }
    }, [state, dispatch, isGameStarted, players, activePlayerIndex, roundOver, currentBet]);
    
    // Progress game phases automatically
    useEffect(() => {
        if (!isGameStarted || roundOver) return;
        
        // Check if we need to deal community cards or evaluate hands
        if (players.every(p => !p.isTurn)) {
            const timer = setTimeout(() => {
                switch (phase) {
                    case 'betting1':
                        dispatch({ type: 'DEAL_FLOP' });
                        break;
                    case 'betting2':
                        dispatch({ type: 'DEAL_TURN' });
                        break;
                    case 'betting3':
                        dispatch({ type: 'DEAL_RIVER' });
                        break;
                    case 'betting4':
                        dispatch({ type: 'EVALUATE_HANDS' });
                        setTimeout(() => {
                            dispatch({ type: 'END_ROUND' });
                            // Start a new round after displaying results
                            setTimeout(() => {
                                dispatch({ type: 'RESET_ROUND' });
                                setTimeout(() => {
                                    dispatch({ type: 'DEAL_CARDS' });
                                }, 500);
                            }, 5000);
                        }, 2000);
                        break;
                }
            }, 1000);
            
            return () => clearTimeout(timer);
        }
    }, [isGameStarted, phase, players, dispatch, roundOver]);

    const startGame = () => {
        dispatch({ type: 'START_GAME', payload: { playerCount: 6 } });
        // Deal cards after starting the game
        setTimeout(() => {
            dispatch({ type: 'DEAL_CARDS' });
        }, 500);
    };

    const handleFold = () => {
        if (!humanPlayer || !humanPlayer.isTurn) return;
        
        dispatch({
            type: 'PLAYER_ACTION',
            payload: {
                playerId: humanPlayer.id,
                action: 'fold'
            }
        });
        
        setTimeout(() => {
            dispatch({ type: 'NEXT_PLAYER' });
        }, 500);
    };

    const handleCheck = () => {
        if (!humanPlayer || !humanPlayer.isTurn) return;
        
        // Can only check if no bet to call or already matched the bet
        if (currentBet === 0 || humanPlayer.bet === currentBet) {
            dispatch({
                type: 'PLAYER_ACTION',
                payload: {
                    playerId: humanPlayer.id,
                    action: 'check'
                }
            });
            
            setTimeout(() => {
                dispatch({ type: 'NEXT_PLAYER' });
            }, 500);
        }
    };

    const handleCall = () => {
        if (!humanPlayer || !humanPlayer.isTurn) return;
        
        dispatch({
            type: 'PLAYER_ACTION',
            payload: {
                playerId: humanPlayer.id,
                action: 'call'
            }
        });
        
        setTimeout(() => {
            dispatch({ type: 'NEXT_PLAYER' });
        }, 500);
    };

    const handleRaise = () => {
        if (!humanPlayer || !humanPlayer.isTurn) return;
        
        dispatch({
            type: 'PLAYER_ACTION',
            payload: {
                playerId: humanPlayer.id,
                action: 'raise',
                amount: betValue
            }
        });
        
        setTimeout(() => {
            dispatch({ type: 'NEXT_PLAYER' });
        }, 500);
    };

    // Determine if check is allowed
    const canCheck = humanPlayer && humanPlayer.isTurn && 
                     (currentBet === 0 || humanPlayer.bet === currentBet);
    
    // Determine if call is needed instead of check
    const needsToCall = currentBet > 0 && humanPlayer && humanPlayer.bet < currentBet;
    
    // Calculate call amount
    const callAmount = needsToCall ? currentBet - (humanPlayer?.bet || 0) : 0;

    return (
        <ErrorBoundary>
            <div className="w-72 flex flex-col items-center gap-4 h-fit">
                {isGameStarted ? (
                    <>
                        <div className="px-2 py-0.5 rounded-md shadow-md text-white-950 bg-primary-blue-300 text-xs">
                            Pot: {pot}
                        </div>
                        {/* Only show betting controls when it's human's turn */}
                        {humanPlayer && humanPlayer.isTurn && (
                            <>
                                <div className="flex w-full gap-2 items-center p-2 ring-1 ring-primary-900 rounded-md">
                                    <div className="text-xs text-white-300">{minBetValue}</div>
                                    <input
                                        type="range"
                                        min={minBetValue}
                                        max={maxBet}
                                        value={betValue}
                                        onChange={(e) => setBetValue(parseInt(e.target.value))}
                                        className="flex-1 bg-primary-blue-300"
                                    />
                                    <div className="text-xs text-white-300">{maxBet}</div>
                                </div>
                                <div className="text-xs text-white-950">
                                    Bet: {betValue}
                                </div>
                                <div className="mt-2 flex w-full gap-2">
                                    <button
                                        onClick={handleFold}
                                        className="bg-primary-blue-300 py-0.5 rounded-md shadow-lg flex-1 justify-center flex gap-2 items-center"
                                    >
                                        <CancelOutlined className="!text-white-950" />
                                        <span className="text-xs text-white-950">Fold</span>
                                    </button>
                                    
                                    {canCheck ? (
                                        <button
                                            onClick={handleCheck}
                                            className="bg-primary-blue-300 py-0.5 rounded-md shadow-lg flex-1 justify-center flex gap-2 items-center"
                                        >
                                            <span className="text-xs text-white-950">Check</span>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleCall}
                                            className="bg-primary-blue-300 py-0.5 rounded-md shadow-lg flex-1 justify-center flex gap-2 items-center"
                                        >
                                            <span className="text-xs text-white-950">
                                                Call {callAmount}
                                            </span>
                                        </button>
                                    )}
                                    
                                    <button
                                        onClick={handleRaise}
                                        disabled={humanPlayer.chips < minBetValue}
                                        className={`bg-primary-blue-300 py-0.5 rounded-md shadow-lg flex-1 justify-center flex gap-2 items-center
                                            ${humanPlayer.chips < minBetValue ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <span className="text-xs text-white-950">Raise</span>
                                    </button>
                                </div>
                            </>
                        )}
                        
                        {/* When it's not human's turn, show current action */}
                        {isGameStarted && (!humanPlayer || !humanPlayer.isTurn) && (
                            <div className="text-center py-2 text-white-950">
                                {roundOver 
                                    ? "Round complete" 
                                    : phase === 'showdown' 
                                        ? "Evaluating hands..." 
                                        : `Waiting for ${players.find(p => p.isTurn)?.name || 'next player'} to act...`}
                            </div>
                        )}
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

// Simple AI decision making function
function determineAIAction(player:any, currentBet:number, gameState:any) {
    const randomStrategy = Math.random();
    const playerBet = player.bet || 0;
    const callAmount = currentBet - playerBet;
    
    // If player can check, decide between check and raise
    if (currentBet === 0 || playerBet === currentBet) {
        if (randomStrategy < 0.7) {
            return { action: 'check' };
        } else {
            const raiseAmount = Math.min(
                player.chips,
                currentBet + gameState.minRaise + Math.floor(Math.random() * player.chips * 0.3)
            );
            return { action: 'raise', amount: raiseAmount };
        }
    }
    
    // If player needs to call
    // Decide based on call amount relative to chips
    const callRatio = callAmount / player.chips;
    
    if (callRatio > 0.5 || randomStrategy < 0.3) {
        return { action: 'fold' };
    } else if (randomStrategy < 0.7) {
        return { action: 'call' };
    } else {
        const raiseAmount = Math.min(
            player.chips,
            currentBet + gameState.minRaise + Math.floor(Math.random() * player.chips * 0.3)
        );
        return { action: 'raise', amount: raiseAmount };
    }
}

export default BoardActions;