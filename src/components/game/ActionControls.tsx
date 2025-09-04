
// /components/game/ActionControls.tsx
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

import React from "react";
import { motion } from "framer-motion";
import {
    UserX,
    Check,
    TrendingUp
} from 'lucide-react';
import type {PlayerAction} from "@/components/game/types.ts";

interface ActionControlsProps {
    // The list of actions the backend says are legal right now
    possibleActions: PlayerAction[];

    // The amount required to call, or 0 if checking is possible
    callAmount: number;

    // Min and max values for the bet/raise slider
    minRaise: number;
    maxRaise: number;

    // Callback functions to send actions to our state manager (Zustand)
    onFold: () => void;
    onCheck: () => void;
    onCall: () => void;
    onBet: (amount: number) => void;
    onRaise: (amount: number) => void;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
                                                                  possibleActions,
                                                                  callAmount,
                                                                  minRaise,
                                                                  maxRaise,
                                                                  onFold,
                                                                  onCheck,
                                                                  onCall,
                                                                 /* onBet,*/
                                                                  onRaise,
                                                              }) => {
    const [raiseAmount, setRaiseAmount] = React.useState(minRaise);

    const canFold = possibleActions.includes('fold');
    const canCheck = possibleActions.includes('check');
    const canCall = possibleActions.includes('call');
    const canBet = possibleActions.includes('bet');
    const canRaise = possibleActions.includes('raise');

   /* const handleAllIn = () => {
        setRaiseAmount(maxRaise);
    };
*/
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="flex flex-col gap-6 w-80 max-w-40  p-3  rounded-sm items-center bg-gray-600"
        >
            {/* Amount Display - Outside the card, on top */}
            {(canBet || canRaise) && (
                <div className="text-center ">
                    <span className="text-white font-bold text-sm">
                        ${raiseAmount.toLocaleString()}
                    </span>
                </div>
            )}

            {/* Pot/Slider Section - Only this in a card */}
            {(canBet || canRaise) && (
                <div className="bg-white rounded-sm shadow-lg p-4 w-full">
                    {/* Deep Gray Slider */}
                    <div className="relative">
                        <Slider
                            value={[raiseAmount]}
                            onValueChange={(value) => setRaiseAmount(value[0])}
                            min={minRaise}
                            max={maxRaise}
                            step={10}
                            className="w-full

                            [&_[role=slider]]:bg-white
                            [&_[role=slider]]:border-red-600
                            [&_[role=slider]]:shadow-lg
                            [&_[role=slider]]:w-5
                            [&_[role=slider]]:h-5
                            [&_[role=slider]]:border-2
                            [&_[data-radix-slider-track]]:bg-gray-800
                            [&_[data-radix-slider-range]]:bg-gray-700
                            appearance-none
                          "
                        />

                    </div>
                </div>
            )}

            {/* Action Buttons - Horizontal, Deep Gray */}
            <div className="flex flex-col gap-3 justify-center max-w-30">
                {canFold && (
                    <Button
                        size="lg"
                        onClick={onFold}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 border-0 transition-all duration-200"
                    >
                        <UserX className="w-5 h-5 mr-2" />
                        Fold
                    </Button>
                )}

                {canCheck && (
                    <Button
                        size="lg"
                        onClick={onCheck}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 border-0 transition-all duration-200"
                    >
                        <Check className="w-5 h-5 mr-2" />
                        Check
                    </Button>
                )}

                {canCall && (
                    <Button
                        size="lg"
                        onClick={onCall}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 border-0 transition-all duration-200"
                    >
                        <Check className="w-5 h-5 mr-2" />
                        Call ${callAmount}
                    </Button>
                )}

                {(canBet || canRaise) && (
                    <Button
                        size="lg"
                        onClick={() => onRaise(raiseAmount)}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 px-6 border-0 transition-all duration-200"
                    >
                        <TrendingUp className="w-5 h-5 mr-2" />
                        {'Raise'}
                    </Button>
                )}
            </div>
        </motion.div>
    );
};