import { gql } from 'urql';
import { urqlClient } from '@/lib/urqlClient';
import {deleteCookie, setCookie} from "@/lib/cookieHelper.ts";

// GraphQL query
const GET_NONCE = gql`
  query GetNonce($walletAddress: String!) {
    getNonce(walletAddress: $walletAddress)
  }
`;

export async function fetchNonce(walletAddress: string) {
    try {
        const result = await urqlClient
            .query(GET_NONCE, { walletAddress })
            .toPromise();

        return result.data?.getNonce;
    } catch (error) {
        console.error("Error fetching nonce:", error);
        throw error;
    }
}

// GraphQL mutation
const CONNECT_WALLET = gql`
  mutation ConnectWallet($walletAddress: String!, $signature: String!) {
    connectWallet(walletAddress: $walletAddress, signature: $signature) {
      token
      user {
        id
        walletAddress
        username
      }
    }
  }
`;

export async function connectWallet(walletAddress: string, signature: string) {
    try {
        const result = await urqlClient
            .mutation(CONNECT_WALLET, { walletAddress, signature })
            .toPromise();

        if (!result.data?.connectWallet) {
            throw new Error("connectWallet mutation failed");
        }

        const { token } = result.data.connectWallet;

        // ONLY client-side storage
        setCookie("token",token);

        return result.data.connectWallet;
    } catch (error) {
        console.error("Error connecting wallet:", error);
        throw error;
    }
}

export async function logout() {
    // Only client-side
   deleteCookie("token");
}
