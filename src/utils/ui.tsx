import React from 'react';
import { determineMinBet } from './bet';

type Phase = 
  | 'loading'
  | 'initialDeal'
  | 'betting1'
  | 'flop'
  | 'betting2'
  | 'turn'
  | 'betting3'
  | 'river'
  | 'betting4'
  | 'showdown';

type Suit = 'Heart' | 'Diamond' | 'Spade' | 'Club';

interface Player {
  chips: number;
  bet: number;
  robot: boolean;
  name: string;
}

interface ShowDownMessage {
  users: string[];
  prize: number;
  rank: string;
}

const renderPhaseStatement = (phase: Phase): string => {
  switch(phase) {
    case('loading'): return 'Finding a Table, Please Wait';
    case('initialDeal'): return 'Dealing out the cards';
    case('betting1'): return 'Betting 1';
    case('flop'): return 'Flop';
    case('betting2'): return 'Flop';
    case('turn'): return 'Turn';
    case('betting3'): return 'Turn';
    case('river'): return 'River';
    case('betting4'): return 'River';
    case('showdown'): return 'Show Your Cards!';
    default: throw new Error('Unfamiliar phase returned from renderPhaseStatement()');
  }
}

const renderUnicodeSuitSymbol = (suit: Suit): string => {
  switch(suit) {
    case('Heart'): return '\u2665';
    case('Diamond'): return '\u2666';
    case('Spade'): return '\u2660';
    case('Club'): return '\u2663';
    default: throw new Error('Unfamiliar String Recieved in Suit Unicode Generation');
  }
}

const renderActionButtonText = (highBet: number, betInputValue: number, activePlayer: Player): string => {
  if ((highBet === 0) && (betInputValue === 0)) {
    return 'Check';
  } else if ((highBet === betInputValue)) {
    return 'Call';
  } else if ((highBet === 0) && (betInputValue > highBet)) {
    return 'Bet';
  } else if ((betInputValue < highBet) || (betInputValue === activePlayer.chips + activePlayer.bet)) {
    return 'All-In!';
  } else if (betInputValue > highBet) {
    return 'Raise';
  }
  return ''; // Fallback return
}

const renderNetPlayerEarnings = (endChips: number, startChips: number): JSX.Element => {
  const netChipEarnings = (endChips - startChips);
  const win = (netChipEarnings > 0);
  const none = (netChipEarnings === 0);	
  return(
    <div className={`showdownPlayer--earnings ${(win) ? ('positive') : (none) ? ('') : ('negative')}`}>
      {`${(win) ? ('+') : ('')}${netChipEarnings}`}
    </div>  
  );
}

const renderShowdownMessages = (showDownMessages?: ShowDownMessage[]): JSX.Element[] => {
    if (!showDownMessages) {
      return [];
    }
  return showDownMessages.map((message, index) => {
    const { users, prize, rank } = message;
    if (users.length > 1) {
      return (
        <React.Fragment key={index}>
          <div className="message--container">
            <span className="message--user">
              {`${users.length} players `}
            </span>
            <span className="message--content">
              {`split the pot with a `}
            </span>
            <span className="message--rank">
              {`${rank}!`}
            </span>
          </div>
          { 
            users.map(user => {
              return(
                <div key={`${index}-${user}`} className="message--container">
                  <span className="message--player">
                    {`${user} `}
                  </span>
                  <span className="message--content">
                    {`takes `}
                  </span>
                  <span className="message--earnings">
                    {`${prize} chips `}
                  </span>
                  <span className="message--content">
                    {`from the pot.`}
                  </span>
                </div>
              );
            })
          }
        </React.Fragment>
      );
    } else if (users.length === 1) {
      return(
        <div key={index} className="message--container">
          <span className="message--player">
            {`${users[0]} `}
          </span>
          <span className="message--content">
            {`wins `}
          </span>
          <span className="message--earnings">
            {`${prize} chips `}
          </span>
          <span className="message--content">
            {`from the pot with a `}
          </span>
          <span className="message--rank">
            {`${rank}!`}
          </span>
        </div>
      );
    }
    return <></>; // Fallback return
  });
}

const renderActionMenu = (
  highBet: number,
  players: Player[],
  activePlayerIndex: number,
  phase: Phase,
  changeSliderInputFn: (values: number[]) => void
): JSX.Element | null => {
  const min = determineMinBet(highBet, players[activePlayerIndex].chips, players[activePlayerIndex].bet);
  const max = players[activePlayerIndex].chips + players[activePlayerIndex].bet;
  
  if (phase === 'betting1' || phase === 'betting2' || phase === 'betting3' || phase === 'betting4') {
    return players[activePlayerIndex].robot ? (
      <h4> {`Current Move: ${players[activePlayerIndex].name}`}</h4>
    ) : (
    <React.Fragment>
        <input
            type="range"
            min={min}
            max={max}
            defaultValue={min}
            step={1}
            onChange={(e) => changeSliderInputFn([parseInt(e.target.value)])}
            className="bet-slider"
            style={{width: '100%'}}
        />
    </React.Fragment>
    );
  }
  return null;
}

export { 
  renderPhaseStatement, 
  renderUnicodeSuitSymbol, 
  renderShowdownMessages,
  renderNetPlayerEarnings,
  renderActionMenu,
  renderActionButtonText 
};