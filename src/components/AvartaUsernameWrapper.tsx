import {cn} from "@/lib/utils.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {useAuthStore} from "@/store/authStore.ts";
import type {PlayerState} from "@/components/game/types.ts";

export const AvartaUsernameWrapper = ({player}:{player:PlayerState}) => {
    const { user } = useAuthStore();
    const you = user?.id === player.userId;

    return (

            <div className="relative flex flex-col items-center">
                {/* Player Name (slightly on top of avatar) */}
             {/*   {
                    player.id !== user.id ? (
                        <div className="absolute top-11 left-20 text-white font-bold text-sm text-center px-2 py-1 bg-black/50 rounded-md backdrop-blur-sm z-30">
                            {player.id}
                        </div>
                    ):(
                        <div className="absolute top-8 left-20 text-white font-bold text-sm text-center px-2 py-1 bg-black/50 rounded-md backdrop-blur-sm z-30">
                            {"You"}
                        </div>
                    )
                }
*/}


                {/* Avatar */}
                <div className={cn(
                    "relative w-20 h-20 rounded-full border-4 transition-all duration-300 overflow-hidden z-20"
                )}>
                    <Avatar className="w-full h-full">
                        <AvatarImage src={player.avatarUrl} alt={player.name} className="object-cover" />
                        <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {you ? <h1>You</h1>: player.id.slice(0, 6).toUpperCase()}

                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>

    );
};