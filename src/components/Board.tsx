// src/components/Board.tsx
import board from "../assets/board.png";
import card from "../assets/card.png";
import { useGame } from "../contexts/GameContext";
import ErrorBoundary from "./ErrorBoundary";

const Board = () => {
    const { state } = useGame();
    const { communityCards, isGameStarted, phase} = state;
    
    return (
        <ErrorBoundary>
            <section className="h-80 min-h-[400px] py-8 flex justify-center">
                <div className="h-72 w-[560px] relative">
                    <img src={board} className="absolute w-[70vw] h-[70vh]" alt="Poker board" />
                  
                    {/* Table ID
                    {isGameStarted && (
                        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-primary-blue-300 text-white-950 text-xs px-2 py-1 rounded-md">
                            Table #{tableId}
                        </div>
                    )} */}
                    
                    {/* Community cards */}
                    {isGameStarted && (
                        <ul className="flex gap-2 w-fit absolute top-[50%] left-[37%]" style={{ 
                            transform: 'translateY(-50%)',    
                            top: "50%",
                            left: "37%" }}>
                            {Array(5).fill(null).map((_, index) => (
                                <li key={index}>
                                    <div className="ring-1 bg-transparent flex items-center justify-center ring-secondary-950 w-10 h-14 rounded-sm">
                                        {communityCards[index] ? (
                                            <div className="w-full h-full bg-white-950 rounded-sm flex items-center justify-center text-xs">
                                                {communityCards[index].cardFace} {getSuitSymbol(communityCards[index].suit)}
                                            </div>
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
                        <div className="">
                            <PlayerPositions />
                        </div>
                    )}
                </div>
            </section>
        </ErrorBoundary>
    );
};

// Helper to determine how many cards should be visible
function getVisibleCardCount(phase:string) {
    switch (phase) {
        case 'flop':
        case 'betting2': return 3;
        case 'turn':
        case 'betting3': return 4;
        case 'river':
        case 'betting4': 
        case 'showdown': return 5;
        default: return 0;
    }
}

// Get suit symbol
function getSuitSymbol(suit:string) {
    switch (suit) {
        case 'Heart': return '♥';
        case 'Spade': return '♠';
        case 'Club': return '♣';
        case 'Diamond': return '♦';
        default: return '';
    }
}

// Component to render player positions around the table
const PlayerPositions = () => {
    const { state } = useGame();
    const { players, phase } = state;
    
    // Positions for 6 players around the circular table
    const positions = [
        { bottom: '-30%', left: '50%', transform: 'translateX(-50%)' }, // bottom center (user)
        { bottom: '20%', left: '0%', transform: 'translateX(0)' }, // bottom left
        { top: '0%', left: '15%', transform: 'translateX(0)' }, // top left
        { top: '0', left: '50%', transform: 'translateX(-50%)' }, // top center
        { top: '0%', right: '15%', transform: 'translateX(0)' }, // top right
        { bottom: '20%', right: '0%', transform: 'translateX(0)' }, // bottom right
    ];
    
    return (
        <>
            {players.map((player) => {
                const isCurrentPlayer = player.position === 0;
                const playerPosition = positions[player.position];
                const isWinner = phase === 'showdown' && state.winners.some(w => w.id === player.id);
                
                return (
                    <div 
                        key={player.id}
                        className={`absolute ${player.isTurn ? 'ring-2 ring-secondary-950 bg-opacity-50 bg-primary-blue-950 rounded-md p-1' : ''} ${isWinner ? 'ring-2 ring-secondary-950' : ''}`}
                        style={playerPosition}
                    >
                        <div className="flex flex-col items-center">
                            {/* Player marker & name */}
                            <div className={`text-xs ${isCurrentPlayer ? 'text-secondary-950' : 'text-white-950'} px-2 py-1 rounded-md shadow-md bg-primary-blue-300 flex items-center gap-3`}>
                                {player.name} 
                                {player.isDealer && <span className="ml-1 text-secondary-950">D</span>}
                                {player.isSmallBlind && <span className="ml-1 text-secondary-950">SB</span>}
                                {player.isBigBlind && <span className="ml-1 text-secondary-950">BB</span>}
                            </div>
                            
                            {/* Player chips */}
                            <div className="text-xs text-secondary-950 mt-1">
                                {player.chips} chips
                            </div>
                            
                            {/* Player cards */}
                            {player.cards.length > 0 && (
                                <div className="flex gap-1 mt-1">
                                    {isCurrentPlayer || (phase === 'showdown' && !player.folded) ? (
                                        // Show current player's cards face up
                                        player.cards.map((cardItem, cardIndex) => (
                                            <div key={cardIndex} className="w-8 h-10 relative bg-white-950 rounded-sm flex items-center justify-center">
                                                <div className="text-xs">
                                                    {cardItem.cardFace} {getSuitSymbol(cardItem.suit)}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        // Show other players' cards face down
                                        Array(2).fill(null).map((_, cardIndex) => (
                                            <div key={cardIndex} className="w-8 h-10">
                                                {player.folded ? (
                                                    <div className="w-full h-full bg-primary-600 rounded-sm flex items-center justify-center">
                                                        <span className="text-xs text-white-950">Fold</span>
                                                    </div>
                                                ) : (
                                                    <img src={card} alt="card back" className="w-full h-full object-contain rounded-sm" />
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                            
                            {/* Player action/status */}
                            {player.lastAction && (
                                <div className={`mt-1 text-xs px-1 rounded ${
                                    player.lastAction === 'fold' ? 'bg-primary-600 text-white-950' :
                                    player.lastAction === 'check' ? 'bg-blue-500 text-white-950' :
                                    player.lastAction === 'call' ? 'bg-green-500 text-white-950' :
                                    player.lastAction === 'raise' ? 'bg-yellow-500 text-white-950' :
                                    player.lastAction === 'all-in' ? 'bg-red-500 text-white-950' :
                                    player.lastAction === 'winner' ? 'bg-secondary-950 text-white-950' :
                                    'bg-gray-500 text-white-950'
                                }`}>
                                    {player.lastAction}
                                </div>
                            )}
                            
                            {/* Current bet */}
                            {player.bet > 0 && (
                                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-xs text-white-950 px-1 py-0.5 rounded-full">
                                    {player.bet}
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