"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import {AnimatedButton} from "@/components/AnimatedButton";

// MOCK DATA: A list of friends
const friendsToInvite = [
    { id: "friend1", name: "Alice" },
    { id: "friend2", name: "Bob" },
    { id: "friend3", name: "Charlie" },
    { id: "friend4", name: "David" },
];

export const InviteFriendsModal = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSendInvites = () => {
        // In a real app, you'd get the checked values and send invites
        console.log("Sending invites...");
        setIsOpen(false); // Close the modal after sending
    };

    return (
        <>
            {/* The trigger for this modal */}
            <AnimatedButton
                type="button" // Important: set type to "button" to prevent form submission
                icon={<UserPlus size={20} />}
                className="w-full justify-center"
                variant="outline"
                onClick={() => setIsOpen(true)}
            >
                Invite Friends
            </AnimatedButton>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite Friends to Your Game</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-muted-foreground">Select the friends you want to invite.</p>
                        {friendsToInvite.map((friend) => (
                            <div key={friend.id} className="flex items-center space-x-2">
                                <Checkbox id={friend.id} />
                                <Label htmlFor={friend.id} className="text-base">
                                    {friend.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSendInvites}>Send Invites</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};