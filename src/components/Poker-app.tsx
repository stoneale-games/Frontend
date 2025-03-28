import React, { useState, useEffect } from 'react';
import "../App.css"
import { 
  generateDeckOfCards, 
  shuffle, 
  dealPrivateCards,
} from '../utils/cards';

import { 
  generateTable, 
  beginNextRound,
  checkWin
} from '../utils/players';

import { 
  determineBlindIndices, 
  anteUpBlinds, 
  determineMinBet,
  handleBet,

} from '../utils/bet';
import board from "../assets/board.png";
import {
  handleAI as handleAIUtil
} from '../utils/ai';

import {
  renderShowdownMessages,
  renderActionButtonText,
  renderNetPlayerEarnings,
  renderActionMenu
} from '../utils/ui';

import { cloneDeep } from 'lodash';
import { GameState } from '../utils/types';
import Player from './Player';
import Card from './cards/Card';
import ShowdownPlayer from './ShowdownPlayer';



interface PlayerState {
  name: string;
  robot: boolean;
  folded: boolean;
  cards: any[];
  avatarURL: string;
  chips: number;
  bet: number;
  roundEndChips?: number;
  roundStartChips?: number;
  bestHand?: any[];
  handRank?: string;
}


const PokerApp: React.FC = () => {
  const [state, setState] = useState<GameState>({
    loading: true,
    winnerFound: null,
    players: [], // Initialize as empty array instead of null
    numPlayersActive: 0,
    numPlayersFolded: 0,
    numPlayersAllIn: 0,
    activePlayerIndex: 0,
    dealerIndex: 0,
    blindIndex: { big: 0, small: 0 },
    deck: [],
    communityCards: [],
    pot: 0,
    highBet: 0,
    betInputValue: 0,
    sidePots: [],
    minBet: 20,
    phase: 'loading',
    playerHierarchy: [],
    showDownMessages: [],
    playActionMessages: [],
    playerAnimationSwitchboard: {
      0: {isAnimating: false, content: null},
      1: {isAnimating: false, content: null},
      2: {isAnimating: false, content: null},
      3: {isAnimating: false, content: null},
      4: {isAnimating: false, content: null},
      5: {isAnimating: false, content: null}
    }
  });

//   const cardAnimationDelay = 0;
  
//   const loadTable = () => {
//     // Implementation if needed
//   }

useEffect(() => {
    const initializeGame = async () => {
      try {
        const players = await generateTable();
        const dealerIndex = Math.floor(Math.random() * Math.floor(players.length));
        const blindIndicies = determineBlindIndices(dealerIndex, players.length);
        const playersBoughtIn = anteUpBlinds(players, blindIndicies, state.minBet);
  
        // Convert card values to strings to match CardData interface
        const cards = shuffle(generateDeckOfCards());
        const typedCards = cards.map(card => ({
          ...card,
          value: card.value.toString()
        }));
        
        setState(prev => ({
          ...prev,
          loading: false,
          players: playersBoughtIn,
          numPlayersActive: players.length,
          activePlayerIndex: dealerIndex,
          dealerIndex,
          blindIndex: {
            big: blindIndicies.bigBlindIndex,
            small: blindIndicies.smallBlindIndex,
          },
          deck: typedCards as any,
          highBet: prev.minBet,
          betInputValue: prev.minBet,
          phase: 'initialDeal',
        }));
  
        runGameLoop();
      } catch (error) {
        console.error("Error initializing game:", error);
        // Handle error state if needed
      }
    };
  
    initializeGame();
  }, []);
//   const handleBetInputChange = (val: string | number, min: number, max: number) => {
//     if (val === '') val = min;
//     if (Number(val) > max) val = max;
//     setState(prev => ({
//       ...prev,
//       betInputValue: parseInt(val.toString(), 10),
//     }));
//   };
  
  const changeSliderInput = (val: number[]) => {
    setState(prev => ({
      ...prev,
      betInputValue: val[0]
    }));
  };

  const pushAnimationState = (index: number, content: string) => {
    setState(prev => ({
      ...prev,
      playerAnimationSwitchboard: {
        ...prev.playerAnimationSwitchboard,
        [index]: {isAnimating: true, content}     
      }
    }));
  };

  const popAnimationState = (index: number) => {
    const persistContent = state.playerAnimationSwitchboard?.[index]?.content || null;
    setState(prev => ({
      ...prev,
      playerAnimationSwitchboard: {
        ...prev.playerAnimationSwitchboard,
        [index]: {isAnimating: false, content: persistContent}     
      }
    }));
  };

  const handleBetInputSubmit = (bet: number, min: number, max: number) => {
    const {playerAnimationSwitchboard, ...appState} = state;
    const { activePlayerIndex } = appState;
    
    if (activePlayerIndex === null || !state.players) return;

    pushAnimationState(
        activePlayerIndex, 
        `${renderActionButtonText(state.highBet, state.betInputValue, state.players[activePlayerIndex])} ${(bet > state.players[activePlayerIndex].bet) ? (bet) : ""}`
      );
    
      // Now cloneDeep will accept appState because it matches GameState
      const newState = handleBet(appState, bet, min, max);
      setState(newState);
    
    if ((state.players[activePlayerIndex].robot) && (state.phase !== 'showdown')) {
      setTimeout(() => {
        handleAI();
      }, 1200);
    }
  };

  const handleFold = () => {

    const newState = handleFold();
    setState(newState as any);

    if ((state.players?.[state.activePlayerIndex || 0]?.robot) && (state.phase !== 'showdown')) {
      setTimeout(() => {
        handleAI();
      }, 1200);
    }
  };

  const handleAI = () => {
    const {playerAnimationSwitchboard, ...appState} = state;
    const newState = handleAIUtil(cloneDeep(appState), pushAnimationState);

    setState({
      ...newState,
      betInputValue: newState.minBet
    });

    if ((state.players?.[state.activePlayerIndex || 0]?.robot) && (state.phase !== 'showdown')) {
      setTimeout(() => {
        handleAI();
      }, 1200);
    }
  };

  const renderBoard = () => {
    if (!state.players || state.activePlayerIndex === null || state.dealerIndex === null) return null;

    return state.players.reduce((result: React.ReactNode[], player, index) => {
      const isActive = (index === state.activePlayerIndex);
      const hasDealerChip = (index === state.dealerIndex);

      result.unshift(
        <Player
          key={index}
          arrayIndex={index}
          isActive={isActive}
          hasDealerChip={hasDealerChip}
          player={player}
          clearCards={state.clearCards}
          phase={state.phase}
          playerAnimationSwitchboard={state.playerAnimationSwitchboard as any}      
          endTransition={popAnimationState}
        />
      );
      return result;
    }, []);
  };

  const renderCommunityCards = (purgeAnimation = false) => {
    return state.communityCards.map((card, index) => {
      let cardData = {...card};
      if (purgeAnimation) {
        cardData.animationDelay = 0;
      }
      return <Card key={index} cardData={cardData}/>;
    });
  };

  const runGameLoop = () => {
    const newState = dealPrivateCards(cloneDeep(state));
    setState(newState);

    if ((state.players?.[state.activePlayerIndex || 0]?.robot) && (state.phase !== 'showdown')) {
      setTimeout(() => {
        handleAI();
      }, 1200);
    }
  };

  const renderRankWinner = (player: PlayerState) => {
    const playerStateData = state.players?.find(statePlayer => statePlayer.name === player.name);
    if (!playerStateData || !player.bestHand || !player.handRank) return null;

    return (
      <div className="showdown-player--entity" key={player.name}>
        <ShowdownPlayer
          name={player.name}
          avatarURL={playerStateData.avatarURL}
          cards={playerStateData.cards}
          roundEndChips={playerStateData.roundEndChips || 0}
          roundStartChips={playerStateData.roundStartChips || 0}
        />
        <div className="showdown-player--besthand--container">
          <h5 className="showdown-player--besthand--heading">
            Best Hand
          </h5>
          <div className='showdown-player--besthand--cards' style={{alignItems: 'center'}}>
            {player.bestHand.map((card, index) => {
              const cardData = {...card, animationDelay: 0};
              return <Card key={index} cardData={cardData}/>;
            })}
          </div>
        </div>
        <div className="showdown--handrank">
          {player.handRank}
        </div>
        {renderNetPlayerEarnings(playerStateData.roundEndChips || 0, playerStateData.roundStartChips || 0)}
      </div>
    );
  };

  const renderRankTie = (rankSnapshot: PlayerState[]) => {
    return rankSnapshot.map(player => renderRankWinner(player));
  };

  const renderBestHands = () => {
    if (!state.playerHierarchy) return null;

    return state.playerHierarchy.map((rankSnapshot) => {
      const tie = Array.isArray(rankSnapshot);
      return tie ? renderRankTie(rankSnapshot) : renderRankWinner(rankSnapshot);
    });
  };

  const handleNextRound = () => {
    setState(prev => ({...prev, clearCards: true}));
    const newState = beginNextRound(cloneDeep(state));
    
    if (checkWin(newState.players)) {
      setState(prev => ({...prev, winnerFound: true}));
      return;
    }

    setState(newState);

    if ((newState.players?.[newState.activePlayerIndex || 0]?.robot) && (newState.phase !== 'showdown')) {
      setTimeout(() => handleAI(), 1200);
    }
  };

  const renderActionButtons = () => {
    if (!state.players || state.activePlayerIndex === null || state.highBet === null || state.betInputValue === null) {
      return null;
    }

    const min = determineMinBet(state.highBet, state.players[state.activePlayerIndex].chips, state.players[state.activePlayerIndex].bet);
    const max = state.players[state.activePlayerIndex].chips + state.players[state.activePlayerIndex].bet;

    return ((state.players[state.activePlayerIndex].robot) || (state.phase === 'showdown')) ? null : (
      <>
        <button className='action-button' onClick={() => handleBetInputSubmit(state.betInputValue || 0, min, max)}>
          {renderActionButtonText(state.highBet, state.betInputValue, state.players[state.activePlayerIndex])}
        </button>
        <button className='fold-button' onClick={() => handleFold()}>
          Fold
        </button>
      </>
    );
  };

  const renderShowdown = () => {
    return (
      <div className='showdown-container--wrapper'>
        <h5 className="showdown-container--title">
          Round Complete!
        </h5>
        <div className="showdown-container--messages">
          {renderShowdownMessages(state.showDownMessages)}
        </div>
        <h5 className="showdown-container--community-card-label">
          Community Cards
        </h5>
        <div className='showdown-container--community-cards'>
          {renderCommunityCards(true)}
        </div>
        <button className="showdown--nextRound--button" onClick={() => handleNextRound()}>Next Round</button>
        {renderBestHands()}
      </div>
    );
  };

  const renderGame = () => {
    if (!state.players || state.activePlayerIndex === null || state.highBet === null) {
      return null;
    }

    return (
      <div className='poker-app--background'>
        <div className="poker-table--container">
          <img className="poker-table--table-image" src={board} alt="Poker Table" />
          {renderBoard()}
          <div className='community-card-container'>
            {renderCommunityCards()}
          </div>
          <div className='pot-container'>
            <img style={{height: 55, width: 55}} src={'./assets/pot.svg'} alt="Pot Value"/>
            <h4>{`${state.pot}`}</h4>
          </div>
        </div>
        {(state.phase === 'showdown') && renderShowdown()}
        <div className='game-action-bar'>
          <div className='action-buttons'>
            {renderActionButtons()}
          </div>
          <div className='slider-boi'>
            {(!state.loading) && renderActionMenu(
              state.highBet, 
              state.players, 
              state.activePlayerIndex, 
              state.phase as any, 
              changeSliderInput
            )}
          </div>
        </div>
      </div>
    );
  };

  return (

      <div className='poker-table--wrapper'> 
        {(state.loading) ? <h1>loading</h1> : 
         (state.winnerFound) ? <h1>winder</h1> : 
         renderGame()}
      </div>
    
  );
};

export default PokerApp;