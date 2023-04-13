import React, { FunctionComponent, ReactNode } from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";

import { LIGHT_SKELETON_THEME } from "../popup/constants";
import { Logo } from "../assets/icons";

type ReactSVGNode = ({
    className,
    fill,
    ...props
}: {
    [x: string]: any;
    className?: string | undefined;
    fill?: string | undefined;
}) => JSX.Element;

type CardProps = {
    HoverIcon?: ReactSVGNode;
    hover?: boolean;
    image?: {
        src?: string;
        alt?: string;
        shape?: "circle" | "square";
    };
    children?: ReactNode;
    loading?: boolean;
};

const Card: FunctionComponent<CardProps> = ({
    HoverIcon,
    hover = true,
    image,
    children,
    loading,
}) => {
    return (
        <div className="py-2">
            <div
                className={`${
                    hover && "hover:bg-carbon-bronze/10"
                } duration-300 rounded-lg no-select`}
            >
                <motion.div
                    whileHover={hover ? { scale: 0.96 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className="flex flex-row gap-2 group"
                >
                    {(image || loading) && (
                        <div className="flex flex-col justify-center">
                            <motion.div
                                whileTap={hover ? { scale: 0.95 } : {}}
                                whileHover={hover ? { scale: 1.05 } : {}}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 18,
                                }}
                                className={`${
                                    image?.shape === "circle"
                                        ? "rounded-full"
                                        : "rounded-lg"
                                } ${
                                    hover && "cursor-pointer"
                                } w-14 h-14 relative  border border-carbon-bronze/20 bg-carbon-gold overflow-hidden`}
                            >
                                {image?.src && !loading ? (
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full">
                                        <Logo className="opacity-40 w-full h-full p-3 -translate-x-0.5 translate-y-0.5" />
                                    </div>
                                )}
                                {loading && (
                                    <Skeleton
                                        className="absolute top-0"
                                        {...LIGHT_SKELETON_THEME}
                                        height={56}
                                        width={56}
                                    />
                                )}
                                <div
                                    className={`${
                                        hover &&
                                        "group-hover:bg-carbon-bronze/70 hover:!bg-carbon-bronze/90 group-hover:opacity-100"
                                    } w-full h-full absolute duration-300 top-0 text-carbon-gold bg-carbon-bronze/50 opacity-0 z-10`}
                                >
                                    {HoverIcon && (
                                        <HoverIcon className="w-full h-full p-3 -translate-x-0.5 translate-y-0.5" />
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                    <div className="flex flex-col justify-center my-2">
                        {children}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Card;
