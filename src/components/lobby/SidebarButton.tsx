"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type {ReactNode} from "react";

interface SidebarButtonProps extends HTMLMotionProps<"button">,
    VariantProps<typeof buttonVariants> {
    icon: ReactNode;
    children: ReactNode;
    active?: boolean;
}

export const SidebarButton = ({
                                  icon,
                                  children,
                                  active,
                                  className,
                                  ...props
                              }: SidebarButtonProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-auto flex items-center gap-4 rounded-lg text-muted-foreground justify-center",
                {
                    "bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500": active,
                },
                className
            )}
            {...props}
        >
            {icon}
            {children}
        </motion.button>
    );
};
