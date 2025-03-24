import { Card } from "./types";


type HandRanking = {
    rank: string;
    value: number[];
};

export function assessHand(cards: Card[]): HandRanking {

    // 1. Sort the cards
    const sortedCards = [...cards].sort((a, b) => a.value - b.value);

    // 2. Extract values and suits
    const values = sortedCards.map(card => card.value);
    const suits = sortedCards.map(card => card.suit);

    // 3. Check for Flush
    const isFlush = suits.every(suit => suit === suits[0]);

    // 4. Check for Straight
    const isStraight = isContinuous(values);

    // 5. Count duplicate values
    const valueCounts: { [key: number]: number } = {};
    for (const value of values) {
        valueCounts[value] = (valueCounts[value] || 0) + 1;
    }

    const counts = Object.values(valueCounts).sort((a, b) => b - a);  // Sort in descending order
    const maxCount = counts[0];
    const secondCount = counts[1] || 0;

    // 6. Determine Hand Rank

    let rankName = "High Card";
    let rankValue: number[] = [...values].sort((a, b) => b - a);

    if (isFlush && isStraight) {
        rankName = "Straight Flush";
        rankValue = [9];
    } else if (maxCount === 4) {
        rankName = "Four of a Kind";
        rankValue = [8, Object.keys(valueCounts).find(key => valueCounts[key] === 4) as number, Object.keys(valueCounts).find(key => valueCounts[key] === 1) as number];
    } else if (maxCount === 3 && secondCount === 2) {
        rankName = "Full House";
         rankValue = [7,Object.keys(valueCounts).find(key => valueCounts[key] === 3) as number, Object.keys(valueCounts).find(key => valueCounts[key] === 2) as number];
    } else if (isFlush) {
        rankName = "Flush";
        rankValue = [6, ...rankValue];

    } else if (isStraight) {
        rankName = "Straight";
        rankValue = [5, ...rankValue];

    } else if (maxCount === 3) {
        rankName = "Three of a Kind";
        rankValue = [4, Object.keys(valueCounts).find(key => valueCounts[key] === 3) as number, ...rankValue];
    } else if (maxCount === 2 && secondCount === 2) {
        rankName = "Two Pair";
        rankValue = [3, ...Object.keys(valueCounts).filter(key => valueCounts[key] === 2).map(Number).sort((a,b) => b - a), Object.keys(valueCounts).find(key => valueCounts[key] === 1) as number];
    } else if (maxCount === 2) {
        rankName = "Pair";
        rankValue = [2, Object.keys(valueCounts).find(key => valueCounts[key] === 2) as number, ...rankValue];

    } else {
        rankName = "High Card";
        rankValue = [1, ...rankValue];
    }

    return { rank: rankName, value: rankValue };
}

function isContinuous(arr: number[]): boolean {
    if (arr.length < 2) return true;  // Special case for empty or single card arrays
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== arr[i - 1] + 1) {
            return false;
        }
    }
    return true;
}