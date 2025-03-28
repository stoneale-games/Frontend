import React from 'react';
import Card from './cards/Card';
import { Card as CardData} from '../utils/types';



interface ShowdownPlayerProps {
  name: string;
  avatarURL: string;
  cards: CardData[];
  roundEndChips?: number;
  roundStartChips?: number;
}

const ShowdownPlayer: React.FC<ShowdownPlayerProps> = ({
  name,
  avatarURL,
  cards
}) => {
  const renderCards = (cards: CardData[]) => {
    return cards.map((card, index) => {
      const cardData = {...card, animationDelay: 0};
      return <Card key={index} cardData={cardData} />;
    });
  };

  return (
    <div className="player-entity--container">
      <div className="player-avatar--container">
        <img 
          className="player-avatar--image" 
          src={avatarURL}  
          alt="Player Avatar"
        />
        <h5 className="player-info--name">
          {name}
        </h5>
      </div>
      <div className="showdownPlayer--privateCards">
        <h5 className="showdownPlayer--cards--heading">
          Private Cards
        </h5>
        <div className="showdownPlayer--cards">
          {renderCards(cards)}
        </div>    
      </div>
    </div>
  );
};

export default ShowdownPlayer;