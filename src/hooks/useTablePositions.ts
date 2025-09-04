// /hooks/useTablePositions.ts
import { cn } from '@/lib/utils';
import {useCallback, useState} from "react";
import type {PlayerState} from "@/components/game/types.ts";

export type TablePosition = {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    transform?: string;

    positionType:
        | 'dealer'
        | 'firstPlayer'
        | 'bottom'
        | 'bottom-right'
        | 'right'
        | 'top'
        | 'top-right'
        | 'top-right-center'
        | 'top-left-center'
        | 'top-left'
        | 'left'
        | 'bottom-left'
        | 'bottom-left-center';

    cardDirection:
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'top-left'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-right';

    stackDirection:
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'top-left'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-right';

    betDirection:
        | 'top'
        | 'bottom'
        | 'left'
        | 'right'
        | 'top-left'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-right';

    customClasses?: {
        container?: string;
        cards?: string;
        stack?: string;
        bet?: string;
    };
};

const tablePositions: TablePosition[] = [
    // Dealer
    {
        bottom: '7%',
        left: '65%',
        transform: 'translateX(-50%)',
        positionType: 'dealer',
        cardDirection: 'right',
        stackDirection: 'bottom',
        betDirection: 'top-left',
        customClasses:{
            cards: '-top-10',
            bet: '!-top-24 right-10', // push bet higher & always override

        }
    },

    // 1) Bottom-center
    {
        bottom: '7%',
        left: '40%',
        transform: 'translateX(-50%)',
        positionType: 'bottom',
        cardDirection: 'right',
        stackDirection: 'bottom',
        betDirection: 'top-left',
        customClasses: {
            cards: '-top-10',
            bet: '!-top-24 right-10', // push bet higher & always override
        },
    },
    // 2) Bottom-right
    {
        top: '60%',
        right: '-7%',
        transform: 'translateY(-50%)',
        positionType: 'right',
        cardDirection: 'left',
        stackDirection: 'right',
        betDirection: 'left',
    },

    // 3) Right side
    {
        top: '38%',
        right: '-7%',
        transform: 'translateY(-50%)',
        positionType: 'right',
        cardDirection: 'left',
        stackDirection: 'right',
        betDirection: 'left',
    },
    // 4) Top-right
    {
        top: '6.5%',
        left: '35%',
        transform: 'translateX(-50%)',
        positionType: 'dealer',
        cardDirection: 'bottom',
        stackDirection: 'top',
        betDirection: 'bottom',
        customClasses:{
            cards: '-top-6',
          /*  bet: '!-top-24 right-10', // push bet higher & always override
*/
        }
    },

    // 5) Top-right-center
    {
        top: '6.5%',
        left: '65%',
        transform: 'translateX(-50%)',
        positionType: 'dealer',
        cardDirection: 'bottom',
        stackDirection: 'top',
        betDirection: 'bottom',
        customClasses:{
            cards: '-top-6',
         /*   bet: '!-top-24 right-10', // push bet higher & always override
*/
        }
    },

    // 6) Top-left-center
    {
        top: '60%',
        left: '-6.5%',
        transform: 'translateY(-50%)',
        positionType: 'right',
        cardDirection: 'right',
        stackDirection: 'left',
        betDirection: 'right',
    },

    // 7) Top-left
    {
        top: '38%',
        left: '-7%',
        transform: 'translateY(-50%)',
        positionType: 'right',
        cardDirection: 'right',
        stackDirection: 'left',
        betDirection: 'right',
    },

    // 8) Left side
    {
        top: '50%',
        left: '-3%',
        transform: 'translateY(-50%)',
        positionType: 'left',
        cardDirection: 'right',
        stackDirection: 'right',
        betDirection: 'right',
    },

    // 9) Bottom-left
    {
        bottom: '20%',
        left: '8%',
        transform: 'translateX(-50%)',
        positionType: 'bottom-left',
        cardDirection: 'right',
        stackDirection: 'top-right',
        betDirection: 'top-right',
        customClasses: {
            container: 'scale-110',
            cards: 'drop-shadow-lg',
        },
    },

    // 10) Bottom-left-center
    {
        bottom: '8%',
        left: '27%',
        transform: 'translateX(-50%)',
        positionType: 'bottom-left-center',
        cardDirection: 'top-right',
        stackDirection: 'top',
        betDirection: 'top',
    },
];

export const useTablePositions = () => {
    // Assign players to seats
    const [players, setPlayers] = useState<PlayerState[]>([]);
    const [seatAssignments, setSeatAssignments] = useState<{ [seat: number]: PlayerState }>({});

    const assignSeats = useCallback((newPlayers: PlayerState[]) => {
        setPlayers(newPlayers);

        const assignments: { [seat: number]: PlayerState } = {};
        newPlayers.forEach((player) => {
            if (player.seat != null && player.seat <= 10) {
                assignments[player.seat] = player;
            }
        });
        setSeatAssignments(assignments);
    }, []);



    const getTablePosition = (seatNumber: number): TablePosition => {
        return tablePositions[seatNumber] || tablePositions[0];
    };

    const getPlayerPositionType = (positionType: string) => {
        switch (positionType) {
            case 'bottom':
            case 'bottom-right':
            case 'bottom-left':
            case 'bottom-left-center':
                return 'bottom';
            case 'left':
                return 'left';
            case 'right':
                return 'right';
            case 'top':
            case 'top-left':
            case 'top-left-center':
                return 'top-left';
            case 'top-right':
            case 'top-right-center':
                return 'top-right';
            default:
                return 'top-center';
        }
    };

    const mergeClasses = (
        seatNumber: number,
        defaults: string,
        type: 'cards' | 'stack' | 'bet'
    ) => {
        const position = getTablePosition(seatNumber);
        return cn(defaults, position.customClasses?.[type]);
    };

    // Cards
    const getCardPositionClasses = (seatNumber: number) => {
        const { cardDirection } = getTablePosition(seatNumber);
        const base = 'absolute z-10 flex -space-x-2';
        let defaults: string;
        switch (cardDirection) {
            case 'top': defaults = `${base} -top-12 left-1/2 transform -translate-x-1/2`; break;
            case 'bottom': defaults = `${base} -bottom-12 left-1/2 transform -translate-x-1/2`; break;
            case 'left': defaults = `${base} top-1/2 -left-16 transform -translate-y-1/2`; break;
            case 'right': defaults = `${base} top-1/2 -right-16 transform -translate-y-1/2`; break;
            case 'top-left': defaults = `${base} -top-12 -left-8`; break;
            case 'top-right': defaults = `${base} -top-12 -right-8`; break;
            case 'bottom-left': defaults = `${base} -bottom-12 -left-8`; break;
            case 'bottom-right': defaults = `${base} -bottom-12 -right-8`; break;
            default: defaults = `${base} -top-12 left-1/2 transform -translate-x-1/2`;
        }
        return mergeClasses(seatNumber, defaults, 'cards');
    };

    // Stack label
    const getStackPositionClasses = (seatNumber: number) => {
        const { stackDirection } = getTablePosition(seatNumber);
        const base = 'absolute z-20 text-yellow-400 font-semibold text-xs bg-black/50 px-2 py-1 rounded-md backdrop-blur-sm';
        let defaults: string;
        switch (stackDirection) {
            case 'top': defaults = `${base} -top-8 left-1/2 transform -translate-x-1/2`; break;
            case 'bottom': defaults = `${base} -bottom-8 left-1/2 transform -translate-x-1/2`; break;
            case 'left': defaults = `${base} top-1/2 -left-12 transform -translate-y-1/2`; break;
            case 'right': defaults = `${base} top-1/2 -right-12 transform -translate-y-1/2`; break;
            case 'top-left': defaults = `${base} -top-8 -left-8`; break;
            case 'top-right': defaults = `${base} -top-8 -right-8`; break;
            case 'bottom-left': defaults = `${base} -bottom-8 -left-8`; break;
            case 'bottom-right': defaults = `${base} -bottom-8 -right-8`; break;
            default: defaults = `${base} -top-8 left-1/2 transform -translate-x-1/2`;
        }
        return mergeClasses(seatNumber, defaults, 'stack');
    };

    // Bet chips
    const getBetPositionClasses = (seatNumber: number) => {
        const { betDirection } = getTablePosition(seatNumber);
        const base = 'absolute z-40 pointer-events-none';
        let defaults: string;
        switch (betDirection) {
            case 'top': defaults = `${base} -top-16 left-1/2 transform -translate-x-1/2`; break;
            case 'bottom': defaults = `${base} -bottom-16 left-1/2 transform -translate-x-1/2`; break;
            case 'left': defaults = `${base} top-1/2 -left-20 transform -translate-y-1/2`; break;
            case 'right': defaults = `${base} top-1/2 -right-20 transform -translate-y-1/2`; break;
            case 'top-left': defaults = `${base} -top-16 -left-12`; break;
            case 'top-right': defaults = `${base} -top-16 -right-12`; break;
            case 'bottom-left': defaults = `${base} -bottom-16 -left-12`; break;
            case 'bottom-right': defaults = `${base} -bottom-16 -right-12`; break;
            default: defaults = `${base} -top-16 left-1/2 transform -translate-x-1/2`;
        }
        return mergeClasses(seatNumber, defaults, 'bet');
    };

    return {
        players,
        seatAssignments,
        assignSeats, // function to update players + seats
        tablePositions,
        getTablePosition,
        getPlayerPositionType,
        getCardPositionClasses,
        getStackPositionClasses,
        getBetPositionClasses,
    };
};
