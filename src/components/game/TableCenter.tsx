import {CommunityCards} from "@/components/game/CommunityCards.tsx";
import {Pot} from "@/components/game/Pot.tsx";
import {useGameStore} from "@/store/gameStore.ts";

export const TableCenter = () => {
    const game = useGameStore((s) => s.game);

    if(!game) return null;
    return (
        <>

            <div className={"flex flex-col items-center w-full  max-w-2xl"}>
                <Pot total={game.pot ?? 0} />
                <CommunityCards cards={game.communityCards} />
            </div>

            {/* Pot in center */}
          {/*  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Pot total={game.pot ?? 0} />
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6">
                <CommunityCards cards={game.communityCards} />
                <p>coooooooooooooooooooooooooooom...</p>
            </div>*/}

        </>



    );
};