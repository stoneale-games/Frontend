import { v1 as uuid } from 'uuid';
import { handlePhaseShift, reconcilePot, anteUpBlinds, determineBlindIndices } from './bet.js';
import { dealMissingCommunityCards, showDown, generateDeckOfCards, shuffle, dealPrivateCards } from './cards.js';

const generateTable = async () => {
    const users: any[] = [{
        id: uuid(),
        name: 'Player 1',
        avatarURL: '/player.png',
        cards: [],
        showDownHand: {
            hand: [],
            descendingSortHand: [], 
        },
        chips: 20000,
        roundStartChips: 20000,
        roundEndChips: 20000,
        currentRoundChipsInvested: 0,
        bet: 0,
        betReconciled: false,
        folded: false,
        allIn: false,
        canRaise: true,
        stackInvestment: 0,
        robot: false
    }];

    const firstNames = [
        'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
        'William', 'Elizabeth', 'David', 'Susan', 'Joseph', 'Jessica', 'Thomas'
    ];
    
    const lastNames = [
        'Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson',
        'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris'
    ];
    
    for (let i = 0; i < 4; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const randomizedChips = Math.floor(Math.random() * (20000 - 18000)) + 18000;
        // const avatarId = Math.floor(Math.random() * 8) + 1;
        
        users.push({
            id: uuid(),
            name: `${firstName} ${lastName}`,
            avatarURL: `/player.png`,
            cards: [],
            chips: randomizedChips,
            roundStartChips: randomizedChips,
            roundEndChips: randomizedChips,
            currentRoundChipsInvested: 0,
            showDownHand: {
                hand: [],
                descendingSortHand: [],
            },
            bet: 0,
            betReconciled: false,
            folded: false,
            allIn: false,
            robot: true,
            canRaise: true,
            stackInvestment: 0,
        });
    }

    return users;
}

// const generatePersonality = (seed: any) => {
//     switch(seed) {
//         case (seed > 0.5): 
//             return 'standard';
//         case (seed > 0.35): 
//             return 'aggressive';
//         case (seed > 0):
//         default: 
//             return 'conservative';
//     }
// }

const handleOverflowIndex = (currentIndex: any, incrementBy: any, arrayLength: any, direction: any) => {
    switch (direction) {
        case('up'): {
            return (
                (currentIndex + incrementBy) % arrayLength
            );
        }
        case('down'): {
            return (
                ((currentIndex - incrementBy) % arrayLength) + arrayLength 
            );
        }
        default: throw Error("Attempted to overfow index on unfamiliar direction");
    }
}

const determinePhaseStartActivePlayer = (state: any, recursion = false) => {
    if (!recursion) {
        state.activePlayerIndex = handleOverflowIndex(state.blindIndex.big, 1, state.players.length, 'up');
    } else if (recursion) {
        state.activePlayerIndex = handleOverflowIndex(state.activePlayerIndex, 1, state.players.length, 'up');
    }
    if (state.players[state.activePlayerIndex].folded) {
        return determinePhaseStartActivePlayer(state, true);
    }
    if (state.players[state.activePlayerIndex].chips === 0) {
        return determinePhaseStartActivePlayer(state, true);
    }
    return state;
}

const determineNextActivePlayer = (state: any) => {
    state.activePlayerIndex = handleOverflowIndex(state.activePlayerIndex, 1, state.players.length, 'up');
    const activePlayer = state.players[state.activePlayerIndex];

    const allButOnePlayersAreAllIn = (state.numPlayersActive - state.numPlayersAllIn === 1);
    if (state.numPlayersActive ===  1) {
        console.log("Only one player active, skipping to showdown.");
        return(showDown(reconcilePot(dealMissingCommunityCards(state))));
    }
    if (activePlayer.folded) {
        console.log("Current player index is folded, going to next active player.");
        return determineNextActivePlayer(state);
    }

    if (
        allButOnePlayersAreAllIn &&
        !activePlayer.folded &&
        activePlayer.betReconciled
    ) {
        return(showDown(reconcilePot(dealMissingCommunityCards(state))));
    }

    if (activePlayer.chips === 0) {
        if (state.numPlayersAllIn === state.numPlayersActive) {
            console.log("All players are all in.");
            return(showDown(reconcilePot(dealMissingCommunityCards(state))));
        } else if (allButOnePlayersAreAllIn && activePlayer.allIn) {
            return(showDown(reconcilePot(dealMissingCommunityCards(state))));
        } else {
            return determineNextActivePlayer(state);
        }
    }

    if (activePlayer.betReconciled) {
        console.log("Player is reconciled with pot, round betting cycle complete, proceed to next round.");
        return handlePhaseShift(state);
    }

    return state;
}

const passDealerChip = (state: any) => {
    state.dealerIndex = handleOverflowIndex(state.dealerIndex, 1, state.players.length, 'up');
    const nextDealer = state.players[state.dealerIndex];
    if (nextDealer.chips === 0) {
        return passDealerChip(state);
    }

    return filterBrokePlayers(state, nextDealer.name);
}

const filterBrokePlayers = (state: any, dealerID: any) => {
    state.players = state.players.filter((player: any) => player.chips > 0);
    const newDealerIndex = state.players.findIndex((player: any) => player.name === dealerID);
    state.dealerIndex = newDealerIndex;
    state.activePlayerIndex = newDealerIndex;
    if (state.players.length === 1) {
        return state;
    } else if (state.players.length === 2) {
        state.blindIndex.small = newDealerIndex;
        state.blindIndex.big = handleOverflowIndex(newDealerIndex, 1, state.players.length, 'up');
        state.players = anteUpBlinds(state.players, { bigBlindIndex: state.blindIndex.big, smallBlindIndex: state.blindIndex.small }, state.minBet).map((player: any) => ({
            ...player,
            cards:[],
            showDownHand: {
                hand: [],
                descendingSortHand: [],
            },
            roundStartChips: player.chips + player.bet,
            currentRoundChipsInvested: 0,
            betReconciled: false,
            folded: false,
            allIn: false,
        }));
        state.numPlayersAllIn = 0;
        state.numPlayersFolded = 0;
        state.numPlayersActive = state.players.length;
    } else {
        const blindIndicies = determineBlindIndices(newDealerIndex, state.players.length);
        state.blindIndex = {
            big: blindIndicies.bigBlindIndex,
            small: blindIndicies.smallBlindIndex,
        };
        state.players = anteUpBlinds(state.players, blindIndicies, state.minBet).map((player: any) => ({
            ...player,
            cards: [],
            showDownHand: {
                hand: [],
                descendingSortHand: [],
            },
            roundStartChips: player.chips + player.bet,
            currentRoundChipsInvested: 0,
            betReconciled: false,
            folded: false,
            allIn: false,
        }));
        state.numPlayersAllIn = 0;
        state.numPlayersFolded = 0;
        state.numPlayersActive = state.players.length;
    }
    return dealPrivateCards(state);
}

const beginNextRound = (state: any) => {
    state.communityCards = [];
    state.sidePots = [];
    state.playerHierarchy = [];
    state.showDownMessages = [];
    state.deck = shuffle(generateDeckOfCards());
    state.highBet = 20;
    state.betInputValue = 20;
    state.minBet = 20;
    const { players } = state;
    const clearPlayerCards = players.map((player: any) => ({...player, cards: player.cards.map(() => ({}))}));
    state.players = clearPlayerCards;
    return passDealerChip(state);
}

const checkWin = (players: any) => {
    return (players.filter((player: any) => player.chips > 0).length === 1);
}

export { generateTable, handleOverflowIndex, determineNextActivePlayer, determinePhaseStartActivePlayer, beginNextRound, checkWin };