import {gql} from "urql";

export const ME = gql`
  query Me {
    me {
      id
      walletAddress
      username
      email
      chips
    }
  }`;

export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($username: String, $email: String) {
    updateProfile(username: $username, email: $email) {
      id
      walletAddress
      username
      email
      chips
    }
  }`;