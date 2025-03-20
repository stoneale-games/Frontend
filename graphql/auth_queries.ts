import { gql } from "@apollo/client";

export const GET_STRING = gql`
  mutation RequestChallenge($address: String!) {
    requestChallenge(address: $address) {
      message
      nonce
      isNewUser
    }
  }
`;

export const SEND_HASH = gql`
  mutation SendHash($address: String!, $hash: String!) {
    sendHash(address: $address, hash: $hash) {
      success
    }
  }
`;

export const VERIFY_CHALLENGE = gql`
  mutation VerifyChallenge(
    $address: String!
    $signature: String!
    $nonce: String!
    $isNewUser: Boolean!
  ) {
    verifyChallenge(
      input: {
        address: $address
        signature: $signature
        nonce: $nonce
        isNewUser: $isNewUser
      }
    ) {
      session {
        token
      }
    }
  }
`;
