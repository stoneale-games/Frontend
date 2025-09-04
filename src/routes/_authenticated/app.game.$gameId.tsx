"use client";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useSubscription } from "urql";
import { useGameStore } from "@/store/gameStore";
import {useEffect} from "react";
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
    const { setGame } = useGameStore();


    // Initial query
    const [{ data, fetching, error }] = useQuery({ query: GET_GAME, variables: { gameId } });

    // Subscription
    useSubscription(
        { query: GAME_UPDATES, variables: { gameId } },
        (_, newData) => {
            console.log("console logging " ,newData);
            if (newData?.gameUpdates) setGame(newData.gameUpdates);
            return newData;
        }
    );

    // Set initial game from query
    useEffect(() => {
        if (data?.getGame) setGame(data.getGame);
    }, [data, setGame]);

    if (fetching) return <div className="p-6">Loading game...</div>;
    if (error) return <div className="p-6 text-red-500">Error: {error.message}</div>;

    return (
        <GameComponentWrapper/>
    );
}
