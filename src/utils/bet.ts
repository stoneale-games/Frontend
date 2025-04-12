import { dealFlop, dealTurn, dealRiver, showDown } from './cards.js';
import { determineNextActivePlayer } from './players.js';

const determineBlindIndices = (dealerIndex: any, numPlayers: any) => {
    return {
        bigBlindIndex: (dealerIndex + 2) % numPlayers,
        smallBlindIndex: (dealerIndex + 1) % numPlayers,
    } as any;
}

const anteUpBlinds = (players: any, blindIndices: any, minBet: any) => {
    const { bigBlindIndex, smallBlindIndex } = blindIndices;
    players[bigBlindIndex].bet = minBet;
    players[bigBlindIndex].chips = players[bigBlindIndex].chips - minBet;
    players[smallBlindIndex].bet = minBet / 2;
    players[smallBlindIndex].chips = players[smallBlindIndex].chips - (minBet / 2);
    return players;
}

const determineMinBet = (highBet: any, playerChipsStack: any, playerBet: any) => {
    const playerTotalChips = playerChipsStack + playerBet;
    if (playerTotalChips < highBet) {
        return playerTotalChips;
    } else {
        return highBet;
    }
}

const handleBet = (state: any, bet: any, min: any, max: any) => {
    if (bet < min) {
        state.betInputValue = min;
        return console.log("Invalid Bet");
    }
    if (bet > max) {
        state.betInputValue = max;
        return console.log("Invalid Bet");
    }

    if (bet > state.highBet) {
        state.highBet = bet;
        state.minBet = state.highBet;
        for (let player of state.players) {
            if (!player.folded || !player.chips === false) {
                player.betReconciled = false;
            }
        }
    }

    const activePlayer = state.players[state.activePlayerIndex] as any;
    const subtractableChips = bet - activePlayer.bet;
    activePlayer.bet = bet;

    activePlayer.chips = activePlayer.chips - subtractableChips;
    if (activePlayer.chips === 0) {
        activePlayer.allIn = true;
        state.numPlayersAllIn++;
    }
    activePlayer.betReconciled = true;
    return determineNextActivePlayer(state);
}

const handleFold = (state: any) => {
    const activePlayer = state.players[state.activePlayerIndex] as any;
    activePlayer.folded = true;
    activePlayer.betReconciled = true;
    state.numPlayersFolded++;
    state.numPlayersActive--;

    const nextState = determineNextActivePlayer(state);
    return nextState;
}

const handlePhaseShift = (state: any) => {
    switch(state.phase) {
        case('betting1'): {
            state.phase = 'flop';
            return dealFlop(reconcilePot(state));
        }
        case('betting2'): {
            state.phase = 'turn';
            return dealTurn(reconcilePot(state));
        }
        case('betting3'): {
            state.phase = 'river';
            return dealRiver(reconcilePot(state));
        }
        case('betting4'): {
            state.phase = 'showdown';
            return showDown(reconcilePot(state));
        }
        default: throw Error("handlePhaseShift() called from non-betting phase");
    }
}

const reconcilePot = (state: any) => {
    for (let player of state.players) {
        state.pot = state.pot + player.bet;
        player.sidePotStack = player.bet;
        player.betReconciled = false;
    }

    state = condenseSidePots(calculateSidePots(state, state.players));

    for (let player of state.players) {
        player.currentRoundChipsInvested += player.bet;
        player.bet = 0;
    }

    state.minBet = 0;
    state.highBet = 0;
    state.betInputValue = 0;
    return state;
}

const calculateSidePots = (state: any, playerStacks: any) => {
    const investedPlayers = playerStacks.filter((player: any) => player.sidePotStack > 0);
    if (investedPlayers.length === 0) {
        return state;
    }
    if (investedPlayers.length === 1) {
        const playerToRefund = state.players[state.players.findIndex((player: any) => player.name === investedPlayers[0].name)] as any;
        playerToRefund.chips = playerToRefund.chips + investedPlayers[0].sidePotStack;
        state.pot -= investedPlayers[0].sidePotStack;
        return state;
    }

    const ascBetPlayers = investedPlayers.sort((a: any, b: any) => a.sidePotStack - b.sidePotStack);
    const smallStackValue = ascBetPlayers[0].sidePotStack;
    
    const builtSidePot = ascBetPlayers.reduce((acc: any, cur: any) => {
        if (!cur.folded) {
            acc.contestants.push(cur.name);
        }
        acc.potValue = acc.potValue + smallStackValue;
        cur.sidePotStack = cur.sidePotStack - smallStackValue;
        return acc;
    }, {
        contestants: [] as any,
        potValue: 0,
    });

    state.sidePots.push(builtSidePot);
    return calculateSidePots(state, ascBetPlayers);
}

const condenseSidePots = (state: any) => {
    if (state.sidePots.length > 1) {
        for (let i = 0; i < state.sidePots.length; i++) {
            for (let n = i + 1; n < state.sidePots.length; n++ ) {
                if (arrayIdentical(state.sidePots[i].contestants, state.sidePots[n].contestants)) {
                    state.sidePots[i].potValue = state.sidePots[i].potValue + state.sidePots[n].potValue;
                    state.sidePots = state.sidePots.filter(( index: any) => index !== n);
                }
            }
        }
    }
    return state;
}

const arrayIdentical = (arr1: any, arr2: any) => {
    if (arr1.length !== arr2.length) {
        return false;
    }
    return arr1.map((el: any) => arr2.includes(el)).filter((bool: any) => bool !== true).length !== 0 ? false : true;
}

export { 
    determineBlindIndices, 
    anteUpBlinds, 
    determineMinBet,
    handleBet,
    handleFold,
    handlePhaseShift,
    reconcilePot
};