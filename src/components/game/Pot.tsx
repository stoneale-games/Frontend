// /components/game/Pot.tsx
import React from 'react';
import { ChipStack } from './ChipStack';
import { AnimatePresence, motion } from "motion/react"

interface PotProps {
    total: number;
}

export const Pot: React.FC<PotProps> = ({ total }) => {
    return (
        <div className="relative flex flex-col items-center    ">


            {/* Animated Pot value on top */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={total}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 10, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm"
                >
                  {/*  <MoneyCounter amount={total} />*/}
                    {/* The motion.div wrapper is for the text, allowing it to animate smoothly if its size changes */}
                    <motion.div layout>
                <span className="text-yellow-300 font-bold text-lg drop-shadow-lg">
                    Pot: ${total.toLocaleString()}
                </span>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* We conditionally render the ChipStack only if the pot has money in it */}
            {total > 0 && (
                <ChipStack amount={total} />
            )}
        </div>
    );
};