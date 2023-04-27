import React, { useState, FunctionComponent } from "react";
import { Menu } from "@headlessui/react";
import browser from "webextension-polyfill";
import { AnimatePresence, motion, useWillChange } from "framer-motion";

import { PageView } from "../types/popup";
import Button from "./Button";
import { Home, Menu as MenuIcon, Heart, User, Close } from "../assets/icons";

const menuStates = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        y: "0.6rem",
        x: "0.2rem",
    },
    show: {
        opacity: 1,
        scale: 1,
        y: "0.5rem",
        x: "0rem",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 18,
        },
    },
};

interface Props {
    pageView: PageView;
    setPageView: React.Dispatch<React.SetStateAction<PageView>>;
}

const Navbar: FunctionComponent<Props> = ({ pageView, setPageView }) => {
    const willChange = useWillChange();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navOptions = [
        {
            label: "Home",
            icon: <Home className="w-6 h-6" />,
            view: PageView.HOME,
            onClick: () => {
                setPageView(PageView.HOME);
                setIsMenuOpen(false);
            },
        },
        {
            label: "Charities",
            icon: <Heart className="w-6 h-6" />,
            view: PageView.CHARITIES,
            onClick: () => {
                setPageView(PageView.CHARITIES);
                setIsMenuOpen(false);
            },
        },
        {
            label: "Account",
            icon: <User className="w-6 h-6" />,
            view: PageView.ACCOUNT,
            onClick: () => {
                // TODO: Finish account page support
                // setPageView(PageView.ACCOUNT);
                browser.tabs.create({
                    url: "https://carbonvoyage.org/account",
                });
                setIsMenuOpen(false);
            },
        },
    ];
    const menuOptions = [
        {
            label: "Terms of Service",
            onClick: () => {
                browser.tabs.create({
                    url: "https://carbonvoyage.org/terms-of-service",
                });
            },
        },
        {
            label: "Privacy Policy",
            onClick: () => {
                browser.tabs.create({
                    url: "https://carbonvoyage.org/privacy-policy",
                });
            },
        },
        {
            label: "Help",
            onClick: () => {
                browser.tabs.create({
                    url: "https://notion.carbonvoyage.org/help",
                });
            },
        },
        // {
        //     label: "Options",
        //     onClick: () => {
        //         browser.tabs.create({
        //             // TODO: Firefox support
        //             url: "chrome://extensions/?options=mdcgbdmolfjpjaljhjaocjnlkmidgfed",
        //         });
        //     },
        // },
    ];

    return (
        <>
            {isMenuOpen && (
                <button
                    className="fixed inset-0 z-20 w-full h-full bg-transparent cursor-default"
                    onClick={() => {
                        setIsMenuOpen(false);
                    }}
                />
            )}
            <div className="fixed bottom-0 h-16 z-20 w-full backdrop-blur-lg bg-carbon-gold bg-opacity-50 border-t border-carbon-bronze/20">
                <div className="flex justify-between items-center h-full px-8">
                    {navOptions.map((option) => {
                        return (
                            <Button
                                key={option.label}
                                variant={
                                    pageView === option.view
                                        ? "primary"
                                        : "icon"
                                }
                                size={
                                    pageView === option.view ? "medium" : "none"
                                }
                                aria-label={option.label}
                                onClick={option.onClick}
                            >
                                {option.icon}
                            </Button>
                        );
                    })}
                    <Menu>
                        {isMenuOpen ? (
                            <Button
                                variant="icon"
                                size="none"
                                aria-label="Open Options Menu"
                                onClick={() => {
                                    setIsMenuOpen(false);
                                }}
                            >
                                <Close className="w-6 h-6" />
                            </Button>
                        ) : (
                            <Button
                                variant="icon"
                                size="none"
                                aria-label="Close Options Menu"
                                onClick={() => {
                                    setIsMenuOpen(true);
                                }}
                            >
                                <MenuIcon className="w-6 h-6" />
                            </Button>
                        )}
                        <AnimatePresence>
                            {isMenuOpen && (
                                <Menu.Items
                                    static
                                    as={motion.div}
                                    style={{ willChange }}
                                    variants={menuStates}
                                    initial="hidden"
                                    animate="show"
                                    exit="hidden"
                                    className="z-30 bg-carbon-white border border-carbon-bronze/20 shadow-lg shadow-carbon-bronze/20 rounded-xl absolute bottom-full right-2 flex flex-col gap-1 p-2"
                                >
                                    {menuOptions.map((option) => {
                                        return (
                                            <Menu.Item
                                                key={option.label}
                                                as="div"
                                            >
                                                <button
                                                    className="text-left py-0.5 px-2 rounded-lg duration-300 hover:bg-carbon-bronze/10"
                                                    onClick={option.onClick}
                                                >
                                                    {option.label}
                                                </button>
                                            </Menu.Item>
                                        );
                                    })}
                                </Menu.Items>
                            )}
                        </AnimatePresence>
                    </Menu>
                </div>
            </div>
        </>
    );
};

export default Navbar;
