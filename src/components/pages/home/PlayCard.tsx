
import { motion } from "motion/react";

type PlayCardProps = {
    image: string;
    text: string;
    rotateLeft?: number;
    rotateRight?: number;
    imageSize?: number;
    onClick?: () => void;
};

export const PlayCard = ({
                             image,
                             text,
                             rotateLeft = -6,
                             rotateRight = 6,
                             imageSize = 300,
                             onClick,
                         }: PlayCardProps) => {
    return (
        // Use motion.button for semantic correctness and accessibility
        <motion.button
            onClick={onClick}
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            initial="rest"
            animate="rest"
            // Reset default button styles and add a relative position for its children
            className="relative bg-transparent border-none p-0 text-left"
        >
            {/* Floating image with bounce on hover */}
            <motion.div
                // NOTE: pointer-events-none makes sure the click registers on the button, not the image
                className="z-30 absolute bottom-24 pointer-events-none"
                variants={{
                    rest: { y: 0, scale: 1.3 },
                    hover: {
                        y: [0, -10, 0, -6, 0],
                        transition: {
                            duration: 0.8,
                            repeat: Infinity,
                            repeatType: 'loop',
                        },
                    },
                }}
            >
                <img src={image} alt="playcard_image" width={imageSize} height={imageSize} />
            </motion.div>

            {/* Crossed Cards */}
            <div className="relative h-56 w-56">
                {/* Left Card */}
                <div
                    className="absolute inset-0 border border-yellow-200 rounded-2xl z-10 shadow-[0_0_1px_rgba(253,224,71,0.7)]"
                    style={{
                        transform: `rotate(${rotateLeft}deg) translateZ(0)`,
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                    }}
                />

                {/* Right Card */}
                <div
                    className="absolute inset-0 border border-yellow-200 rounded-2xl z-20 backdrop-blur-md shadow-md"
                    style={{
                        transform: `rotate(${rotateRight}deg) translateZ(0)`,
                        willChange: 'transform',
                        backfaceVisibility: 'hidden',
                    }}
                />

                {/* Foreground content with text scale on hover */}
                <motion.div
                    className="absolute font-bold text-2xl inset-0 z-30 top-24 flex flex-col justify-center items-center   text-center px-4"
                    variants={{
                        rest: { scale: 1 },
                        hover: { scale: 1.1 },
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                    <h1>{text}</h1>
                </motion.div>
            </div>
        </motion.button>
    );
};