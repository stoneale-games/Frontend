import { gql } from 'urql';
import { urqlClient } from '@/lib/urqlClient';

// ---------------- PROFILE ----------------

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($username: String, $email: String) {
    updateProfile(username: $username, email: $email) {
      id
      walletAddress
      username
      email
      chips
    }
  }
`;

export async function updateProfile(username?: string, email?: string) {
    const result = await urqlClient
        .mutation(UPDATE_PROFILE, { username, email })
        .toPromise();

    if (!result.data) throw new Error("No data returned from updateProfile");

    return result.data.updateProfile;
}

const ME = gql`
  query Me {
    me {
      id
      walletAddress
      username
      email
      chips
    }
  }
`;

export async function getMe() {
    const result = await urqlClient.query(ME, {}).toPromise();

    if (!result.data) throw new Error("No data returned from getMe");

    return result.data.me;
}