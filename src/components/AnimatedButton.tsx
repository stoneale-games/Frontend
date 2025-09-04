
import {type HTMLMotionProps, motion} from "framer-motion";
import {type VariantProps} from "class-variance-authority";
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import type {ReactNode} from "react";

type MotionButtonProps = HTMLMotionProps<"button">;

export interface AnimatedButtonProps extends MotionButtonProps, VariantProps<typeof buttonVariants> {
    children: ReactNode;
    className?: string;
    active?: boolean;
    icon?: ReactNode;
    badgeContent?: string | number;
}

export const AnimatedButton = ({
                                   children,
                                   icon,
                                   badgeContent,
                                   className,
                                   active,
                                   variant = "ghost",
                                   ...props
                               }: AnimatedButtonProps) => {
    return (
        <motion.button
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
            transition={{type: "spring", stiffness: 400, damping: 17}}
            className={cn(
                buttonVariants({variant}),
                "h-auto flex items-center gap-4 rounded-lg text-muted-foreground justify-start",
                {
                    "bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500": active,
                },
                className
            )}
            {...props}
        >
            {icon && (
                <span className="relative shrink-0">
          {icon}
                    {badgeContent !== undefined && (
                        <span
                            className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-semibold px-1.5 py-[1px] rounded-full leading-none shadow-md z-10 min-w-[16px] text-center">
                                 {badgeContent}
                        </span>

                    )}
        </span>
            )}
            <span className="truncate p-1">{children}</span>
        </motion.button>
    );
};
