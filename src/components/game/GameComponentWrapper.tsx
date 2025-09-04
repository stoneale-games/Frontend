import {useGameStore} from "@/store/gameStore.ts";
import {GameTable} from "@/components/game/GameTable.tsx";
import {GameRightSidebar} from "@/components/game/GameRightSideBar.tsx";
import {useAuthStore} from "@/store/authStore.ts";

export const GameComponentWrapper = () => {
    const { game } = useGameStore();
    const { user } = useAuthStore();


    const checkIfUserInGame =
        game?.players.some(player => player.userId === user?.id) || false;
    return (
        <div className="relative flex flex-col h-screen">
            <GameTable userInGame={checkIfUserInGame}/>
            {checkIfUserInGame && (<GameRightSidebar />)}
        </div>
    );
};