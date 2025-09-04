// src/lib/api.ts (add this)
import { gql } from 'urql';
import { urqlClient } from './urqlClient';
import { pipe, subscribe } from 'wonka';

const GAME_UPDATES = gql`
  subscription GameUpdates($gameId: ID!) {
    gameUpdates(gameId: $gameId) {
      id
      players { id userId chips status }
      communityCards { suit rank }
      pot
      phase
      turnIndex
      isActive
      lastAction
    }
  }
`;

export function subscribeToGameUpdates(gameId: string, callback: (data: any) => void) {
    const { unsubscribe } = pipe(
        urqlClient.subscription(GAME_UPDATES, { gameId }),
        subscribe((result) => {
            if (result.data) {
                callback(result.data.gameUpdates);
            }
        })
    );

    return unsubscribe; // Call this to stop listening
}
