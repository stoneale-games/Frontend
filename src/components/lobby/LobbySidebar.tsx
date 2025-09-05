"use client"; // Optional, only needed if you're using React Server Components somewhere

import { UserProfile } from "@/components/lobby/UserProfile";
import { SidebarButton } from "@/components/lobby/SidebarButton";

// Lucide React Icons
import {
    Image as ImageIcon,
    LandPlot,
    ScrollText,
    Wallet,
} from "lucide-react";

// TanStack Router
import {useRouter, useRouterState} from "@tanstack/react-router";

const LobbySidebar = () => {
    const router = useRouter();

    const pathname = useRouterState({
        select: (state) => state.location.pathname,
    });
    console.log(pathname);
    const sidebarLinks = [
        {
            href: "/app/lobby",
            label: "Lobby",
            icon: <LandPlot size={40} />,
        },
       /* {
            href: "/games/poker",
            label: "Games",
            icon: <Gamepad2 size={40} />,
        },*/
        {
            href: "/nfts",
            label: "NFTs",
            icon: <ImageIcon size={40} />,
        },
        {
            href: "/app/wallet",
            label: "Wallet",
            icon: <Wallet size={40} />,
        },
        {
            href: "/app/game/rules",
            label: "Read Rules",
            icon: <ScrollText size={40} />,
        },
    ];

    return (
        <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-neutral-900 border-r dark:border-neutral-700">
            <div className="p-4 border-b dark:border-neutral-700">
                <UserProfile />
            </div>

            <nav className="flex-1 p-4 flex flex-col items-center gap-4">
                {sidebarLinks.map((link) => (
                    <SidebarButton
                        key={link.href}
                        icon={link.icon}
                        active={pathname.startsWith(link.href)}
                        onClick={() => router.navigate({ to: link.href })}
                        className="w-full h-auto py-3 justify-start px-4"
                    >
                        <span className="text-base font-medium">{link.label}</span>
                    </SidebarButton>
                ))}
            </nav>
        </aside>
    );
};

export default LobbySidebar;
