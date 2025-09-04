"use client";

import {MessageCircle, Volume2, Settings} from "lucide-react";
import {AnimatedButton} from "@/components/AnimatedButton";
import {FriendsListModal} from "@/components/lobby/FriendsListModal";

const LobbyNavbar = () => {
    return (
        <header className="flex items-center justify-between h-16 px-6 dark:bg-neutral-900 bg-white">
            {/* A mobile menu button could go here for the sidebar */}
            <div className="md:hidden">
                {/* Placeholder for a hamburger menu icon */}
                <button className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-700">
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16m-7 6h7"
                        />
                    </svg>
                </button>
            </div>

            {/* Page Title (optional, can be dynamic) */}
            <div className="hidden md:block">

            </div>

            {/* Replaced user profile with animated buttons */}
            <div className="flex items-center gap-3">
                <FriendsListModal/>

                <AnimatedButton
                    icon={<MessageCircle size={20} />}
                    className="p-2"
                    variant="ghost"
                    aria-label="Messages"
                    badgeContent={3}
                >
                    <span className="text-base font-medium">Messages</span>

                </AnimatedButton>

                <AnimatedButton
                    icon={<Volume2 size={20} />}
                    className="p-2"
                    variant="ghost"
                    aria-label="Volume"
                >
                    <span className="text-base font-medium">Volume</span>
                </AnimatedButton>

                <AnimatedButton
                    icon={<Settings size={20} />}
                    className="p-2"
                    variant="ghost"
                    aria-label="Settings"
                >
                    <span className="text-base font-medium">Settings</span>
                </AnimatedButton>
            </div>
        </header>
    );
};

export default LobbyNavbar;
