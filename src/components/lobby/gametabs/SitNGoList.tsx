import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {Crown, LogIn} from "lucide-react";
import {CreateGameModal} from "@/components/lobby/CreateNewGameModal";

// --- MOCK DATA ---
// A list of active games, which would come from your API.
/*
const activeGames = [
    { id: 1, name: "Aces High", rate: "Fast", game: "NL Hold'em", players: "4 / 6", avgStack: "1,500" },
    { id: 2, name: "River Rats", rate: "Standard", game: "Pot Limit Omaha", players: "8 / 9", avgStack: "5,250" },
    { id: 3, name: "The Shark Tank", rate: "Hyper", game: "NL Hold'em", players: "2 / 6", avgStack: "800" },
    { id: 4, name: "Beginner's Luck", rate: "Slow", game: "NL Hold'em", players: "5 / 9", avgStack: "500" },
    { id: 5, name: "High Rollers Only", rate: "Standard", game: "NL Hold'em", players: "3 / 6", avgStack: "25,000" },
];
*/

const activeGames = [
    { id: 1, name: "Aces High", rate: "150/200", game: "Unlimited Holding", players: "4 / 6", avgStack: "1,500" },
    { id: 2, name: "River Rats", rate: "200/200", game: "Unlimited Holding", players: "8 / 9", avgStack: "5,250" },
    { id: 3, name: "The Shark Tank", rate: "150/200", game: "Unlimited Holding", players: "2 / 6", avgStack: "800" },
    { id: 4, name: "Beginner's Luck", rate: "150/200", game: "Limited Holding", players: "5 / 9", avgStack: "500" },
    { id: 5, name: "High Rollers Only", rate: "200/200", game: "Limited Holding", players: "4 / 6", avgStack: "25,000" },
    { id: 5, name: "High Rollers Only", rate: "150/200", game: "Unlimited Holding", players: "3 / 6", avgStack: "25,000" },
    { id: 5, name: "High Rollers Only", rate: "200/200", game: "Unlimited Holding", players: "2 / 6", avgStack: "25,000" },
];


// Leaderboard data remains the same
const leaderboardPlayers = [
    { rank: 1, name: "shadcn", stack: "3,250", avatar: "https://github.com/shadcn.png" },
    { rank: 2, name: "Vercel", stack: "1,800", avatar: "https://github.com/vercel.png" },
    { rank: 3, name: "Lee", stack: "1,150", avatar: "https://github.com/leerob.png" },
    { rank: 4, name: "You", stack: "950", avatar: "" },
];
// -----------------

export const SitNGoList = () => {
    return (
        // Main layout: Responsive Grid (This part is correct)
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* --- LEFT SIDE: List of Game Tables (takes up 2 of 3 columns) --- */}
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Active Tables</CardTitle>
                        <CardDescription>Find a game to join from the list below.</CardDescription>
                    </CardHeader>
                    <CardContent className={"space-y-10"}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Table Name</TableHead>
                                    <TableHead>Game</TableHead>
                                    <TableHead>Players</TableHead>
                                    <TableHead>Avg. Stack</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activeGames.map((game) => (
                                    <TableRow key={game.id}>
                                        <TableCell className="font-medium">{game.name}</TableCell>
                                        <TableCell>{game.game}</TableCell>
                                        <TableCell>{game.players}</TableCell>
                                        <TableCell>{game.avgStack}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" size="sm">
                                                <LogIn className="mr-2 h-4 w-4" />
                                                Join
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className={"flex w-full px-6 "}>
                            <CreateGameModal/>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* --- RIGHT SIDE: Leaderboard (takes up 1 of 3 columns) --- */}
            <div className="lg:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Leaderboard</CardTitle>
                        <CardDescription>Current player rankings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {leaderboardPlayers.map((player) => (
                            <div key={player.name} className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={player.avatar} />
                                    <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <p className="font-semibold">{player.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Stack: {player.stack}
                                    </p>
                                </div>
                                {player.rank === 1 && (
                                    <Crown className="h-6 w-6 text-yellow-500" />
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};