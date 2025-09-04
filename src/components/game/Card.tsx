// components/game/Card.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Suit, CardType } from './types';
import backCardIcon from "@/assets/cp2.png";
// --- Sub-components for Front and Back ---

// The Card Back - with custom background image in center
const CardBack = () => (
    <div className="w-full h-full rounded-lg bg-[#EEEB99] border-2 border-[#EEEB99] shadow-lg flex items-center justify-center">
        {/* Background image in the center */}
        <img
            src={backCardIcon} // ✅ update path to your asset
            alt="Card Back"
            width={20}
            height={20}
            className="object-contain"
        />
    </div>
);

// The Card Face - rank at top-left only, bigger suit in middle
const CardFace: React.FC<{ cardId: CardType; width?: number; height?: number }> = ({
                                                                                       cardId,
                                                                                       width = 80,
                                                                                       height = 112,
                                                                                   }) => {
    if (cardId === '_?') return <div className="w-full h-full bg-[#f8f5f0] rounded-lg" />;

    // Split rank and suit by '-'
    const [rank, suitKey] = cardId.split('-');

    const SUITS: Record<Suit, { symbol: string; color: string }> = {
        Spades: { symbol: '♠', color: 'text-black' },
        Clubs: { symbol: '♣', color: 'text-black' },
        Hearts: { symbol: '♥', color: 'text-red-600' },
        Diamonds: { symbol: '♦', color: 'text-red-600' },
    };

    const suitInfo = SUITS[suitKey as Suit];

    if (!suitInfo) {
        console.warn('Unknown suitKey:', suitKey, 'cardId:', cardId);
        return <div className="w-full h-full bg-gray-200 rounded-lg" />;
    }

    // Scale font sizes based on card dimensions
    const baseWidth = 80;
    const baseHeight = 112;
    const scaleX = width / baseWidth;
    const scaleY = height / baseHeight;
    const scale = Math.min(scaleX, scaleY);

    const rankFontSize = Math.max(12, 18 * scale);
    const suitFontSize = Math.max(24, 64 * scale);
    const padding = Math.max(4, 6 * scale);

    return (
        <div
            className={cn(
                'w-full h-full rounded-lg shadow-lg flex flex-col justify-between font-bold select-none',
                suitInfo.color,
            )}
            style={{
                backgroundColor: '#f8f5f0',
                padding: `${padding}px`,
            }}
        >
            {/* Top-left rank */}
            <div style={{ fontSize: `${rankFontSize}px`, lineHeight: '1' }}>
                {rank.toUpperCase()}
            </div>

            {/* Big centered suit */}
            <div
                className="flex-1 flex items-center justify-center"
                style={{ fontSize: `${suitFontSize}px`, lineHeight: '1' }}
            >
                {suitInfo.symbol}
            </div>
        </div>
    );
};


// --- Main Card Component ---
interface CardProps {
    cardType?: CardType;
    isFaceDown?: boolean;
    className?: string;
    width?: number;
    height?: number;
}

export const Card: React.FC<CardProps> = ({
                                              cardType = '_?',
                                              isFaceDown = false,
                                              className,
                                              width = 80,
                                              height = 112
                                          }) => {
    const layoutId = React.useId();

    return (
        <div
            className={cn(className)}
            style={{
                perspective: '1000px',
                width: `${width}px`,
                height: `${height}px`
            }}
        >
            <motion.div
                layoutId={`${layoutId}-${cardType}`}
                className="relative w-full h-full"
                style={{ transformStyle: 'preserve-3d' }}
                initial={false}
                animate={{ rotateY: isFaceDown ? 180 : 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
                {/* Front Face */}
                <div className="absolute w-full h-full" style={{ backfaceVisibility: 'hidden' }}>
                    <CardFace cardId={cardType} width={width} height={height} />
                </div>

                {/* Back Face */}
                <div
                    className="absolute w-full h-full"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    <CardBack />
                </div>
            </motion.div>
        </div>
    );
};
