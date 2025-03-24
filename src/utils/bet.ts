import { dealFlop, dealTurn, dealRiver, showDown } from './cards';
import { determineNextActivePlayer } from './players';

i

const determineBlindIndices = (dealerIndex: number, numPlayers: number): BlindIndices => {
	return {
		bigBlindIndex: (dealerIndex + 2) % numPlayers,
		smallBlindIndex: (dealerIndex + 1) % numPlayers,
	};
}

const anteUpBlinds = (players: Player[], blindIndices: BlindIndices, minBet: number): Player[] => {
	const { bigBlindIndex, smallBlindIndex } = blindIndices;
	players[bigBlindIndex].bet = minBet;
	players[bigBlindIndex].chips = players[bigBlindIndex].chips - minBet;
	players[smallBlindIndex].bet = minBet / 2;
	players[smallBlindIndex].chips = players[smallBlindIndex].chips - (minBet / 2);
	return players;
}

const determineMinBet = (highBet: number, playerChipsStack: number, playerBet: number): number => {
	const playerTotalChips = playerChipsStack + playerBet;
	if (playerTotalChips < highBet) {
		return playerTotalChips;
	} else {
		return highBet;
	}
}

const handleBet = (state: GameState, bet: number, min: number, max: number): GameState => {
	if (bet < min) {
		state.betInputValue = min;
		console.log("Invalid Bet");
		return state;
	}
	if (bet > max) {
		state.betInputValue = max;
		console.log("Invalid Bet");
		return state;
	}

	if (bet > state.highBet) {
		state.highBet = bet;
		state.minBet = state.highBet;
		for (let player of state.players) {
			if (!player.folded && player.chips > 0) {
				player.betReconciled = false;
			}
		}
	}

	const activePlayer = state.players[state.activePlayerIndex];
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

const handleFold = (state: GameState): GameState => {
	const activePlayer = state.players[state.activePlayerIndex];
	activePlayer.folded = true;
	activePlayer.betReconciled = true;
	state.numPlayersFolded++;
	state.numPlayersActive--;

	return determineNextActivePlayer(state);
}

const handlePhaseShift = (state: GameState): GameState => {
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

const reconcilePot = (state: GameState): GameState => {
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

const calculateSidePots = (state: GameState, playerStacks: Player[]): GameState => {
	const investedPlayers = playerStacks.filter(player => player.sidePotStack > 0);
	if (investedPlayers.length === 0) {
		return state;
	}
	if (investedPlayers.length === 1) {
		const playerToRefund = state.players[state.players.findIndex(player => player.name === investedPlayers[0].name)];
		playerToRefund.chips = playerToRefund.chips + investedPlayers[0].sidePotStack;
		state.pot -= investedPlayers[0].sidePotStack;
		return state;
	}
	
	const ascBetPlayers = investedPlayers.sort((a, b) => a.sidePotStack - b.sidePotStack);
	const smallStackValue = ascBetPlayers[0].sidePotStack;
	
	const builtSidePot = ascBetPlayers.reduce((acc: SidePot, cur: Player) => {
		if (!cur.folded) {
			acc.contestants.push(cur.name);
		}
		acc.potValue = acc.potValue + smallStackValue;
		cur.sidePotStack = cur.sidePotStack - smallStackValue;
		return acc;
	}, {
		contestants: [],
		potValue: 0,
	});
	
	state.sidePots.push(builtSidePot);
	return calculateSidePots(state, ascBetPlayers);
}

const condenseSidePots = (state: GameState): GameState => {
	if (state.sidePots.length > 1) {
		for (let i = 0; i < state.sidePots.length; i++) {
			for (let n = i + 1; n < state.sidePots.length; n++) {
				if (arrayIdentical(state.sidePots[i].contestants, state.sidePots[n].contestants)) {
					state.sidePots[i].potValue = state.sidePots[i].potValue + state.sidePots[n].potValue;
					state.sidePots = state.sidePots.filter((el, index) => index !== n);
				}
			}
		}
	}
	return state;
}

const arrayIdentical = (arr1: string[], arr2: string[]): boolean => {
	if (arr1.length !== arr2.length) {
		return false;
	}
	return arr1.every(el => arr2.includes(el));
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