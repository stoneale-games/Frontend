import {gql} from "urql";

export const CREATE_GAME = gql`
  mutation CreateGame($smallBlind: Int!, $bigBlind: Int!) {
    createGame(smallBlind: $smallBlind, bigBlind: $bigBlind) {
      id
      players { id chips }
      pot
      phase
    }
  }
`;

export const JOIN_GAME = gql`
  mutation JoinGame($gameId: ID!, $userId: ID!, $chips: Int!) {
    joinGame(gameId: $gameId, userId: $userId, chips: $chips) {
      id
      players { id userId chips }
    }
  }
`;


export const FETCH_GAMES = gql`
  query FetchGames($filters: GameFilters, $sort: [GameSort!], $limit: Int, $offset: Int) {
    fetchGames(filters: $filters, sort: $sort, limit: $limit, offset: $offset) {
      games {
        id
        pot
        phase
        isActive
        players {
          id
          userId
        }
      }
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
`;


export const GET_GAME = gql`
  query GetGame($gameId: ID!) {
    getGame(gameId: $gameId) {
      id
      players {
        id
        userId
        seat
        chips
        status
        isFolded
        isAllIn
        hand {
          suit
          rank
        }
      }
      communityCards {
        suit
        rank
      }
      pot
      phase
      turnIndex
      isActive
      lastAction
    }
  }
`;

export const GAME_UPDATES = gql`
  subscription GameUpdates($gameId: ID!) {
    gameUpdates(gameId: $gameId) {
      id
      players {
        id
        userId
        seat
        chips
        status
        isFolded
        isAllIn
        hand {
          suit
          rank
        }
      }
      communityCards {
        suit
        rank
      }
      pot
      phase
      turnIndex
      isActive
      lastAction
    }
  }
`;

export const LEAVE_GAME = gql`
  mutation LeaveGame($gameId: ID!, $userId: ID!) {
    leaveGame(gameId: $gameId, userId: $userId)
  }
`;

export const START_GAME = gql`
  mutation StartGame($gameId: ID!) {
    startGame(gameId: $gameId) {
      id
      phase
      pot
      players {
        id
        userId
        chips
        status
        seat
        isFolded
        isAllIn
      }
      communityCards {
        suit
        rank
      }
    }
  }
`;