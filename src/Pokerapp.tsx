// import "@babel/polyfill";

// import 'core-js/es6/map';
// import 'core-js/es6/set';

import React, { Component } from 'react';
import './App.css';

import Spinner from './Spinner'
import WinScreen from './WinScreen';

import Player from "./players/Player";
import ShowdownPlayer from "./players/ShowdownPlayer";
import Card from "./cards/Card";

import {
  generateDeckOfCards,
  shuffle,
  dealPrivateCards,
} from './utils/cards';

import {
  generateTable,
  beginNextRound,
  checkWin
} from './utils/players';

import {
  determineBlindIndices,
  anteUpBlinds,
  determineMinBet,
  handleBet,
  handleFold,
} from './utils/bet.js';

import {
  handleAI as handleAIUtil
} from './utils/ai.js';

import {
  renderShowdownMessages,
  renderActionButtonText,
  renderNetPlayerEarnings,
  renderActionMenu
} from './utils/ui';
import board from "./assets/board.png";
import { cloneDeep } from 'lodash';

interface PAppState {
  loading: boolean;
  winnerFound: any;
  players: any;
  numPlayersActive: any;
  numPlayersFolded: any;
  numPlayersAllIn: any;
  activePlayerIndex: any;
  dealerIndex: any;
  blindIndex: any;
  deck: any;
  communityCards: any[];
  pot: any;
  highBet: any;
  betInputValue: any;
  sidePots: any[];
  minBet: number;
  phase: string;
  playerHierarchy: any[];
  showDownMessages: any[];
  playActionMessages: any[];
  playerAnimationSwitchboard: any;
  clearCards?: boolean;
}

class PApp extends Component<any, PAppState> {
  state: PAppState = {
    loading: true,
    winnerFound: null,
    players: null,
    numPlayersActive: null,
    numPlayersFolded: null,
    numPlayersAllIn: null,
    activePlayerIndex: null,
    dealerIndex: null,
    blindIndex: null,
    deck: null,
    communityCards: [],
    pot: null,
    highBet: null,
    betInputValue: null,
    sidePots: [],
    minBet: 20,
    phase: 'loading',
    playerHierarchy: [],
    showDownMessages: [],
    playActionMessages: [],
    playerAnimationSwitchboard: {
      0: { isAnimating: false, content: null },
      1: { isAnimating: false, content: null },
      2: { isAnimating: false, content: null },
      3: { isAnimating: false, content: null },
      4: { isAnimating: false, content: null },
      5: { isAnimating: false, content: null }
    }
  }

  cardAnimationDelay = 0;

  loadTable = () => {
    // Empty method as in original
  }

  async componentDidMount() {
    const players = await generateTable() as any;
    const dealerIndex = Math.floor(Math.random() * Math.floor(players.length)) as any;
    const blindIndicies = determineBlindIndices(dealerIndex, players.length) as any;
    const playersBoughtIn = anteUpBlinds(players, blindIndicies, this.state.minBet) as any;

    const imageLoaderRequest = new XMLHttpRequest();

    imageLoaderRequest.addEventListener("load", (e: any) => {
      console.log(`${e.type}`);
      console.log(e);
      console.log("Image Loaded!");
      this.setState({
        loading: false,
      })
    });

    imageLoaderRequest.addEventListener("error", (e: any) => {
      console.log(`${e.type}`);
      console.log(e);
    });

    imageLoaderRequest.addEventListener("loadstart", (e: any) => {
      console.log(`${e.type}`);
      console.log(e);
    });

    imageLoaderRequest.addEventListener("loadend", (e: any) => {
      console.log(`${e.type}`);
      console.log(e);
    });

    imageLoaderRequest.addEventListener("abort", (e: any) => {
      console.log(`${e.type}`);
      console.log(e);
    });

    imageLoaderRequest.addEventListener("progress", (e: any) => {
      console.log(`${e.type}`);
      console.log(e);
    });

    imageLoaderRequest.open("GET", "./assets/table-nobg-svg-01.svg");
    imageLoaderRequest.send();

    this.setState(prevState => ({
      players: playersBoughtIn,
      numPlayersActive: players.length,
      numPlayersFolded: 0,
      numPlayersAllIn: 0,
      activePlayerIndex: dealerIndex,
      dealerIndex,
      blindIndex: {
        big: blindIndicies.bigBlindIndex,
        small: blindIndicies.smallBlindIndex,
      },
      deck: shuffle(generateDeckOfCards()) as any,
      pot: 0,
      highBet: prevState.minBet,
      betInputValue: prevState.minBet,
      phase: 'initialDeal',
    }), () => {
      this.runGameLoop();
    });
  }

  handleBetInputChange = (val: any, min: any, max: any) => {
    if (val === '') val = min;
    if (val > max) val = max;
    this.setState({
      betInputValue: parseInt(val, 10),
    });
  }

  changeSliderInput = (val: any) => {
    this.setState({
      betInputValue: val[0]
    })
  }

  pushAnimationState = (index: any, content: any) => {
    const newAnimationSwitchboard = Object.assign(
      {},
      this.state.playerAnimationSwitchboard,
      { [index]: { isAnimating: true, content } }
    ) as any;
    this.setState({ playerAnimationSwitchboard: newAnimationSwitchboard });
  }

  popAnimationState = (index: any) => {
    const persistContent = this.state.playerAnimationSwitchboard[index].content;
    const newAnimationSwitchboard = Object.assign(
      {},
      this.state.playerAnimationSwitchboard,
      { [index]: { isAnimating: false, content: persistContent } }
    ) as any;
    this.setState({ playerAnimationSwitchboard: newAnimationSwitchboard });
  }

  handleBetInputSubmit = (bet: any, min: any, max: any) => {
    const { playerAnimationSwitchboard, ...PState } = this.state as any;
    const { activePlayerIndex } = PState;
    this.pushAnimationState(activePlayerIndex, `${renderActionButtonText(this.state.highBet, this.state.betInputValue, this.state.players[this.state.activePlayerIndex])} ${(bet > this.state.players[this.state.activePlayerIndex].bet) ? (bet) : ""}`);
    const newState = handleBet(cloneDeep(PState), parseInt(bet, 10), parseInt(min, 10), parseInt(max, 10)) as any;
    this.setState(newState, () => {
      if ((this.state.players[this.state.activePlayerIndex].robot) && (this.state.phase !== 'showdown')) {
        setTimeout(() => {
          this.handleAI();
        }, 1200);
      }
    });
  }

  handleFold = () => {
    const { playerAnimationSwitchboard, ...appState } = this.state as any;
    const newState = handleFold(cloneDeep(appState)) as any;
    this.setState(newState, () => {
      if ((this.state.players[this.state.activePlayerIndex].robot) && (this.state.phase !== 'showdown')) {
        setTimeout(() => {
          this.handleAI();
        }, 1200);
      }
    });
  }

  handleAI = () => {
    const { playerAnimationSwitchboard, ...appState } = this.state as any;
    const newState = handleAIUtil(cloneDeep(appState), this.pushAnimationState) as any;

    this.setState({
      ...newState,
      betInputValue: newState.minBet
    }, () => {
      if ((this.state.players[this.state.activePlayerIndex].robot) && (this.state.phase !== 'showdown')) {
        setTimeout(() => {
          this.handleAI();
        }, 1200);
      }
    });
  }

  renderBoard = () => {
    const {
      players,
      activePlayerIndex,
      dealerIndex,
      clearCards,
      phase,
      playerAnimationSwitchboard
    } = this.state;
    const reversedPlayers = players.reduce((result: any[], player: any, index: any) => {
      const isActive = (index === activePlayerIndex);
      const hasDealerChip = (index === dealerIndex);

      result.unshift(
        <Player
          key={index}
          arrayIndex={index}
          isActive={isActive}
          hasDealerChip={hasDealerChip}
          player={player}
          clearCards={clearCards}
          phase={phase}
          playerAnimationSwitchboard={playerAnimationSwitchboard}
          endTransition={this.popAnimationState}
        />
      );
      return result;
    }, []);
    return reversedPlayers.map((component: any) => component);
  }

  renderCommunityCards = (purgeAnimation?: any) => {
    return this.state.communityCards.map((card: any, index: any) => {
      let cardData = { ...card };
      if (purgeAnimation) {
        cardData.animationDelay = 0;
      }
      return (
        <Card key={index} cardData={cardData} />
      );
    });
  }

  runGameLoop = () => {
    const newState = dealPrivateCards(cloneDeep(this.state)) as any;
    this.setState(newState, () => {
      if ((this.state.players[this.state.activePlayerIndex].robot) && (this.state.phase !== 'showdown')) {
        setTimeout(() => {
          this.handleAI();
        }, 1200);
      }
    });
  }

  renderRankTie = (rankSnapshot: any) => {
    return rankSnapshot.map((player: any) => {
      return this.renderRankWinner(player);
    });
  }

  renderRankWinner = (player: any) => {
    const { name, bestHand, handRank } = player;
    const playerStateData = this.state.players.find((statePlayer: any) => statePlayer.name === name);
    return (
      <div className="showdown-player--entity" key={name}>
        <ShowdownPlayer
          name={name}
          avatarURL={playerStateData.avatarURL}
          cards={playerStateData.cards}
          roundEndChips={playerStateData.roundEndChips}
          roundStartChips={playerStateData.roundStartChips}
        />
        <div className="showdown-player--besthand--container">
          <h5 className="showdown-player--besthand--heading">
            Best Hand
          </h5>
          <div className='showdown-player--besthand--cards' style={{ alignItems: 'center' }}>
            {
              bestHand.map((card: any, index: any) => {
                const cardData = { ...card, animationDelay: 0 };
                return <Card key={index} cardData={cardData} />;
              })
            }
          </div>
        </div>
        <div className="showdown--handrank">
          {handRank}
        </div>
        {renderNetPlayerEarnings(playerStateData.roundEndChips, playerStateData.roundStartChips)}
      </div>
    );
  }

  renderBestHands = () => {
    const { playerHierarchy } = this.state;

    return playerHierarchy.map((rankSnapshot: any) => {
      const tie = Array.isArray(rankSnapshot);
      return tie ? this.renderRankTie(rankSnapshot) : this.renderRankWinner(rankSnapshot);
    });
  }

  handleNextRound = () => {
    this.setState({ clearCards: true });
    const newState = beginNextRound(cloneDeep(this.state)) as any;
    if (checkWin(newState.players)) {
      this.setState({ winnerFound: true });
      return;
    }
    this.setState(newState, () => {
      if ((this.state.players[this.state.activePlayerIndex].robot) && (this.state.phase !== 'showdown')) {
        setTimeout(() => this.handleAI(), 1200);
      }
    });
  }

  renderActionButtons = () => {
    const { highBet, players, activePlayerIndex, phase, betInputValue } = this.state;
    const min = determineMinBet(highBet, players[activePlayerIndex].chips, players[activePlayerIndex].bet) as any;
    const max = players[activePlayerIndex].chips + players[activePlayerIndex].bet;
    return ((players[activePlayerIndex].robot) || (phase === 'showdown')) ? null : (
      <React.Fragment>
        <button className="bg-primary-blue-300 p-3 mr-5 rounded-md shadow-lg flex-1 justify-center flex gap-2 items-center" onClick={() => this.handleBetInputSubmit(betInputValue, min, max)}>
          {renderActionButtonText(highBet, betInputValue, players[activePlayerIndex])}
        </button>
        <button className="bg-primary-blue-300 p-3 rounded-md shadow-lg flex-1 justify-center flex gap-2 items-center" onClick={() => this.handleFold()}>
          Fold
        </button>
      </React.Fragment>
    );
  }

  renderShowdown = () => {
    return (
      <div className='showdown-container--wrapper'>
        <h5 className="showdown-container--title">
          Round Complete!
        </h5>
        <div className="showdown-container--messages">
          {renderShowdownMessages(this.state.showDownMessages)}
        </div>
        <h5 className="showdown-container--community-card-label">
          Community Cards
        </h5>
        <div className='showdown-container--community-cards'>
          {this.renderCommunityCards(true)}
        </div>
        <button className="showdown--nextRound--button" onClick={() => this.handleNextRound()}> Next Round </button>
        {this.renderBestHands()}
      </div>
    );
  }

  renderGame = () => {
    const { highBet, players, activePlayerIndex, phase } = this.state;
    return (
      <div className='poker-app--background'>
        <div className="poker-table--container">
          <img className="poker-table--table-image" src={board} alt="Poker Table" />
          {this.renderBoard()}
          <div className='community-card-container' >
            {this.renderCommunityCards() as any}
          </div>
          <div className='pot-container'>
            <img style={{ height: 55, width: 55 }} src={'./assets/pot.svg'} alt="Pot Value" />
            <h4> {`${this.state.pot}`} </h4>
          </div>
        </div>
        {(this.state.phase === 'showdown') && this.renderShowdown()}
        <div className='game-action-bar' >
          <div className='action-buttons'>
            {this.renderActionButtons()}
          </div>
          <div className='slider-boi'>
            {(!this.state.loading) && renderActionMenu(highBet, players, activePlayerIndex, phase as any, this.handleBetInputChange as any)}
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <div className='poker-table--wrapper'>
          {
            (this.state.loading) ? <Spinner /> :
              (this.state.winnerFound) ? <WinScreen /> :
                this.renderGame()
          }
        </div>
      </div>
    );
  }
}

export default PApp;