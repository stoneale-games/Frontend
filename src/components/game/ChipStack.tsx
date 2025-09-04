// components/game/ChipStack.tsx
import React from 'react';
import { Chip } from './Chip';
import type { ChipValue } from './types';
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react"

// --- Helper to break down amount into chips ---
const breakIntoChips = (amount: number): ChipValue[] => {
    const denominations: ChipValue[] = [1000, 500, 100, 25, 10, 5];
    const result: ChipValue[] = [];
    let remaining = amount;
    for (const value of denominations) {
        while (remaining >= value) {
            result.push(value);
            remaining -= value;
        }
    }
    // Largest at bottom
    return result.reverse();
};

// --- Group chips into multiple stacks if too many ---
const groupChips = (chips: ChipValue[], maxPerStack = 15, maxStacks = 5): ChipValue[][] => {
    const groups: ChipValue[][] = [];
    for (let i = 0; i < chips.length && groups.length < maxStacks; i += maxPerStack) {
        groups.push(chips.slice(i, i + maxPerStack));
    }
    return groups;
};

interface ChipStackProps {
    amount: number;
    className?: string;
}

export const ChipStack: React.FC<ChipStackProps> = ({ amount, className }) => {
    const chips = breakIntoChips(amount);
    if (chips.length === 0) return null;

    const groups = groupChips(chips);
    const hiddenCount = chips.length - groups.flat().length;

    // Shadow grows darker and wider as stack gets taller, but capped
    const shadowIntensity = Math.min(0.35, 0.2 + groups.length * 0.05);
    const shadowWidth = 4 + Math.min(6, groups.length * 0.5);
    const shadowHeight = 2 + Math.min(4, groups.length * 0.3);

    return (
        <div className={cn("relative flex items-end justify-center gap-3", className)}>
            {/* Dynamic shadow under stack with smooth fade */}
            <motion.div
                className="absolute bottom-0 rounded-full blur-md pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: shadowIntensity }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{
                    width: `${shadowWidth}rem`,
                    height: `${shadowHeight}rem`,
                    backgroundColor: `rgba(0,0,0,1)`,
                }}
            />

            {groups.map((group, gIndex) => (
                <div
                    key={gIndex}
                    className="relative flex items-end justify-center"
                    style={{
                        height: `${group.length * 6 + 60}px`,
                        transform: `translateY(${gIndex % 2 === 0 ? 0 : 4}px) scale(0.9)`,
                    }}
                >
                    <AnimatePresence initial={false}>
                        {group.map((value, index) => (
                            <motion.div
                                key={`${gIndex}-${value}-${index}`}
                                initial={{ y: 40, opacity: 0, scale: 0.9 }}
                                animate={{
                                    y: -(index * 6),
                                    opacity: 1,
                                    scale: [1, 1.08, 1], // bounce in
                                }}
                                exit={{
                                    y: 60,
                                    opacity: 0,
                                    scale: 0.7, // shrink and fall when removed
                                }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="absolute left-1/2 -translate-x-1/2"
                                style={{ zIndex: index, filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.5))` }}
                            >
                                <Chip value={value} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ))}

            {/* If too many chips to display, show a +more counter */}
            {hiddenCount > 0 && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                    +{hiddenCount >= 1000 ? `${Math.floor(hiddenCount / 1000)}K` : hiddenCount} more
                </div>
            )}
        </div>
    );
};