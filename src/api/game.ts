import { gql } from 'urql';
import { urqlClient } from '@/lib/urqlClient';


// ---------------- GAME ----------------

const CREATE_GAME = gql`
  mutation CreateGame($smallBlind: Int!, $bigBlind: Int!) {
    createGame(smallBlind: $smallBlind, bigBlind: $bigBlind) {
      id
      players { id chips }
      pot
      phase
    }
  }
`;

export async function createGame(smallBlind: number, bigBlind: number) {
    const result = await urqlClient
        .mutation(CREATE_GAME, { smallBlind, bigBlind })
        .toPromise();

    if (!result.data) throw new Error("No data returned from createGame");

    return result.data.createGame;
}

const JOIN_GAME = gql`
  mutation JoinGame($gameId: ID!, $userId: ID!, $chips: Int!) {
    joinGame(gameId: $gameId, userId: $userId, chips: $chips) {
      id
      players { id userId chips }
    }
  }
`;

export async function joinGame(gameId: string, userId: string, chips: number) {
    const result = await urqlClient
        .mutation(JOIN_GAME, { gameId, userId, chips })
        .toPromise();

    if (!result.data) throw new Error("No data returned from joinGame");

    return result.data.joinGame;
}

const LEAVE_GAME = gql`
  mutation LeaveGame($gameId: ID!, $userId: ID!) {
    leaveGame(gameId: $gameId, userId: $userId)
  }
`;

export async function leaveGame(gameId: string, userId: string) {
    const result = await urqlClient
        .mutation(LEAVE_GAME, { gameId, userId })
        .toPromise();

    return result.data.leaveGame;
}

const START_GAME = gql`
  mutation StartGame($gameId: ID!) {
    startGame(gameId: $gameId) {
      id
      phase
      pot
    }
  }
`;

export async function startGame(gameId: string) {
    const result = await urqlClient
        .mutation(START_GAME, { gameId })
        .toPromise();

    return result.data.startGame;
}

const PERFORM_ACTION = gql`
  mutation PerformAction($gameId: ID!, $playerId: ID!, $action: String!, $amount: Int) {
    performAction(gameId: $gameId, playerId: $playerId, action: $action, amount: $amount) {
      success
      message
      game { id pot phase turnIndex }
    }
  }
`;

export async function performAction(
    gameId: string,
    playerId: string,
    action: string,
    amount?: number
) {
    const result = await urqlClient
        .mutation(PERFORM_ACTION, { gameId, playerId, action, amount })
        .toPromise();

    return result.data.performAction;
}

// ---------------- GAME QUERIES ----------------

const GET_GAME = gql`
  query GetGame($gameId: ID!) {
    getGame(gameId: $gameId) {
      id
      players { id userId chips status }
      communityCards { suit rank }
      pot
      phase
      turnIndex
      isActive
    }
  }
`;

export async function getGame(gameId: string) {
    const result = await urqlClient.query(GET_GAME, { gameId }).toPromise();

    return result.data.getGame;
}


