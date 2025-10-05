"use client";

import { useState } from "react";
import { useMutation, useQuery } from "urql";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore.ts";

// GraphQL queries/mutations
const UPDATE_PROFILE = `
  mutation UpdateProfile($username: String, $email: String) {
    updateProfile(username: $username, email: $email) {
      id
      username
      email
    }
  }
`;

const ME_QUERY = `
  query Me {
    me {
      id
      username
      email
      walletAddress
      chips
    }
  }
`;

export const ChangeUserProfile = () => {
    const { user } = useAuthStore();
    const [name, setName] = useState(user?.username ?? "");
    const [email, setEmail] = useState(user?.email ?? "");

    // For profile update
    const [{ fetching }, updateProfile] = useMutation(UPDATE_PROFILE);

    // For refreshing me
    const [, reexecuteMeQuery] = useQuery({ query: ME_QUERY, pause: true });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await updateProfile({ username: name, email });

        if (result.error) {
            toast.error(result.error.message);
            console.error("❌ Failed to update profile:", result.error);
            return;
        }

        toast.success("✅ Profile updated successfully");
        console.log("Updated user:", result.data.updateProfile);

        // 🔄 Refresh the global `me` query
        reexecuteMeQuery({ requestPolicy: "network-only" });
    };

    return (
        <div className="flex justify-center items-start p-6 bg-muted/20 min-h-screen">
            <Card className="w-full max-w-lg rounded-2xl shadow-xl border border-border">
                <CardHeader className="flex flex-col items-center space-y-3">
                    <Avatar className="h-20 w-20 border-2 border-primary">
                        <AvatarImage src="/placeholder-user.jpg" alt="User avatar" />
                        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl font-semibold">Profile Settings</CardTitle>
                    <p className="text-sm text-muted-foreground text-center max-w-xs">
                        Update your display name and email address.
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Display Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="rounded-xl"
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="rounded-xl"
                            />
                        </div>

                        {/* Save */}
                        <div className="flex justify-end">
                            <Button type="submit" disabled={fetching} className="rounded-xl px-6">
                                {fetching ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
