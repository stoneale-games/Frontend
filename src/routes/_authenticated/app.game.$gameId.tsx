"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useSubscription } from "urql";
import { useGameStore } from "@/store/gameStore";
import {useEffect, useState} from "react";
import {GAME_UPDATES, GET_GAME} from "@/query-types/game.ts";
import {GameComponentWrapper} from "@/components/game/GameComponentWrapper.tsx";

export const Route = createFileRoute("/_authenticated/app/game/$gameId")({
    component: RouteComponent,
});

function RouteComponent() {
    return <GamePage />;
}

export function GamePage() {
    const { gameId } = Route.useParams();
    const { setGame, game } = useGameStore();
    const [hasSubscriptionData, setHasSubscriptionData] = useState(false);

    // Initial query
    const [{ data, fetching, error }] = useQuery({ query: GET_GAME, variables: { gameId } });
    console.log("here is the game ", game);

    // Subscription - this is where the winner data comes from
    useSubscription(
        { query: GAME_UPDATES, variables: { gameId } },
        (_, newData) => {
            console.log("console logging subscription data: ", newData);
            if (newData?.gameUpdates) {
                setGame(newData.gameUpdates);
                setHasSubscriptionData(true); // Mark that we've received subscription data
            }
            return newData;
        }
    );

    // Set initial game from query ONLY if we haven't received subscription data yet
    useEffect(() => {
        if (data?.getGame && !hasSubscriptionData) {
            console.log("Setting initial game from query (no subscription data yet)");
            setGame(data.getGame);
        }
    }, [data, setGame, hasSubscriptionData]);

    if (fetching && !game) return <div className="p-6">Loading game...</div>;
    if (error) return <div className="p-6 text-red-500">Error: {error.message}</div>;

    return (
        <GameComponentWrapper/>
    );
}