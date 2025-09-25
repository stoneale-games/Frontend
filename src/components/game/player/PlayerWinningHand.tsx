import  { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Crown, Trophy, Sparkles, DollarSign } from 'lucide-react';
import type { GameWinner} from "@/components/game/types.ts";

// Mock PlayerWinningHand component
/*export const PlayerWinningHand = ({ wH }: { wH: GameWinner }) => (
    <div className="flex gap-1">
      {/!*  {wH.winningHand?.map((card, i) => (
            <div key={i} className="w-12 h-16 bg-white rounded border-2 border-gray-300 flex items-center justify-center text-xs font-bold">
                {card.rank}
                {card.suit === 'hearts' && '♥️'}
                {card.suit === 'diamonds' && '♦️'}
                {card.suit === 'clubs' && '♣️'}
                {card.suit === 'spades' && '♠️'}
            </div>
        ))}*!/}
        <p>winning hands.</p>
    </div>
);*/

// Confetti particle component
const ConfettiParticle = ({ delay }: { delay: number }) => (
    <motion.div
        className="absolute w-3 h-3 rounded"
        style={{
            background: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'][Math.floor(Math.random() * 5)],
            left: `${Math.random() * 100}%`,
            top: '-10px'
        }}
        initial={{ y: -20, rotate: 0, opacity: 1 }}
        animate={{
            y: window.innerHeight + 100,
            rotate: 360 * 3,
            opacity: 0,
            x: [0, Math.random() * 200 - 100, Math.random() * 400 - 200]
        }}
        transition={{
            duration: 3 + Math.random() * 2,
            delay: delay,
            ease: 'easeOut'
        }}
    />
);


// Main Winner Display Component
export const WinnerDisplay = ({
                                  winner,
                                  isVisible,
                                  onClose,
                                  onContinue,
                              }: {
    winner: GameWinner;
    isVisible: boolean;
    onClose: () => void;
    onContinue:()=>void;
}) => {
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiCount, setConfettiCount] = useState(0);


    useEffect(() => {
        if (isVisible) {
            setShowConfetti(true);
            // Create confetti bursts
            const interval = setInterval(() => {
                setConfettiCount(prev => prev + 1);
            }, 200);

            // Stop confetti after 3 seconds
            setTimeout(() => {
                setShowConfetti(false);
                clearInterval(interval);
            }, 3000);

            return () => clearInterval(interval);
        }
    }, [isVisible]);

    const getHandRankText = (rank: number) => {
        const ranks = [
            'High Card',
            'Pair',
            'Two Pair',
            'Three of a Kind',
            'Straight',
            'Flush',
            'Full House',
            'Four of a Kind',
            'Straight Flush',
            'Royal Flush'
        ];
        return ranks[rank] || 'Unknown Hand';
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => {
                        // Only close if clicking directly on the overlay, not on child elements
                        if (e.target === e.currentTarget) {
                            onClose();
                        }
                    }}
                >
                    {/* Confetti */}
                    {showConfetti && Array.from({ length: Math.min(confettiCount * 8, 100) }).map((_, i) => (
                        <ConfettiParticle key={`${confettiCount}-${i}`} delay={i * 0.1} />
                    ))}

                    {/* Main Winner Card */}
                    <motion.div
                        className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl p-8 max-w-lg w-full mx-4 text-center shadow-2xl border-4 border-yellow-300"
                        initial={{ scale: 0, rotate: -10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 10 }}
                        transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Floating decorative elements */}
                        <motion.div
                            className="absolute -top-6 -left-6"
                            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        >
                            <Crown className="w-12 h-12 text-yellow-200" />
                        </motion.div>

                        <motion.div
                            className="absolute -top-4 -right-4"
                            animate={{ rotate: -360, scale: [1, 1.1, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                        >
                            <Sparkles className="w-10 h-10 text-yellow-200" />
                        </motion.div>

                        {/* Winner Title */}
                        <motion.h1
                            className="text-5xl font-black text-white mb-4 drop-shadow-lg"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            🎉 WINNER! 🎉
                        </motion.h1>

                        {/* Player ID */}
                        <motion.div
                            className="mb-6"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: 'spring' }}
                        >
                            <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm">
                                <p className="text-white/80 text-sm uppercase tracking-wider">Player</p>
                                <p className="text-white text-2xl font-bold">{winner.playerId}</p>
                            </div>
                        </motion.div>

                        {/* Hand Rank */}
                        <motion.div
                            className="mb-6"
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex items-center justify-center gap-3 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <Trophy className="w-6 h-6 text-yellow-200" />
                                <div>
                                    <p className="text-white/80 text-sm">Winning Hand</p>
                                    <p className="text-white text-xl font-bold">{getHandRankText(winner.handRank)}</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Winning Cards */}
                        {/*{winner.winningHand && (
                            <motion.div
                                className="mb-6"
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                <p className="text-white/80 text-sm mb-3">Winning Cards</p>
                                <div className="flex justify-center">
                                    <PlayerWinningHand wH={winner} />
                                </div>
                            </motion.div>
                        )}*/}

                        {/* Amount Won */}
                        <motion.div
                            className="mb-6"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1, type: 'spring', damping: 10 }}
                        >
                            <motion.div
                                className="bg-green-500 rounded-xl p-6 shadow-lg"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <DollarSign className="w-8 h-8 text-white" />
                                    <span className="text-white text-4xl font-black">
                    {winner.amountWon.toLocaleString()}
                  </span>
                                </div>
                                <p className="text-green-100 text-sm uppercase tracking-widest">Chips Won</p>
                            </motion.div>
                        </motion.div>

                        {/* Close Button */}
                        <motion.button
                            className="bg-white text-yellow-600 px-8 py-3 rounded-xl font-bold text-lg hover:bg-yellow-50 transition-colors shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                console.log("closing game");
                                onContinue();
                            }}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            style={{ pointerEvents: 'auto', zIndex: 1000 }} // Ensure button is clickable
                        >
                            Continue Game
                        </motion.button>

                        {/* Pulsing glow effect */}
                        <motion.div
                            className="absolute inset-0 rounded-3xl pointer-events-none"
                            style={{
                                background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
                                boxShadow: '0 0 50px rgba(255, 215, 0, 0.5)'
                            }}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
