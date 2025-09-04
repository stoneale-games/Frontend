'use client'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

import {Star} from "lucide-react";
import {UserChipsAmount} from "@/components/UserChipsAmount";

export const UserProfile = () => {

    return (
        <div className={"flex flex-col items-center gap-5 bg-gray-50 dark:bg-neutral-900 rounded-sm p-4"}>

            <Avatar className={"h-32 w-32 rounded-sm"}>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className={"text-4xl"}>CN</AvatarFallback>
            </Avatar>

            <h2 className={"text-2xl font-bold"}>Username</h2>

            <div className={"flex items-center gap-4 text-lg"}>
                <UserChipsAmount/>

                <div className={"flex gap-2 items-center"}>
                    <Star size={24}  color={"red"} fill={"red"}/>
                    <p>12</p>
                </div>
            </div>

        </div>
    );
};