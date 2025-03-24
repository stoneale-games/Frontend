// src/components/BoardInfo.tsx
import plug from "../assets/plug.png";
import { useGame } from "../contexts/GameContext";
import ErrorBoundary from "./ErrorBoundary";

const BoardInfo = () => {
    const { state } = useGame();
    const { isGameStarted, phase, players, communityCards, winners, handStrengths } = state;
    
    // Get the current player (user)
    const currentPlayer = players.find(player => player.position === 0);
    
    // Get hand name - simplified for this implementation
    const getHandStrength = () => {
        if (!isGameStarted || !currentPlayer || currentPlayer.cards.length < 2) return "";
        
        // If we've already evaluated hands at showdown
        if (phase === 'showdown' && handStrengths[currentPlayer.id]) {
            return handStrengths[currentPlayer.id].rank;
        }
        
        // If we have community cards, evaluate actual hand (simplified)
        if (communityCards.length > 0) {
            // This is a simplified placeholder - in a real app, you'd evaluate the actual hand
            const allCards = [...currentPlayer.cards, ...communityCards];
            return evaluateSimpleHand(allCards);
        }
        
        // Preflop - just describe hole cards
        const [card1, card2] = currentPlayer.cards;
        if (card1 && card2) {
            if (card1.value === card2.value) {
                return `Pair of ${getCardValueName(card1.cardFace)}s`;
            }
            
            const suited = card1.suit === card2.suit ? "Suited" : "Offsuit";
            return `${getCardValueName(card1.cardFace)}-${getCardValueName(card2.cardFace)} ${suited}`;
        }
        
        return "";
    };
    
    // Helper to convert card values to names
    const getCardValueName = (cardFace) => {
        return cardFace;
    };
    
    // Display win status
    const isWinner = () => {
        if (!currentPlayer || winners.length === 0) return false;
        return winners.some(winner => winner.id === currentPlayer.id);
    };

    return (
        <ErrorBoundary>
            <div className="flex flex-col gap-2 w-64">
                {isGameStarted && currentPlayer && (
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
                            <p className="text-xs mt-2">Phase: {getPhaseDisplay(phase)}</p>
                            {currentPlayer && (
                                <p className="text-xs mt-1">Your chips: {currentPlayer.chips}</p>
                            )}
                            <p className="text-xs mt-1">Pot: {state.pot || 0}</p>
                            <p className="text-xs mt-1">Players: {players.length}</p>
                            
                            {/* Show winner information */}
                            {phase === 'showdown' && winners.length > 0 && (
                                <div className="mt-2 p-1 bg-secondary-950 bg-opacity-20 rounded">
                                    <p className={`text-sm font-bold ${isWinner() ? 'text-secondary-950' : ''}`}>
                                        {isWinner() ? 'You won!' : `${winners[0].name} won!`}
                                    </p>
                                    <p className="text-xs">
                                        With {handStrengths[winners[0].id]?.rank || 'High Card'}
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white-950 flex-1 flex items-center justify-center rounded-t-md">
                            <p className="text-sm text-center">
                                Start a game to see information here
                            </p>
                        </div>
                    )}
                    <button 
                        className="w-full h-10 rounded-b-md bg-primary-blue-300 text-white-950 text-sm"
                        onClick={() => {
                            // This could be used to close help or acknowledge information
                        }}
                    >
                        Ok
                    </button>
                </div>
            </div>
        </ErrorBoundary>
    );
};

// Convert internal phase names to display names
function getPhaseDisplay(phase) {
    switch (phase) {
        case 'betting1': return 'Pre-Flop';
        case 'betting2': return 'Flop';
        case 'betting3': return 'Turn';
        case 'betting4': return 'River';
        case 'showdown': return 'Showdown';
        default: return phase;
    }
}

// Simple hand evaluation - placeholder only
function evaluateSimpleHand(cards) {
    // Count cards of each value
    const valueCounts = {};
    for (const card of cards) {
        valueCounts[card.cardFace] = (valueCounts[card.cardFace] || 0) + 1;
    }
    
    // Count cards of each suit
    const suitCounts = {};
    for (const card of cards) {
        suitCounts[card.suit] = (suitCounts[card.suit] || 0) + 1;
    }
    
    // Check for pairs, three of a kind, etc.
    const pairCount = Object.values(valueCounts).filter(count => count === 2).length;
    const hasThreeOfAKind = Object.values(valueCounts).some(count => count === 3);
    const hasFourOfAKind = Object.values(valueCounts).some(count => count === 4);
    const hasFlush = Object.values(suitCounts).some(count => count >= 5);
    
    if (hasFourOfAKind) return "Four of a Kind";
    if (hasThreeOfAKind && pairCount > 0) return "Full House";
    if (hasFlush) return "Flush";
    if (hasThreeOfAKind) return "Three of a Kind";
    if (pairCount >= 2) return "Two Pair";
    if (pairCount === 1) return "Pair";
    return "High Card";
}

export default BoardInfo;