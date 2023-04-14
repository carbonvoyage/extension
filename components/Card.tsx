import React, { FunctionComponent, ReactNode } from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import classNames from "classnames";

import { LIGHT_SKELETON_THEME } from "../constants";
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

interface Image {
    src?: string;
    alt?: string;
    shape?: "circle" | "square";
}

interface IconProps {
    HoverIcon?: ReactSVGNode;
    image?: Image;
    loading?: boolean;
}

const Icon: FunctionComponent<IconProps> = ({ HoverIcon, image, loading }) => {
    const iconClassName = classNames(
        image?.shape === "circle" ? "rounded-full" : "rounded-xl",
        !loading && "cursor-pointer",
        "w-12 h-12 relative  border border-carbon-bronze/20 bg-carbon-gold overflow-hidden"
    );
    const hoverClassName = classNames(
        !loading &&
            "group-hover:bg-carbon-bronze/70 hover:!bg-carbon-bronze/90 group-hover:opacity-100",
        "w-full h-full absolute duration-300 top-0 text-carbon-gold bg-carbon-bronze/50 opacity-0 z-10"
    );

    return (
        <motion.div
            whileTap={!loading ? { scale: 0.95 } : {}}
            whileHover={!loading ? { scale: 1.05 } : {}}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 18,
            }}
            className={iconClassName}
        >
            {loading ? (
                <Skeleton
                    className="absolute top-0"
                    {...LIGHT_SKELETON_THEME}
                    height={56}
                    width={56}
                />
            ) : image?.src ? (
                <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full">
                    <Logo className="opacity-40 w-full h-full p-2.5 -translate-x-0.5 translate-y-0.5" />
                </div>
            )}
            <div className={hoverClassName}>
                {HoverIcon && <HoverIcon className="w-full h-full p-3" />}
            </div>
        </motion.div>
    );
};

interface CardProps {
    children: ReactNode;
    HoverIcon?: ReactSVGNode;
    image?: Image;
    loading?: boolean;
}

const Card: FunctionComponent<CardProps> = ({
    children,
    HoverIcon,
    image,
    loading,
}) => {
    return (
        <div className="py-2">
            <div
                className={`${
                    !loading && "hover:bg-carbon-bronze/10"
                } duration-300 py-1 rounded-lg no-select`}
            >
                <motion.div
                    whileHover={!loading ? { scale: 0.96 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    className="flex flex-row gap-2 group max-h-12"
                >
                    {(image || loading) && (
                        <div className="flex flex-col justify-center">
                            <Icon
                                HoverIcon={HoverIcon}
                                image={image}
                                loading={loading}
                            />
                        </div>
                    )}
                    <div className="flex flex-col justify-center">
                        {children}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Card;
