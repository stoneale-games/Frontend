// src/pages/Dashboard.tsx
import  { useEffect } from "react";
import Board from "../components/Board";
import BoardActions from "../components/BoardActions";
import BoardInfo from "../components/BoardInfo";
import BoardMessage from "../components/BoardMessage";
import ErrorBoundary from "../components/ErrorBoundary";
import { useGame } from "../contexts/GameContext";
import PokerApp from "../components/Poker-app";

const Dashboard = () => {
    const { dispatch } = useGame();

    // Reset game when component unmounts or when user navigates away
    useEffect(() => {
        return () => {
            dispatch({ type: 'RESET_GAME' });
        };
    }, [dispatch]);
    const test = true;

    if (test) {
        return (
            <section className="relative h-[calc(100vh-60px)]">
            <PokerApp />
            </section>
        )
    }
    
    return (
        <ErrorBoundary>
            <section className="relative h-[calc(100vh-60px)]">
                <Board />
                <section className="absolute px-16 flex justify-between items-end bottom-6 left-0 right-0">
                    <BoardMessage />
                    <BoardActions />
                    <BoardInfo />
                </section>
            </section>
        </ErrorBoundary>
    );
};

export default Dashboard;