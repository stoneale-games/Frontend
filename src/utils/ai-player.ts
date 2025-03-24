// src/utils/ai-player.ts
import { CardType, PlayerType, GameState } from '../contexts/GameContext';
import { assessHand } from './poker-utils';

// AI difficulty levels
export enum AIDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

// AI decision making logic
export const makeAIDecision = (
  gameState: GameState, 
  player: PlayerType, 
  difficulty: AIDifficulty = AIDifficulty.MEDIUM
): { action: string; amount?: number } => {
  const { communityCards, currentBet, pot, minRaise, players } = gameState;
  
  // Assess AI hand strength (0-10 scale)
  const handStrength = getHandStrength(player.cards, communityCards);
  
  // Get amount needed to call
  const amountToCall = currentBet - player.currentBet;
  
  // Basic probabilities based on difficulty and hand strength
  let foldProb = 0;
  let checkCallProb = 0;
  let raiseProb = 0;
  
  // Adjust probabilities based on difficulty
  switch (difficulty) {
    case AIDifficulty.EASY:
      // Easy AI is more likely to call and less strategic
      foldProb = Math.max(0, 0.6 - handStrength * 0.1);
      raiseProb = Math.min(0.3, handStrength * 0.05);
      checkCallProb = 1 - foldProb - raiseProb;
      break;
      
    case AIDifficulty.MEDIUM:
      // Medium AI is more balanced
      foldProb = Math.max(0, 0.5 - handStrength * 0.08);
      raiseProb = Math.min(0.5, handStrength * 0.08);
      checkCallProb = 1 - foldProb - raiseProb;
      break;
      
    case AIDifficulty.HARD:
      // Hard AI is more aggressive and strategic
      foldProb = Math.max(0, 0.4 - handStrength * 0.07);
      raiseProb = Math.min(0.7, handStrength * 0.1);
      checkCallProb = 1 - foldProb - raiseProb;
      
      // Hard AI considers pot odds
      if (amountToCall > 0) {
        const potOdds = amountToCall / (pot + amountToCall);
        // If pot odds are bad, increase fold probability
        if (potOdds > handStrength / 10) {
          foldProb += 0.2;
          checkCallProb -= 0.2;
        }
      }
      break;
  }
  
  // Slightly randomize for unpredictability
  foldProb += (Math.random() * 0.1) - 0.05;
  raiseProb += (Math.random() * 0.1) - 0.05;
  
  // Re-normalize probabilities
  const total = foldProb + checkCallProb + raiseProb;
  foldProb /= total;
  checkCallProb /= total;
  raiseProb /= total;
  
  // Special case: If player can check, never fold
  if (amountToCall === 0) {
    foldProb = 0;
    checkCallProb += raiseProb / 2;
    raiseProb = raiseProb / 2;
  }
  
  // Special case: If player doesn't have enough chips to call
  if (amountToCall >= player.chips) {
    // Either all-in or fold
    return Math.random() < foldProb ? { action: 'fold' } : { action: 'call' };
  }
  
  // Make decision based on probabilities
  const rand = Math.random();
  
  if (rand < foldProb) {
    return { action: 'fold' };
  } else if (rand < foldProb + checkCallProb) {
    // Check if possible, otherwise call
    return amountToCall === 0 ? { action: 'check' } : { action: 'call' };
  } else {
    // Raise
    // Determine raise amount based on hand strength and pot size
    let raiseAmount = minRaise;
    
    // For stronger hands, raise more
    if (handStrength > 7) {
      raiseAmount = Math.min(player.chips, currentBet * 3); // Big raise
    } else if (handStrength > 5) {
      raiseAmount = Math.min(player.chips, currentBet * 2); // Medium raise
    } else {
      raiseAmount = Math.min(player.chips, currentBet + minRaise); // Minimum raise
    }
    
    // Occasionally go all-in with very strong hands
    if (handStrength > 8 && Math.random() < 0.3) {
      raiseAmount = player.chips;
    }
    
    return { action: 'raise', amount: raiseAmount };
  }
};

// Get hand strength on a scale of 0-10
const getHandStrength = (holeCards: CardType[], communityCards: CardType[]): number => {
  if (!holeCards || holeCards.length < 2) return 0;
  
  // Preflop hand strength
  if (!communityCards || communityCards.length === 0) {
    return getPreflopHandStrength(holeCards);
  }
  
  // Evaluate hand with community cards
  const allCards = [...holeCards, ...communityCards];
  const { rank } = assessHand(allCards);
  
  // Map hand ranks to strength values
  switch (rank) {
    case 'Royal Flush': return 10;
    case 'Straight Flush': return 9.5;
    case 'Four of a Kind': return 9;
    case 'Full House': return 8;
    case 'Flush': return 7;
    case 'Straight': return 6;
    case 'Three of a Kind': return 5;
    case 'Two Pair': return 4;
    case 'Pair': return 3;
    default: return 2; // High card
  }
};

// Evaluate preflop hand strength
const getPreflopHandStrength = (holeCards: CardType[]): number => {
  const [card1, card2] = holeCards;
  
  // Check for pocket pair
  if (card1.value === card2.value) {
    // Higher pocket pairs are stronger
    return 4 + (card1.value / 14) * 4; // Scales from 4 to 8
  }
  
  // Check for suited cards
  const suited = card1.suit === card2.suit;
  
  // Calculate card ranks properly (Ace is high)
  const value1 = card1.value === 1 ? 14 : card1.value;
  const value2 = card2.value === 1 ? 14 : card2.value;
  
  const highCard = Math.max(value1, value2);
  const lowCard = Math.min(value1, value2);
  
  // Check for connectors (cards in sequence)
  const isConnector = Math.abs(value1 - value2) <= 2;
  
  // Base strength on card values and properties
  let strength = (highCard / 14) * 2; // 0-2 based on high card
  
  // Add bonuses
  if (suited) strength += 1.5;
  if (isConnector) strength += 1;
  
  // Broadway cards (TJQKA) are stronger
  if (lowCard >= 10) strength += 1;
  
  // Specific strong hands
  if ((value1 === 14 && value2 === 13) || (value1 === 13 && value2 === 14)) {
    strength = 7; // AK
  } else if ((value1 === 14 && value2 === 12) || (value1 === 12 && value2 === 14)) {
    strength = 6.5; // AQ   
  } else if ((value1 === 14 && value2 === 11) || (value1 === 11 && value2 === 14)) {
    strength = 6; // AJ
  } else if ((value1 === 14 && value2 === 10) || (value1 === 10 && value2 === 14)) {
    strength = 5.5; // AT
  }
  
  return Math.min(10, strength); // Cap at 10
};