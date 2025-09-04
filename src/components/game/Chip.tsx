// components/game/Chip.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import type { ChipValue } from './types';

// --- Constants ---

const CHIP_STYLES: Record<ChipValue, { base: string; accent: string; text?: string }> = {
    5:    { base: 'from-red-500 to-red-700',    accent: 'border-red-300' },
    10:   { base: 'from-blue-500 to-blue-700',  accent: 'border-blue-300' },
    25:   { base: 'from-green-500 to-green-700',accent: 'border-green-300' },
    100:  { base: 'from-neutral-700 to-neutral-900', accent: 'border-neutral-400' },
    500:  { base: 'from-purple-500 to-purple-700', accent: 'border-purple-300' },
    1000: { base: 'from-yellow-300 to-yellow-500', accent: 'border-yellow-200', text: 'text-black' },
};

// --- Component Props ---

interface ChipProps {
    value: ChipValue;
    className?: string;
}

// --- Main Component ---

export const Chip: React.FC<ChipProps> = ({ value, className }) => {
    const styles = CHIP_STYLES[value];

    return (
        <div
            className={cn(
                'relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-xl select-none overflow-hidden',
                className
            )}
        >
            {/* Inner circle with gradient */}
            <div
                className={cn(
                    "absolute inset-0 rounded-full bg-gradient-to-b transition-transform duration-300 hover:scale-105 hover:brightness-110",
                    styles.base
                )}
            >
                {/* Glossy shine overlay */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-white/30 to-transparent opacity-40 pointer-events-none" />

                {/* Edge stripes (more realistic: 6 stripes) */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <div
                        key={i}
                        className={cn("absolute h-full w-2 top-0 left-3", styles.accent, "border-y-2 border-transparent")}
                        style={{ transform: `rotate(${i * 60}deg)` }}
                    ></div>
                ))}
            </div>

            {/* Center value with metallic ring + shine */}
            <span
                className={cn(
                    "relative z-10 w-8 h-8 flex items-center justify-center rounded-full border bg-gradient-to-b",
                    styles.base,
                    styles.text ?? "text-white",
                    "border-gray-200 shadow-inner"
                )}
            >
        {/* Metallic ring */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 via-transparent to-gray-500/20 opacity-70" />
                {/* Value text */}
                <span className="relative drop-shadow-sm shadow-black font-bold">
          {value >= 1000 ? `${value / 1000}K` : value}
        </span>
      </span>
        </div>
    );
};