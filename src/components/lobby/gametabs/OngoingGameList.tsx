"use client";

import { useState } from "react";
import { useQuery, useMutation } from "urql";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { LogIn, Search } from "lucide-react";
import { CreateGameModal } from "@/components/lobby/CreateNewGameModal";

import { JOIN_GAME, FETCH_GAMES } from "@/query-types/game";
import type {GameState, PlayerState} from "@/components/game/types.ts";
import {getErrorMessage} from "@/lib/helpers.ts";

export const OngoingGameList = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();

    // filters for fetching games
    const [filters, setFilters] = useState({
        isActive: true,
        minPot: undefined as number | undefined,
        maxPot: undefined as number | undefined,
        phase: "",
    });

    const [{ data, fetching: fetchingGames }] = useQuery({
        query: FETCH_GAMES,
        variables: {
            filters: {
                isActive: filters.isActive,
                minPot: filters.minPot,
                maxPot: filters.maxPot,
                phase: filters.phase || undefined,
            },
            sort: [{ field: "LAST_ACTIVITY", direction: "DESC" }],
            limit: 20,
        },
    });


    const [{ fetching }, joinGame] = useMutation(JOIN_GAME);
    const [chipInputs, setChipInputs] = useState<Record<string, number>>({});

    const handleInputChange = (gameId: string, value: string) => {
        const chips = parseInt(value, 10);
        setChipInputs((prev) => ({
            ...prev,
            [gameId]: isNaN(chips) ? 0 : chips,
        }));
    };

    const handleJoin = async (gameId: string) => {
        const chips = chipInputs[gameId] ?? 0;

        if (chips <= 0) {
            toast.error("Invalid chips amount", {
                description: "Please enter a positive number of chips.",
            });
            return;
        }

        try {
            const result = await joinGame({
                gameId,
                userId: user?.id,
                chips,
            });

            if (result.error) {
                toast.error("Failed to join game", {
                    description: result.error.message,
                });
                return;
            }

            if (result.data?.joinGame) {
                toast.success("Joined game successfully 🎉", {
                    description: `You are now seated at table ${gameId.substring(0, 8)}...`,
                });

                await navigate({
                    to: "/app/game/$gameId",
                    params: {gameId},
                });
            }
        } catch (error: unknown) {
            const err = getErrorMessage(error);
            toast.error("Unexpected error", {
                description: err ?? "Something went wrong",
            });
        }
    };

    // ✅ detect if user is already seated in a game
    const activeGames = data?.fetchGames.games ?? [];
   /* const userGame = activeGames.find((g) =>
        g.players.some((p: PlayerState) => p.userId === user?.id)
    );*/

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Active Tables</CardTitle>
                        <CardDescription>
                            Find a game to join from the list below.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 ">
                        {/* ✅ Filters */}
                        <div className="flex flex-wrap gap-3 items-end">
                            <Input
                                type="number"
                                placeholder="Min Pot"
                                className="w-32"
                                value={filters.minPot ?? ""}
                                onChange={(e) =>
                                    setFilters((f) => ({
                                        ...f,
                                        minPot: e.target.value ? parseInt(e.target.value, 10) : undefined,
                                    }))
                                }
                            />
                            <Input
                                type="number"
                                placeholder="Max Pot"
                                className="w-32"
                                value={filters.maxPot ?? ""}
                                onChange={(e) =>
                                    setFilters((f) => ({
                                        ...f,
                                        maxPot: e.target.value ? parseInt(e.target.value, 10) : undefined,
                                    }))
                                }
                            />
                            <Input
                                type="text"
                                placeholder="Phase (e.g. preflop)"
                                className="w-40"
                                value={filters.phase}
                                onChange={(e) =>
                                    setFilters((f) => ({ ...f, phase: e.target.value }))
                                }
                            />
                            <Button variant="outline" size="sm">
                                <Search className="mr-2 h-4 w-4" />
                                Apply Filters
                            </Button>
                        </div>

                        {/* ✅ Game Table */}
                         <div className={"max-h-[40vh] overflow-y-auto"}>
                             <Table>
                                 <TableHeader>
                                     <TableRow>
                                         <TableHead>Game ID</TableHead>
                                         <TableHead>Players</TableHead>
                                         <TableHead>Pot</TableHead>
                                         <TableHead>Phase</TableHead>
                                         <TableHead>Status</TableHead>
                                         <TableHead className="text-right">Action</TableHead>
                                     </TableRow>
                                 </TableHeader>
                                 <TableBody>
                                     {fetchingGames ? (
                                         <TableRow>
                                             <TableCell colSpan={6} className="text-center">
                                                 Loading games...
                                             </TableCell>
                                         </TableRow>
                                     ) : activeGames.length === 0 ? (
                                         <TableRow>
                                             <TableCell
                                                 colSpan={6}
                                                 className="text-center text-muted-foreground"
                                             >
                                                 No active games. Create one to get started!
                                             </TableCell>
                                         </TableRow>
                                     ) : (
                                         activeGames.map((game:GameState) => {
                                             const isUserInThisGame = game.players.some(
                                                 (p: PlayerState) => p.userId === user?.id
                                             );
                                             return (
                                                 <TableRow
                                                     key={game.id}
                                                     className={
                                                         isUserInThisGame ? "bg-green-50 font-semibold" : ""
                                                     }
                                                 >
                                                     <TableCell className="font-medium">
                                                         {game.id.substring(0, 8)}...
                                                     </TableCell>
                                                     <TableCell>{game.players.length}</TableCell>
                                                     <TableCell>${game.pot}</TableCell>
                                                     <TableCell className="capitalize">
                                                         {game.phase}
                                                     </TableCell>
                                                     <TableCell>
                          <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                  game.isActive
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                              }`}
                          >
                            {game.isActive ? "Active" : "Waiting"}
                          </span>
                                                     </TableCell>
                                                     <TableCell className="flex justify-end gap-2">
                                                         {isUserInThisGame ? (
                                                             <Button
                                                                 variant="default"
                                                                 size="sm"
                                                                 onClick={() =>
                                                                     navigate({
                                                                         to: "/app/game/$gameId",
                                                                         params: { gameId: game.id },
                                                                     })
                                                                 }
                                                             >
                                                                 Go to Table
                                                             </Button>
                                                         ) : (
                                                             <>
                                                                 <Input
                                                                     type="number"
                                                                     placeholder="Chips"
                                                                     className="w-24"
                                                                     value={chipInputs[game.id] ?? ""}
                                                                     onChange={(e) =>
                                                                         handleInputChange(game.id, e.target.value)
                                                                     }
                                                                     /*   disabled={!!userGame} // disable if user already in another game*/
                                                                 />
                                                                 <Button
                                                                     variant="outline"
                                                                     size="sm"
                                                                     onClick={() => handleJoin(game.id)}
                                                                     /*  disabled={fetching || !!userGame}*/ // disable join if already seated
                                                                 >
                                                                     <LogIn className="mr-2 h-4 w-4" />
                                                                     {fetching ? "Joining..." : "Join"}
                                                                 </Button>
                                                             </>
                                                         )}
                                                     </TableCell>
                                                 </TableRow>
                                             );
                                         })
                                     )}
                                 </TableBody>
                             </Table>
                         </div>

                        {/* ✅ Create new game */}
                        <div className="flex w-full px-6 ">
                            <CreateGameModal />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* leaderboard column unchanged */}
        </div>
    );
};
