'use client';

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type FlyingCardProps = {
    src: string;
    width?: number;
    height?: number;
    opacity?: number;
    delay?: number;
    duration?: number;
    className?: string;
};

export const FlyingCard = ({
                               src,
                               width = 200,
                               height = 300,
                               opacity = 1,
                               delay = 0,
                               duration = 5,
                               className = "",
                           }: FlyingCardProps) => {
    const [screenHeight, setScreenHeight] = useState(1000);

    useEffect(() => {
        // Get viewport height only once
        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };
        handleResize(); // initial set
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <motion.div
            className={`absolute pointer-events-none ${className}`}
            initial={{ y: -height, opacity }}
            animate={{ y: screenHeight, opacity: 0 }}
            transition={{
                duration,
                ease: "easeInOut",
                delay,
                repeat: Infinity,
                repeatType: "loop",
            }}
        >
            <img
                src={src}
                alt="flying_card"
                width={width}
                height={height}
                style={{ opacity }}
            />
        </motion.div>
    );
};
