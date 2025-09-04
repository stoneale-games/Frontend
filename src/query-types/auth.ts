import { gql } from 'urql';

// GraphQL query
export const GET_NONCE = gql`
  query GetNonce($walletAddress: String!) {
    getNonce(walletAddress: $walletAddress)
  }
`;
