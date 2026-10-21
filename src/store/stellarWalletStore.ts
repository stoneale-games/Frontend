// store/stellarWalletStore.ts - Freighter (Stellar) wallet connection state
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
    getAddress,
    getNetworkDetails,
    isConnected,
    requestAccess,
    signMessage,
    signTransaction,
} from "@stellar/freighter-api";
import { stellarConfig } from "@/lib/stellar.ts";

type StellarWalletState = {
    address: string | null;
    walletNetwork: string | null;
    connecting: boolean;
    error: string | null;
    connect: () => Promise<void>;
    /** Re-sync with Freighter on page load (user may have switched accounts). */
    restore: () => Promise<void>;
    disconnect: () => void;
    signTx: (xdr: string) => Promise<string>;
    /** SEP-53 message signature, base64 encoded (used for backend login). */
    signMsg: (message: string) => Promise<string>;
};

export const useStellarWallet = create<StellarWalletState>()(
    persist(
        (set, get) => ({
            address: null,
            walletNetwork: null,
            connecting: false,
            error: null,

            connect: async () => {
                set({ connecting: true, error: null });
                try {
                    const installed = await isConnected();
                    if (!installed.isConnected) {
                        throw new Error("Freighter is not installed. Get it at freighter.app");
                    }
                    const access = await requestAccess();
                    if (access.error) {
                        throw new Error(access.error.message ?? String(access.error));
                    }
                    const details = await getNetworkDetails();
                    set({
                        address: access.address,
                        walletNetwork: details.network ?? null,
                        connecting: false,
                    });
                } catch (err) {
                    console.error("Freighter connect failed:", err);
                    set({
                        connecting: false,
                        error: err instanceof Error ? err.message : "Failed to connect Freighter",
                    });
                }
            },

            restore: async () => {
                if (!get().address) return;
                try {
                    const { address } = await getAddress();
                    const details = await getNetworkDetails();
                    // Empty address => site no longer allowed in Freighter
                    set({ address: address || null, walletNetwork: details.network ?? null });
                } catch {
                    set({ address: null });
                }
            },

            disconnect: () => {
                set({ address: null, walletNetwork: null, error: null });
            },

            signTx: async (xdr) => {
                const address = get().address;
                if (!address) throw new Error("Wallet not connected");
                const res = await signTransaction(xdr, {
                    networkPassphrase: stellarConfig.networkPassphrase,
                    address,
                });
                if (res.error) {
                    throw new Error(res.error.message ?? String(res.error));
                }
                return res.signedTxXdr;
            },

            signMsg: async (message) => {
                const address = get().address;
                if (!address) throw new Error("Wallet not connected");
                const res = await signMessage(message, {
                    networkPassphrase: stellarConfig.networkPassphrase,
                    address,
                });
                if (res.error || !res.signedMessage) {
                    throw new Error(res.error?.message ?? "Message signing was rejected");
                }
                // Freighter v4+ returns base64, older versions return raw bytes
                return typeof res.signedMessage === "string"
                    ? res.signedMessage
                    : res.signedMessage.toString("base64");
            },
        }),
        {
            name: "stellar-wallet",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ address: state.address }),
        },
    ),
);
