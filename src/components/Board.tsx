import { useState } from "react";
import board from "../assets/board.png";
import card from "../assets/card.png";
import { useGame } from "../contexts/GameContext";
import ErrorBoundary from "./ErrorBoundary";
// Import web3 related utilities (to be implemented later)

const Board = () => {
    const { state } = useGame();
    const { communityCards, isGameStarted, phase, tableId } = state;
    const [isConnected] = useState(true);
    const [txPending] = useState(false);
    
    // // This would check if user's wallet is connected
    // useEffect(() => {
    //     // In the future, this would interact with a Web3 provider
    //     const checkWalletConnection = async () => {
    //         try {
    //             // Placeholder for future wallet connection check
    //             // This would use something like ethers.js or viem
    //             const connected = localStorage.getItem('walletConnected') === 'true';
    //             setIsConnected(connected);
    //         } catch (error) {
    //             console.error("Error checking wallet connection:", error);
    //             // setIsConnected(false);
    //         }
    //     };
        
    //     checkWalletConnection();
    // }, []);
    
    return (
        <ErrorBoundary>
            <section className="h-80 min-h-[400px] py-8 flex justify-center">
                <div className="h-72 w-[560px] relative">
                    <img src={board} className="absolute" alt="Poker board" />
                    
                    {/* Game status indicator */}
                    {!isConnected && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md">
                            Wallet Not Connected
                        </div>
                    )}
                    
                    {txPending && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-md">
                            Transaction Pending...
                        </div>
                    )}
                    
                    {isGameStarted && tableId && (
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-primary-blue-300 text-white-950 text-xs px-2 py-1 rounded-md">
                            Table #{tableId}
                        </div>
                    )}
                    
                    {isGameStarted && (
                        <ul className="flex gap-2 w-fit absolute top-40 left-[200px]">
                            {Array(5).fill(null).map((_, index) => (
                                <li key={index}>
                                    <div className="ring-1 bg-transparent flex items-center justify-center ring-secondary-950 w-8 h-12 rounded-sm">
                                        {communityCards[index] ? (
                                            <img 
                                                src={`https://ipfs.io/ipfs/${communityCards[index].ipfs_cid}`} 
                                                alt={communityCards[index].display} 
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            phase !== 'idle' && index < getVisibleCardCount(phase) ? (
                                                <img src={card} alt="card" />
                                            ) : null
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    
                    {/* Player positions */}
                    {isGameStarted && (
                    
                            <PlayerPositions />
                      
                    )}
                </div>
            </section>
        </ErrorBoundary>
    );
};

// Helper to determine how many cards should be visible
const getVisibleCardCount = (phase: string) => {
    switch (phase) {
        case 'flop': return 3;
        case 'turn': return 4;
        case 'river': return 5;
        default: return 0;
    }
};

// Component to render player positions around the table
const PlayerPositions = () => {
    const { state } = useGame();
    const { players, currentPlayerAddress } = state;
    
    // Improved positions for 6 players around the circular table
    const positions = [
        { bottom: '-30%', left: '50%', transform: 'translateX(-50%)' }, // bottom center (user)
        { bottom: '20%', left: '0%', transform: 'translateX(0)' }, // bottom left
        { top: '0%', left: '15%', transform: 'translateX(0)' }, // top left
        { top: '0', left: '50%', transform: 'translateX(-50%)' }, // top center
        { top: '0%', right: '15%', transform: 'translateX(0)' }, // top right
        { bottom: '20%', right: '0%', transform: 'translateX(0)' }, // bottom right
    ];
    
    // Function to verify if a card has been cryptographically signed
    // This would be used in a real implementation to verify fairness
    const isVerifiedCard = (card: any) => {
        console.log(card);
        
        // In the future, this would check blockchain signatures
        return true;
    };
    
    return (
        <>
            {players.map((player) => {
                const isCurrentPlayer = player.address === currentPlayerAddress;
                // const isBetting = player.isTurn && player.betTxHash;
                const playerPosition = positions[player.position];
                
                return (
                    <div 
                        key={player.id}
                        className={`absolute ${player.isTurn ? 'ring-2 ring-secondary-950 rounded-md' : ''}`}
                        style={playerPosition}
                    >
                        <div className="flex flex-col items-center relative">
                            <div className={`text-xs text-white-950 px-2 py-1 rounded-md shadow-md flex items-center gap-1`}>
                            <img src={"/player.png"} alt="player" width={100} height={100}/>

                                {player.isConnected && (
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                )}
                            </div>
                            <div className="text-xs text-secondary-950 mt-1">
                                {player.chips} {state.tokenSymbol || 'CHIPS'}
                            </div>
                            {player.betTxHash && (
                                <div className="text-xs text-secondary-950 mt-1">
                                    TX: {player.betTxHash.substring(0, 6)}...
                                </div>
                            )}
                            {player.cards.length > 0 && (
                                <div className="flex gap-1 mt-1 absolute">
                                    {isCurrentPlayer ? (
                                        // Show current player's cards face up
                                        player.cards.map((cardItem, cardIndex) => (
                                            <div key={cardIndex} className="w-6 h-8 relative">
                                                <img 
                                                    src={`https://ipfs.io/ipfs/${cardItem.ipfs_cid}`} 
                                                    alt={cardItem.display} 
                                                    className="w-full h-full object-contain"
                                                />
                                                {!isVerifiedCard(cardItem) && (
                                                    <div className="absolute inset-0 bg-red-500 bg-opacity-30 flex items-center justify-center">
                                                        <span className="text-xs text-white">!</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        // Show other players' cards face down
                                        Array(2).fill(null).map((_, cardIndex) => (
                                            <div key={cardIndex} className="w-6 h-8">
                                                <img src={card} alt="card back" className="w-full h-full object-contain" />
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                            {player.isTurn && (
                                <div className="mt-1 text-xs bg-yellow-500 text-white px-1 rounded">
                                    Acting...
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default Board;