"use client";

import { useEffect, useCallback } from "react";
import { useAccount, useSignMessage, useDisconnect } from "wagmi";
import { useAuthStore } from "@/store/authStore";

/**
 * ConnectWallet component handles wallet connection, authentication,
 * and user state management. It correctly persists the user session
 * across page refreshes by leveraging Zustand's persist middleware.
 */
export function ConnectWallet() {
    // Hooks for wallet connection and signing
    const { isConnected, address, status } = useAccount();
    const { disconnect } = useDisconnect();
    const { signMessageAsync } = useSignMessage();

    // Zustand store actions and state
    const { user, token, loading, authenticate, fetchMe, logout } = useAuthStore();

    /**
     * This useEffect is the hero. It runs on component mount and
     * listens for changes in the store's token and user state.
     *
     * It ensures that if we have a token (meaning the store has rehydrated)
     * but no user object (because the app just loaded), we automatically
     * call fetchMe() to get the user's details. This fixes the refresh bug.
     */
    useEffect(() => {
        // If we have a token but no user, it's a fresh load with a saved session.
        if (status === 'connected' && token && !user) {
            console.log("Found token on load, fetching user data...");
            fetchMe();
        }
    }, [status, token, user, fetchMe]);

    /**
     * The handleConnect function triggers the authentication process.
     * It's memoized with useCallback to prevent unnecessary re-creations.
     */
    const handleConnect = useCallback(async () => {
        if (address) {
            await authenticate(address, signMessageAsync);
        }
    }, [address, authenticate, signMessageAsync]);


    /**
     * This useEffect listens for wagmi's connection status.
     * If a user connects for the first time, it triggers the sign-in flow.
     * It's crucial for the initial authentication, not for rehydration.
     */
    useEffect(() => {
        if (isConnected && address && !user) {
            handleConnect();
        }
    }, [isConnected, address, user, handleConnect]);


    /**
     * handleDisconnect handles both wagmi and our local store logout.
     */
    const handleDisconnect = async () => {
        disconnect();
        await logout();
    };


    return (
        <div className="space-y-4 p-10">
            {/* The Wagmi/Web3Modal button for connecting and selecting networks */}
            <w3m-button />
            {isConnected && <w3m-network-button />}

            {/* Loading indicator */}
            {loading && <p>Authenticating...</p>}

            {/* Render the Sign In button only if not logged in and wallet is connected */}
            {!user && isConnected && (
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={handleConnect}
                >
                    Sign in
                </button>
            )}

            {/* Display user info and Disconnect button if logged in */}
            {user && (
                <div className="p-4 border rounded-xl space-y-2 bg-gray-900 text-white shadow-lg">
                    <p className="font-bold text-green-400">✅ Logged in!</p>
                    <p className="text-sm break-all">
                        <strong>ID:</strong> {user.id}
                    </p>
                    <p className="text-sm break-all">
                        <strong>Wallet:</strong> {user.walletAddress}
                    </p>
                    <p className="text-sm">
                        <strong>Username:</strong> {user.username || "(not set)"}
                    </p>
                    <p className="text-sm">
                        <strong>Token:</strong> {token?.substring(0, 10)}...
                    </p>
                    <p className="text-sm">
                        <strong>Chips</strong> {user.chips}
                    </p>
                    <button
                        className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition duration-300 shadow-md"
                        onClick={handleDisconnect}
                    >
                        Disconnect
                    </button>
                </div>
            )}
        </div>
    );
}