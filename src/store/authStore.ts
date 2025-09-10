// store/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {connectWallet, fetchNonce, logout} from "@/api/auth";
import {getMe} from "@/api/user";

export type User = {
    id: string;
    walletAddress: string;
    username?: string;
    email?:string;
    chips?: number;
};

type AuthState = {
    user: User | null;
    token: string | null;
    loading: boolean;
    hasHydrated: boolean;
    newAuthenticate: (
        walletAddress: string,
        signMessage: string,
    ) => Promise<void>;
    authenticate: (
        walletAddress: string,
        signMessageAsync: (args: { message: string }) => Promise<string>
    ) => Promise<void>;
    fetchMe: () => Promise<void>;
    logout: () => Promise<void>;
    setHasHydrated: (hasHydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            loading: false,
            hasHydrated: false,

            authenticate: async (walletAddress, signMessageAsync) => {
                set({ loading: true });
                try {
                    const nonce = await fetchNonce(walletAddress);
                    const signature = await signMessageAsync({ message: nonce });
                    const authData = await connectWallet(walletAddress, signature);

                    set({ user: authData.user, token: authData.token, loading: false });
                } catch (err) {
                    console.error("Auth failed:", err);
                    set({ user: null, token: null, loading: false });
                }
            },
            newAuthenticate: async (walletAddress, signature) => {
                set({ loading: true });
                try {
                    const authData = await connectWallet(walletAddress, signature);

                    set({ user: authData.user, token: authData.token, loading: false });
                } catch (err) {
                    console.error("Auth failed:", err);
                    set({ user: null, token: null, loading: false });
                }
            },

            fetchMe: async () => {
                const currentState = get();

                // Don't fetch if no token available
                if (!currentState.token) {
                    console.log("No token available for fetchMe");
                    return;
                }
                set({ loading: true });
                try {
                    const me = await getMe();
                    console.log(me);
                    if (me) {
                        set({ user: me.user, token: me.token, loading: false });
                    } else {
                        // Only clear user, keep token for retry
                        set({ user: null, loading: false });
                    }
                } catch (err) {
                    console.error("fetchMe failed:", err);
                    set({ loading: false }); // network or unexpected error
                }
            },

            logout: async () => {
                await logout();
                set({ user: null, token: null });
            },

            setHasHydrated: (hasHydrated) => {
                set({ hasHydrated });
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);