// /components/game/DealerButton.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DealerButtonProps {
    className?: string;
}

export const DealerButton: React.FC<DealerButtonProps> = ({ className }) => {
    return (
        // We use motion.div from the start to prepare for animation
        <motion.div
            // This layoutId will allow us to animate the button moving from player to player
            layoutId="dealer-button"
            className={cn(
                'w-8 h-8 bg-white text-black font-bold text-sm rounded-full flex items-center justify-center border-2 border-yellow-400 shadow-lg',
                className
            )}
        >
            D
        </motion.div>
    );
};