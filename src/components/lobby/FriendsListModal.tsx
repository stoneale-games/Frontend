"use client"; // Required for useState

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users } from "lucide-react";
import {AnimatedButton} from "@/components/AnimatedButton";

// --- MOCK DATA ---
// In a real app, this would come from your state management or API
const friends = [
    { id: 1, name: "Alice", avatar: "https://github.com/alice.png", status: "Online" },
    { id: 2, name: "Bob", avatar: "https://github.com/bob.png", status: "Away" },
    { id: 3, name: "Charlie", avatar: "https://github.com/charlie.png", status: "Online" },
    { id: 4, name: "David", avatar: "", status: "Offline" },
];
// -----------------

export const FriendsListModal = () => {
    // State to control the visibility of the modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            {/* 1. The Trigger Button */}
            {/* This is your reusable animated button */}
            <AnimatedButton
                icon={<Users size={28} />}
                aria-label="Friends"
                onClick={() => setIsModalOpen(true)} // Open the modal on click
                className="w-full h-auto py-3 justify-start px-4"
            >
                <span className="text-base font-medium">Friends</span>
            </AnimatedButton>

            {/* 2. The Modal (Dialog) */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Friends List</DialogTitle>
                        <DialogDescription>
                            See who's online and start a conversation.
                        </DialogDescription>
                    </DialogHeader>

                    {/* 3. The List of Friends */}
                    <div className="flex flex-col gap-4 py-4">
                        {friends.map((friend) => (
                            <div key={friend.id} className="flex items-center justify-between gap-4">
                                {/* Friend Info */}
                                <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={friend.avatar} alt={friend.name} />
                                        <AvatarFallback>{friend.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{friend.name}</p>
                                        <p className={`text-xs ${
                                            friend.status === "Online" ? "text-green-500" : "text-muted-foreground"
                                        }`}>{friend.status}</p>
                                    </div>
                                </div>

                                {/* Chat Button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => console.log(`Starting chat with ${friend.name}`)}
                                    aria-label={`Chat with ${friend.name}`}
                                >
                                    <MessageSquare className="h-5 w-5" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};