import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

interface MoneyCounterProps {
    amount: number;
    className?: string;
}

export const MoneyCounter: React.FC<MoneyCounterProps> = ({ amount, className }) => {
    return (
        <div className={`relative flex flex-col items-center ${className}`}>
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                    key={amount}
                    initial={{ y: -10, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: [1, 1.1, 1] }}
                    exit={{ y: 10, opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="px-3 py-1 rounded-lg bg-green-700 text-white font-bold text-lg shadow-lg"
                >
                    ${amount.toLocaleString()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};