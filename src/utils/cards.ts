import { cloneDeep } from 'lodash';
import { handleOverflowIndex, determinePhaseStartActivePlayer } from './players';

const totalNumCards = 52;
const suits = ['Heart', 'Spade', 'Club', 'Diamond'];
const cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const VALUE_MAP: any = {
    2:1,
    3:2,
    4:3,
    5:4,
    6:5,
    7:6,
    8:7,
    9:8,
    10:9,
    J:10,
    Q:11,
    K:12,
    A:13,
};

const randomizePosition = (min: any, max: any) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateDeckOfCards = () => {
    const deck: any[] = [];

    for (let suit of suits) {
        for (let card of cards) {
            deck.push({
                cardFace: card,
                suit: suit,
                value: VALUE_MAP[card]
            })
        }
    }
    return deck;
}

const shuffle = (deck: any) => {
    let shuffledDeck = new Array(totalNumCards);
    let filledSlots: any[] = [];
    for (let i = 0; i < totalNumCards; i++) {
        if (i === 51) {
            const lastSlot = shuffledDeck.findIndex((el) => typeof el == 'undefined');
            shuffledDeck[lastSlot] = deck[i];
            filledSlots.push(lastSlot);
        } else {
            let shuffleToPosition = randomizePosition(0, totalNumCards - 1);
            while (filledSlots.includes(shuffleToPosition)) {
                shuffleToPosition = randomizePosition(0, totalNumCards - 1);
            }
            shuffledDeck[shuffleToPosition] = deck[i];
            filledSlots.push(shuffleToPosition);
        }
    }
    return shuffledDeck;
}

const popCards = (deck: any, numToPop: any) => {
    const mutableDeckCopy = [...deck];
    let chosenCards: any;
    if (numToPop === 1) {
        chosenCards = mutableDeckCopy.pop();
    } else {
        chosenCards = [];
        for(let i = 0; i < numToPop; i++) {
            chosenCards.push(mutableDeckCopy.pop());
        }
    }
    return { mutableDeckCopy, chosenCards };
}

const popShowdownCards = (deck: any, numToPop: any) => {
    const mutableDeckCopy = [...deck];
    let chosenCards: any;
    if (numToPop === 1) {
        chosenCards = [mutableDeckCopy.pop()];
    } else {
        chosenCards = [];
        for(let i = 0; i < numToPop; i++) {
            chosenCards.push(mutableDeckCopy.pop());
        }
    }
    return { mutableDeckCopy, chosenCards };
}

const dealPrivateCards = (state: any) => {
    state.clearCards = false;
    let animationDelay = 0;
    console.log("Dealing Private Cards");
    
    if (!state.players || state.activePlayerIndex === null || state.activePlayerIndex === undefined) {
        console.error("Cannot deal cards: players array or activePlayerIndex is invalid");
        return state;
    }
    
    state.players.forEach((player: any) => {
        if (!player.cards) player.cards = [];
    });
    
    while (state.players[state.activePlayerIndex] && 
           state.players[state.activePlayerIndex].cards &&
           state.players[state.activePlayerIndex].cards.length < 2) {
      
        const { mutableDeckCopy, chosenCards } = popCards(state.deck, 1);
        
        (chosenCards as any).animationDelay = animationDelay;
        animationDelay = animationDelay + 250;
    
        const newDeck = [...mutableDeckCopy];
        state.players[state.activePlayerIndex].cards.push(chosenCards);
    
        state.deck = newDeck;
        state.activePlayerIndex = handleOverflowIndex(state.activePlayerIndex, 1, state.players.length, 'up');
    }
    
    if (state.players[state.activePlayerIndex] && 
        state.players[state.activePlayerIndex].cards && 
        state.players[state.activePlayerIndex].cards.length === 2) {
        state.activePlayerIndex = handleOverflowIndex(state.blindIndex.big, 1, state.players.length, 'up');
        state.phase = 'betting1';
    }
    
    return state;
}

const dealFlop = (state: any) => {
    let animationDelay = 0;
    const { mutableDeckCopy, chosenCards } = popCards(state.deck, 3);
        
    for (let card of chosenCards) {
        (card as any).animationDelay = animationDelay;
        animationDelay = animationDelay + 250;
        state.communityCards.push(card);
    }

    state.deck = mutableDeckCopy;
    state = determinePhaseStartActivePlayer(state);
    state.phase = 'betting2';
        
    return state;
}

const dealTurn = (state: any) => {
    const { mutableDeckCopy, chosenCards } = popCards(state.deck, 1);
    (chosenCards as any).animationDelay = 0;
        
    state.communityCards.push(chosenCards);
    state.deck = mutableDeckCopy;
    state = determinePhaseStartActivePlayer(state);
    state.phase = 'betting3';

    return state;
}

const dealRiver = (state: any) => {
    const { mutableDeckCopy, chosenCards } = popCards(state.deck, 1);
    (chosenCards as any).animationDelay = 0;
        
    state.communityCards.push(chosenCards);
    state.deck = mutableDeckCopy;
    state = determinePhaseStartActivePlayer(state);
    state.phase = 'betting4';

    return state;
}

const showDown = (state: any) => {
    for (let player of state.players) {
        const frequencyHistogram: any = {};
        const suitHistogram: any = {};

        player.showDownHand.hand = player.cards.concat(state.communityCards);
        player.showDownHand.descendingSortHand = player.showDownHand.hand.map((el: any) => el).sort((a: any,b: any) => b.value - a.value);

        player.showDownHand.descendingSortHand.forEach((card: any) => {
            frequencyHistogram[card.cardFace] = (frequencyHistogram[card.cardFace] + 1 || 1);
            suitHistogram[card.suit] = (suitHistogram[card.suit] + 1 || 1);
        });

        player.frequencyHistogram = frequencyHistogram;
        player.suitHistogram = suitHistogram;

        const valueSet = buildValueSet(player.showDownHand.descendingSortHand);

        const { isFlush, flushedSuit } = checkFlush(suitHistogram);
        const flushCards = (isFlush) && player.showDownHand.descendingSortHand.filter((card: any) => card.suit === flushedSuit);
        const isRoyalFlush = (isFlush) && checkRoyalFlush(flushCards);
        const { isStraightFlush, isLowStraightFlush, concurrentSFCardValues, concurrentSFCardValuesLow } = (isFlush as any) && checkStraightFlush(flushCards);
        const { isStraight, isLowStraight, concurrentCardValues, concurrentCardValuesLow } = checkStraight(valueSet);
        const { isFourOfAKind, isFullHouse, isThreeOfAKind, isTwoPair, isPair, frequencyHistogramMetaData } = analyzeHistogram(player.showDownHand.descendingSortHand, frequencyHistogram);
        const isNoPair = ((!isRoyalFlush) && (!isStraightFlush) && (!isFourOfAKind) && (!isFullHouse) && (!isFlush) && (!isStraight) && (!isThreeOfAKind) && (!isTwoPair) && (!isPair));
        
        player.showDownHand.bools = {
            isRoyalFlush,
            isStraightFlush,
            isFourOfAKind,
            isFullHouse,
            isFlush,
            isStraight,
            isThreeOfAKind,
            isTwoPair,
            isPair,
            isNoPair,
        };

        player.showDownHand.heldRankHierarchy = [{
            name: 'Royal Flush',
            match: isRoyalFlush,
        }, {
            name: 'Straight Flush',
            match: isStraightFlush
        }, {
            name: 'Four Of A Kind',
            match: isFourOfAKind,
        }, {
            name: 'Full House',
            match: isFullHouse,
        }, {
            name: 'Flush',
            match: isFlush,
        }, {
            name: 'Straight',
            match: isStraight,
        }, {
            name: 'Three Of A Kind',
            match: isThreeOfAKind,
        }, {
            name: 'Two Pair',
            match: isTwoPair,
        }, {
            name: 'Pair',
            match: isPair,
        }, {
            name: 'No Pair',
            match: isNoPair
        }];

        player.metaData = frequencyHistogramMetaData;

        const highRankPosition = player.showDownHand.heldRankHierarchy.findIndex((el: any) => el.match === true);
        player.showDownHand.bestHandRank = player.showDownHand.heldRankHierarchy[highRankPosition].name;
        player.showDownHand.bestHand = buildBestHand(player.showDownHand.descendingSortHand, player.showDownHand.bestHandRank, flushedSuit, flushCards, concurrentCardValues, concurrentCardValuesLow, isLowStraight, isLowStraightFlush, concurrentSFCardValues, concurrentSFCardValuesLow, frequencyHistogramMetaData);
    }
    
    return distributeSidePots(state);
}

const buildBestHand = (hand: any, bestRank: any, flushedSuit: any, flushCards: any, concurrentCardValues: any, concurrentCardValuesLow: any, isLowStraight: any, isLowStraightFlush: any, concurrentSFCardValues: any, concurrentSFCardValuesLow: any, frequencyHistogramMetaData: any) => {
    switch(bestRank) {
        case('Royal Flush'): {
            return flushCards.slice(0, 5);
        }
        case('Straight Flush'): {
            if (isLowStraightFlush && concurrentSFCardValues.length < 5) {
                concurrentSFCardValuesLow[0] = 13;
                return concurrentSFCardValuesLow.reduce((acc: any, cur: any, index: any) => {
                    if (index < 5) {
                        acc.push(flushCards[flushCards.findIndex((match: any) => match.value === cur)]);
                    }
                    return acc;
                }, []).reverse();
            } else {
                return concurrentSFCardValues.reduce((acc: any, cur: any, index: any) => {
                    if (index < 5) {
                        acc.push(flushCards[flushCards.findIndex((match: any) => match.value === cur)]);
                    }
                    return acc;
                }, []);
            }
        }
        case('Four Of A Kind'): {
            const bestHand: any[] = [];
            let mutableHand = cloneDeep(hand);

            for (let i = 0; i < 4; i++) {
                const indexOfQuad = mutableHand.findIndex((match: any) => match.cardFace === frequencyHistogramMetaData.quads[0].face);
                bestHand.push(mutableHand[indexOfQuad]);
                mutableHand = mutableHand.filter(( index: any) => index !== indexOfQuad);
            }

            return bestHand.concat(mutableHand.slice(0, 1));
        }
        case('Full House'): {
            const bestHand: any[] = [];
            let mutableHand = cloneDeep(hand);
            if (frequencyHistogramMetaData.tripples.length > 1) {
                for (let i = 0; i < 3; i++) {
                    const indexOfTripple = mutableHand.findIndex((match: any) => match.cardFace === frequencyHistogramMetaData.tripples[0].face);
                    bestHand.push(mutableHand[indexOfTripple]);
                    mutableHand = mutableHand.filter(( index: any) => index !== indexOfTripple);
                }
                for (let i = 0; i < 2; i++) {
                    const indexOfPair = mutableHand.findIndex((match: any) => match.cardFace === frequencyHistogramMetaData.tripples[1].face);
                    bestHand.push(mutableHand[indexOfPair]);
                    mutableHand = mutableHand.filter(( index: any) => index !== indexOfPair);
                }
                return bestHand;
            } else {
                for (let i = 0; i < 3; i++) {
                    const indexOfTripple = mutableHand.findIndex((match: any) => match.cardFace === frequencyHistogramMetaData.tripples[0].face);
                    bestHand.push(mutableHand[indexOfTripple]);
                    mutableHand = mutableHand.filter(( index: any) => index !== indexOfTripple);
                }
                for (let i = 0; i < 2; i++) {
                    const indexOfPair = mutableHand.findIndex((match: any) => match.cardFace === frequencyHistogramMetaData.pairs[0].face);
                    bestHand.push(mutableHand[indexOfPair]);
                    mutableHand = mutableHand.filter(( index: any) => index !== indexOfPair);
                }
                return bestHand;
            }
        }
        case('Flush'): {
            return flushCards.slice(0, 5);
        }
        case('Straight'): {
            if (isLowStraight && concurrentCardValues.length < 5) {
                concurrentCardValuesLow[0] = 13;
                return concurrentCardValuesLow.reduce((acc: any, cur: any, index: any) => {
                    if (index < 5) {
                        acc.push(hand[hand.findIndex((match: any) => match.value === cur)]);
                    }
                    return acc;
                }, []).reverse();
            } else {
                return concurrentCardValues.reduce((acc: any, cur: any, index: any) => {
                    if (index < 5) {
                        acc.push(hand[hand.findIndex((match: any) => match.value === cur)]);
                    }
                    return acc;
                }, []);
            }
        }
        case('Three Of A Kind'): {
            const bestHand: any[] = [];
            let mutableHand = cloneDeep(hand);

            for (let i = 0; i < 3; i++) {
                const indexOfTripple = mutableHand.findIndex((match: any) => match.cardFace === frequencyHistogramMetaData.tripples[0].face);
                bestHand.push(mutableHand[indexOfTripple]);
                mutableHand = mutableHand.filter(( any, index: any) => index !== indexOfTripple);
            }

            return bestHand.concat(mutableHand.slice(0, 2));
        }
        case('Two Pair'): {
            const bestHand: any[] = [];
            let mutableHand = cloneDeep(hand);
            for (let i = 0; i < 2; i++) {
                const indexOfPair = mutableHand.findIndex((match: any) => match.cardFace === frequencyHistogramMetaData.pairs[0].face);
                bestHand.push(mutableHand[indexOfPair]);
                mutableHand = mutableHand.filter((match: any, index: any) => index !== indexOfPair);
            }
            
            for (let i = 0; i < 2; i++) {
                const indexOfPair = mutableHand.findIndex((match: any) => match.cardFace === frequencyHistogramMetaData.pairs[1].face);
                bestHand.push(mutableHand[indexOfPair]);
                mutableHand = mutableHand.filter((match: any, index: any) => index !== indexOfPair);
            }
            return bestHand.concat(mutableHand.slice(0, 1));
        }
        case('Pair'): {
            const bestHand: any[] = [];
            let mutableHand = cloneDeep(hand);            
            for (let i = 0; i < 2; i++) {
                const indexOfPair = mutableHand.findIndex((card: any) => card.cardFace === frequencyHistogramMetaData.pairs[0].face);
                bestHand.push(mutableHand[indexOfPair]);
                mutableHand = mutableHand.filter(( index: any) => index !== indexOfPair);
            }
            return bestHand.concat(mutableHand.slice(0, 3));
        }
        case('No Pair'): {
            return hand.slice(0, 5);
        }
        default: throw Error('Recieved unfamiliar rank argument in buildBestHand()');
    }
}

const distributeSidePots = (state: any) => {
    state.playerHierarchy = buildAbsolutePlayerRankings(state);
    console.log("Ultimate Player Hierarchy Determined:");
    console.log(state.playerHierarchy);
    
    for (let sidePot of state.sidePots) {
        const rankMap = rankPlayerHands(state, sidePot.contestants);
        state = battleRoyale(state, rankMap, sidePot.potValue);
    }

    state.players = state.players.map((player: any) => ({
        ...player,
        roundEndChips: player.chips
    }));
    
    return state;
}

const buildAbsolutePlayerRankings = (state: any) => {
    const activePlayers = state.players.filter((player: any) => !player.folded);
    let hierarchy: Array<{name: string, bestHand: any, handRank: string} | Array<{name: string, bestHand: any, handRank: string}>> = [];
    const rankMap = new Map<string, Array<{name: string, bestHand: any, playerIndex: number}>>([
        ['Royal Flush', []], 
        ['Straight Flush', []],
        ['Four Of A Kind', []],
        ['Full House', []],
        ['Flush', []],
        ['Straight', []],
        ['Three Of A Kind', []],
        ['Two Pair', []],
        ['Pair', []],
        ['No Pair', []]
    ]);

    activePlayers.forEach((player: any, playerIndex: any) => {
        const {
            name,
            showDownHand: { bestHandRank, bestHand }
        } = player;
        rankMap.get(bestHandRank)?.push({
            name,
            bestHand,
            playerIndex
        });
    });
    
    for (const [handRank, playersWhoHoldThisRank] of rankMap) {
        if (playersWhoHoldThisRank.length > 0) {
            if (handRank === 'Royal Flush') {
                const formattedPlayersWhoHoldThisRank = playersWhoHoldThisRank.map((player: any) => ({
                    name: player.name,
                    bestHand: player.bestHand,
                    handRank
                }));
                hierarchy = hierarchy.concat(formattedPlayersWhoHoldThisRank);
                continue;
            } 
            if (playersWhoHoldThisRank.length === 1) {
                const { name, bestHand } = playersWhoHoldThisRank[0];
                hierarchy = hierarchy.concat([{
                    name,
                    bestHand, 
                    handRank
                }]);
            } else if (playersWhoHoldThisRank.length > 1) {
                const sortedComparator = buildComparator(handRank, playersWhoHoldThisRank)
                .map((snapshot: any) => { 
                    return snapshot.sort((a: any, b: any) => b.card.value - a.card.value);
                });
                const winnerHierarchy = determineContestedHierarchy(sortedComparator, handRank);
                hierarchy = hierarchy.concat(winnerHierarchy);
            }
        }
    }

    return hierarchy;
}

const determineContestedHierarchy = (sortedComparator: any, handRank: any) => {
    let winnerHierarchy: any[] = [];
    let loserHierarchy: any[] = [];
    const processComparator = (comparator: any, round = 0) => {
        if (comparator[0].length === 1) {
            const { name, bestHand } = comparator[0][0];
            winnerHierarchy = winnerHierarchy.concat([{name, bestHand, handRank}]);
            return;
        }
        let filterableComparator = sortedComparator.map((el: any) => el);
        const frame = comparator[round];
        const { winningFrame, losingFrame } = processSnapshotFrame(frame);
        if (losingFrame.length > 0) {
            const lowerTierComparator = filterableComparator.map((frame: any) => {
                return frame.filter((snapshot: any) => {
                    return losingFrame.some((snapshotToMatchName: any) => {
                        return snapshotToMatchName.name === snapshot.name;
                    });
                });
            });
            loserHierarchy = [lowerTierComparator].concat(loserHierarchy);
        }
        if (winningFrame.length === 1) {
            const {name, bestHand} = winningFrame[0];
            winnerHierarchy = winnerHierarchy.concat([{
                name,
                bestHand,
                handRank
            }]);
        } else if (round === (sortedComparator.length - 1)) {
            const filteredWinnerSnapshots = winningFrame.map((snapshot: any) => ({
                name: snapshot.name,
                bestHand: snapshot.bestHand,
                handRank
            }));
            winnerHierarchy = winnerHierarchy.concat([filteredWinnerSnapshots]);
        } else {
            const higherTierComparator = filterableComparator.map((frame: any) => {
                return frame.filter((snapshot: any) => {
                    return winningFrame.some((snapshotToMatchName: any) => {
                        return snapshotToMatchName.name === snapshot.name;
                    });
                });
            });
            processComparator(higherTierComparator, (round + 1));
        }
    }

    const processLowTierComparators = (loserHierarchyFrame: any) => {
        if (loserHierarchy.length > 0) {
            const loserComparatorToProcess = loserHierarchyFrame[0];
            loserHierarchy = loserHierarchyFrame.slice(1);
            processComparator(loserComparatorToProcess);
            processLowTierComparators(loserHierarchy);
        }
    }
    processComparator(sortedComparator);
    processLowTierComparators(loserHierarchy);
    return winnerHierarchy;
}

const processSnapshotFrame = (frame: any) => {
    const highValue = frame[0].card.value;
    const winningFrame = frame.filter((snapshot: any) => snapshot.card.value === highValue);
    const losingFrame = frame.filter((snapshot: any) => snapshot.card.value < highValue);
    return { winningFrame, losingFrame };
}

const rankPlayerHands = (state: any, contestants: any) => {
    // Define interface for player rank information
    interface PlayerRankInfo {
        name: string;
        playerIndex: number;
        bestHand: any;
    }
    
    const rankMap = new Map<string, PlayerRankInfo[]>([
        ['Royal Flush', []], 
        ['Straight Flush', []],
        ['Four Of A Kind', []],
        ['Full House', []],
        ['Flush', []],
        ['Straight', []],
        ['Three Of A Kind', []],
        ['Two Pair', []],
        ['Pair', []],
        ['No Pair', []]
    ]);

    for (let contestant of contestants) {
        const playerIndex = state.players.findIndex((player: any) => player.name === contestant);
        const player = state.players[playerIndex];
        if (!player.folded) {
            rankMap.get(player.showDownHand.bestHandRank)?.push({
                name: player.name,
                playerIndex,
                bestHand: player.showDownHand.bestHand,
            });
        }
    }
    return rankMap;
}

const battleRoyale = (state: any, rankMap: any, prize: any) => {
    let winnerFound = false;

    rankMap.forEach((contestants: any, rank: any, ) => {
        if (!winnerFound) {
            if (contestants.length === 1) {
                winnerFound = true;
                console.log("Uncontested Winner, ", contestants[0].name, " , beating out the competition with a ", rank);
                state = payWinners(state, contestants, prize, rank);
            } else if (contestants.length > 1) {
                console.log(contestants);
                winnerFound = true;
                const winners = determineWinner(buildComparator(rank, contestants), rank);
                if (winners.length === 1) {
                    console.log("Uncontested Winner, ", winners[0].name, " , beating out the competition with a ", rank);
                    state = payWinners(state, winners, prize, rank);
                } else {
                    console.log("We have a tie! Split the pot amongst ", winners, " Who will take the pot with their ", rank);
                    state = payWinners(state, winners, prize, rank);
                }
            }
        }
    });
    return state;
}

const payWinners = (state: any, winners: any, prize: any, rank: any) => {
    if(winners.length === 1) {
        state.showDownMessages = state.showDownMessages.concat([{
            users: [winners[0].name],
            prize,
            rank
        }]);
        console.log("Transferring ", prize, " chips to ", winners[0].name);
        state.players[winners[0].playerIndex].chips += prize;
        state.pot -= prize;
    } else if (winners.length > 1) {
        const overflow = prize % winners.length;
        const splitPot = Math.floor(prize / winners.length);
        console.log("Mediating Tie. Total Prize ", prize, " split into ", winners.length, " portions with an overflow of ", overflow);
        state.showDownMessages = state.showDownMessages.concat([{
            users: winners.map((winner: any) => winner.name),
            prize: splitPot,
            rank
        }]);
        winners.forEach((winner: any) => {
            state.players[winner.playerIndex].chips += splitPot;
            state.pot -= splitPot;
        });
    }
    return state;
}

const buildComparator = (rank: any, playerData: any) => {
    let comparator: any;
    switch(rank) {
        case('Royal Flush'): {
            comparator = Array.from({length: 1});
            playerData.forEach(( index: any) => {
                comparator.push({
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand
                });
            });
            break;
        }
        case('Four Of A Kind'): {
            comparator = Array.from({length: 2}, () => Array.from({length: 0}));
            playerData.forEach(( index: any) => {
                comparator[0].push({
                    card: playerData[index].bestHand[0],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand
                });
                comparator[1].push({
                    card: playerData[index].bestHand[4],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand
                });
            });
            break;
        }
        case('Full House'): {
            comparator = Array.from({length: 2}, () => Array.from({length: 0}));
            playerData.forEach(( index: any) => {
                comparator[0].push({
                    card: playerData[index].bestHand[0],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand
                });
                comparator[1].push({
                    card: playerData[index].bestHand[3],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand
                });
            });
            break;
        }
        case('Flush'):
        case('No Pair'): {
            comparator = Array.from({length: 5}, () => Array.from({length: 0}));
            playerData.forEach(( index: any) => {
                for (let i = 0; i < 5; i++) {
                    comparator[i].push({
                        card: playerData[index].bestHand[i],
                        name: playerData[index].name,
                        playerIndex: playerData[index].playerIndex,
                        bestHand: playerData[index].bestHand
                    });
                }
            });
            break;
        }
        case('Three Of A Kind'): {
            comparator = Array.from({length: 3}, () => Array.from({length: 0}));
            playerData.forEach(( index: any) => {
                comparator[0].push({
                    card: playerData[index].bestHand[0],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand
                });
                comparator[1].push({
                    card: playerData[index].bestHand[3],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand
                });
                comparator[2].push({
                    card: playerData[index].bestHand[4],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand
                });
            });
            break;
        }
        case('Straight'):
        case('Straight Flush'): {
            comparator = Array.from({length: 1}, () => Array.from({length: 0}));
            playerData.forEach(( index: any) => {
                comparator[0].push({
                    card: playerData[index].bestHand[0],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand
                });
            });
            break;
        }
        case('Two Pair'): {
            comparator = Array.from({length: 3}, () => Array.from({length: 0}));
            playerData.forEach(( index: any) => {
                comparator[0].push({
                    card: playerData[index].bestHand[0],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand
                });
                comparator[1].push({
                    card: playerData[index].bestHand[2],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand
                });
                comparator[2].push({
                    card: playerData[index].bestHand[4],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand
                });
            });
            break;
        }
        case('Pair'): {
            comparator = Array.from({length: 4}, () => Array.from({length: 0}));
            playerData.forEach(( index: any) => {
                comparator[0].push({
                    card: playerData[index].bestHand[0],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand
                });
                comparator[1].push({
                    card: playerData[index].bestHand[2],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand
                });
                comparator[2].push({
                    card: playerData[index].bestHand[3],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand
                });
                comparator[3].push({
                    card: playerData[index].bestHand[4],
                    name: playerData[index].name,
                    playerIndex: playerData[index].playerIndex,
                    bestHand: playerData[index].bestHand
                });
            });
            break;
        }
        default: throw Error('Recieved unfamiliar rank argument in buildComparator()');
    }
    return comparator;
}

const determineWinner = (comparator: any, rank: any) => {
    let winners: any;
    if (rank === 'Royal Flush') return comparator;
    for (let i = 0; i < comparator.length; i++) {
        let highValue = 0;
        let losers: any[] = [];
        winners = comparator[i].sort((a: any, b: any) => b.card.value - a.card.value).reduce((acc: any, cur: any) => {
            if (cur.card.value > highValue) {
                highValue = cur.card.value;
                acc.push({
                    name: cur.name,
                    playerIndex: cur.playerIndex,
                });
                return acc;
            } else if (cur.card.value === highValue) {
                acc.push({
                    name: cur.name,
                    playerIndex: cur.playerIndex,
                });
                return acc;
            } else if (cur.card.value < highValue) {
                losers.push(cur.name);
                return acc; 
            }
        }, []);

        if(winners.length === 1 || i === comparator.length) {
            return winners;
        } else {
            if (losers.length >= 1) {
                losers.forEach((nameToExtract: any) => {
                    comparator = comparator.map((snapshot: any) => snapshot.filter((el: any) => el.name !== nameToExtract));
                });
            }
        }
    }
    return winners;
}

const checkFlush = (suitHistogram: any) => {
    // let isFlush: any;
    // let flushedSuit: any;
    for (let suit in suitHistogram) {
        if (suitHistogram[suit] >= 5) {
            return { 
                isFlush: true,
                flushedSuit: suit,
            };
        } 
    }
    return {
        isFlush: false,
        flushedSuit: null,
    };
}

const checkRoyalFlush = (flushMatchCards: any) => {
    if ((flushMatchCards[0].value === 13) &&
        (flushMatchCards[1].value === 12) &&
        (flushMatchCards[2].value === 11) &&
        (flushMatchCards[3].value === 10) &&
        (flushMatchCards[4].value === 10)) { 
            return true;  
        } else { return false; } 
}

const checkStraightFlush = (flushMatchCards: any) => {
    const valueSet = buildValueSet(flushMatchCards);
    const { isStraight, isLowStraight, concurrentCardValues, concurrentCardValuesLow } = checkStraight(valueSet);
    return {
        isStraightFlush: isStraight,
        isLowStraightFlush: isLowStraight,
        concurrentSFCardValues: concurrentCardValues,
        concurrentSFCardValuesLow: concurrentCardValuesLow,
    };
}

const analyzeHistogram = (hand: any, frequencyHistogram: any) => {
	console.log("Analyzing Histogram",hand);
	
    let isFourOfAKind = false;
    let isFullHouse = false;
    let isThreeOfAKind = false;
    let isTwoPair = false;
    let isPair = false;
    let numTripples = 0;
    let numPairs = 0;
    interface CardMetadata {
        face: string;
        value: number;
    }
    
    let frequencyHistogramMetaData = {
            pairs: [] as CardMetadata[],
            tripples: [] as CardMetadata[],
            quads: [] as CardMetadata[],
        };
    for (let cardFace in frequencyHistogram) {
        if (frequencyHistogram[cardFace] === 4) {
            isFourOfAKind = true;
            frequencyHistogramMetaData.quads.push({
                face: cardFace,
                value: VALUE_MAP[cardFace]
            });
        }
        if (frequencyHistogram[cardFace] === 3) {
            isThreeOfAKind = true;
            numTripples++;
            frequencyHistogramMetaData.tripples.push({
                face: cardFace,
                value: VALUE_MAP[cardFace]
            });
        }
        if (frequencyHistogram[cardFace] === 2) {
            isPair = true;
            numPairs++;
            frequencyHistogramMetaData.pairs.push({
                face: cardFace,
                value: VALUE_MAP[cardFace]
            });
        }
    }

    frequencyHistogramMetaData.pairs = frequencyHistogramMetaData.pairs.map((el: any) => el).sort((a: any,b: any) => b.value - a.value);
    frequencyHistogramMetaData.tripples = frequencyHistogramMetaData.tripples.map((el: any) => el).sort((a: any,b: any) => b.value - a.value);
    frequencyHistogramMetaData.quads = frequencyHistogramMetaData.quads.map((el: any) => el).sort((a: any,b: any) => b.value - a.value);

    if((numTripples >= 2) || (numPairs >= 1 && numTripples >=1)) {
        isFullHouse = true;
    }
    if(numPairs >= 2) {
        isTwoPair = true;
    }

    return {
        isFourOfAKind,
        isFullHouse,
        isThreeOfAKind,
        isTwoPair,
        isPair,
        frequencyHistogramMetaData
    };
}

const checkStraight = (valueSet: any) => {
    if (valueSet.length < 5) return { isStraight: false, isLowStraight: false, concurrentCardValues: [], concurrentCardValuesLow: [] };
    let numConcurrentCards = 0;
    let concurrentCardValues: any[] = [];
    for (let i = 1; i < valueSet.length; i++) {
        if (numConcurrentCards === 5) {
            return {
                isStraight: true,
                isLowStraight: false,
                concurrentCardValues,
                concurrentCardValuesLow: []
            };
        }
        if ((valueSet[i] - valueSet[i - 1]) === -1) {
            if(numConcurrentCards === 0) {
                numConcurrentCards = 2;
                concurrentCardValues.push(valueSet[i - 1]);
                concurrentCardValues.push(valueSet[i]);
            } else { 
                numConcurrentCards++;
                concurrentCardValues.push(valueSet[i]);
            }
        } else {
            numConcurrentCards = 0;
            concurrentCardValues = []; 
        }
    }
    if (numConcurrentCards >= 5) {
        return {
            isStraight: true,
            isLowStraight: false,
            concurrentCardValues,
            concurrentCardValuesLow: []
        };
    } else {
        if (valueSet[0] === 13) {
            let { isLowStraight, concurrentCardValuesLow } = checkLowStraight(cloneDeep(valueSet));

            if (isLowStraight) return {
                isStraight: true,
                isLowStraight,
                concurrentCardValues, 
                concurrentCardValuesLow,
            };
        } 
        return { 
            isStraight: false,
            isLowStraight: false, 
            concurrentCardValues, 
            concurrentCardValuesLow: []
        }; 
    }
}

const checkLowStraight = (valueSetCopy: any) => {
    let numConcurrentCards = 0;
    let concurrentCardValuesLow: any[] = [];
    valueSetCopy[0] = 0;
    const sortedValueSetCopy = valueSetCopy.map((el: any) => el).sort((a: any,b: any) => a - b);
    for (let i = 1; i < 5; i++) {
        if (numConcurrentCards >= 5) {
            return {
                isLowStraight: true,
                concurrentCardValuesLow,
            };
        }
        if((sortedValueSetCopy[i] - sortedValueSetCopy[i - 1]) === 1 ) {
            if (numConcurrentCards === 0) {
                numConcurrentCards = 2;
                concurrentCardValuesLow.push(sortedValueSetCopy[i - 1]);
                concurrentCardValuesLow.push(sortedValueSetCopy[i]);
            } else { 
                numConcurrentCards++;
                concurrentCardValuesLow.push(sortedValueSetCopy[i]); 
            }    
        } else { 
            numConcurrentCards = 0;
            concurrentCardValuesLow = [];
        }
    }
    if (numConcurrentCards >= 5) {
        return {
            isLowStraight: true,
            concurrentCardValuesLow,
        };
    } else { 
        return {
            isLowStraight: false,
            concurrentCardValuesLow,
        }; 
    }
}

const buildValueSet = (hand: any) => {
    return Array.from(new Set(hand.map((cardInfo: any) => cardInfo.value)));
}

const dealMissingCommunityCards = (state: any) => {
    const cardsToPop = 5 - state.communityCards.length;
    if (cardsToPop >= 1) {
        let animationDelay = 0;
        const { mutableDeckCopy, chosenCards } = popShowdownCards(state.deck, cardsToPop);
            
        for (let card of chosenCards) {
            (card as any).animationDelay = animationDelay;
            animationDelay = animationDelay + 250;
            state.communityCards.push(card);
        }

        state.deck = mutableDeckCopy;
    }
    state.phase = 'showdown';
    return state;
}

export { generateDeckOfCards, shuffle, popCards, dealPrivateCards, dealFlop, dealTurn, dealRiver, showDown, dealMissingCommunityCards, analyzeHistogram, checkFlush, checkRoyalFlush, checkStraightFlush, checkStraight, buildValueSet };