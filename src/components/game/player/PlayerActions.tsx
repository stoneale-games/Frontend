"use client";

import { useAuthStore } from "@/store/authStore";
import { ActionControls } from "@/components/game/ActionControls";
import { useGameStore } from "@/store/gameStore";
import { gql, useMutation } from "urql";

const PERFORM_ACTION = gql`
  mutation PerformAction($gameId: ID!, $playerId: ID!, $action: String!, $amount: Int) {
    performAction(gameId: $gameId, playerId: $playerId, action: $action, amount: $amount) {
      message
      success
    }
  }
`;

export const PlayerActions = () => {
    const { user } = useAuthStore();
    const game = useGameStore((s) => s.game);
    const [, performAction] = useMutation(PERFORM_ACTION);

    if (!game) return null;

    const self = game.players.find((p) => p.userId === user?.id);
    const isMyTurn = !!self && self.seat === game.turnIndex;

    if (!isMyTurn || !self) return null;

    const handleAction = (action: string, amount?: number) => {
        performAction({
            gameId: game.id,
            playerId: self.id,
            action,
            amount,
        });
    };

    return (
        <div className="absolute bottom-4 right-4 z-20 p-10">
            <ActionControls
                possibleActions={["fold", "check", "call", "bet", "raise"]}
                callAmount={game.pot} // TODO: replace with real call amount from server
                minRaise={20}   // TODO: replace with real minRaise from server
                maxRaise={self.chips}
                onFold={() => handleAction("fold")}
                onCheck={() => handleAction("check")}
                onCall={() => handleAction("call")}
                onBet={(amount) => handleAction("bet", amount)}
                onRaise={(amount) => handleAction("raise", amount)}
            />
        </div>
    );
};
