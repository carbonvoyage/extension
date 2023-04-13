import React, { useState, FunctionComponent } from "react";
import { Menu } from "@headlessui/react";
import browser from "webextension-polyfill";
import { AnimatePresence, motion, useWillChange } from "framer-motion";

import { PageView } from "../popup/types";
import Button from "./Button";
import { Home, Menu as MenuIcon, Heart, User, Close } from "../assets/icons";

const popup = {
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

type Props = {
    pageView: PageView;
    setPageView: React.Dispatch<React.SetStateAction<PageView>>;
};

const Navbar: FunctionComponent<Props> = ({ pageView, setPageView }) => {
    const willChange = useWillChange();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {isMenuOpen && (
                <button
                    className="fixed inset-0 z-10 w-full h-full bg-transparent cursor-default"
                    onClick={() => {
                        setIsMenuOpen(false);
                    }}
                />
            )}
            <div className="fixed bottom-0 h-16 z-20 w-full backdrop-blur-lg bg-carbon-gold bg-opacity-50 border-t border-carbon-bronze/20">
                <div className="flex justify-between items-center h-full px-8">
                    <Button
                        variant={
                            pageView === PageView.HOME ? "primary" : "icon"
                        }
                        size={pageView === PageView.HOME ? "medium" : "none"}
                        aria-label="Home"
                        onClick={() => {
                            setPageView(PageView.HOME);
                            setIsMenuOpen(false);
                        }}
                    >
                        <Home className="w-6 h-6" />
                    </Button>
                    <Button
                        variant={
                            pageView === PageView.CHARITIES ? "primary" : "icon"
                        }
                        size={
                            pageView === PageView.CHARITIES ? "medium" : "none"
                        }
                        aria-label="Charities"
                        onClick={() => {
                            setPageView(PageView.CHARITIES);
                            setIsMenuOpen(false);
                        }}
                    >
                        <Heart className="w-6 h-6" />
                    </Button>
                    <Button
                        variant={
                            pageView === PageView.ACCOUNT ? "primary" : "icon"
                        }
                        size={pageView === PageView.ACCOUNT ? "medium" : "none"}
                        aria-label="User"
                        onClick={() => {
                            setPageView(PageView.ACCOUNT);
                            setIsMenuOpen(false);
                        }}
                    >
                        <User className="w-6 h-6" />
                    </Button>
                    <Menu>
                        {isMenuOpen ? (
                            <Button
                                variant="icon"
                                size="none"
                                aria-label="User"
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
                                aria-label="User"
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
                                    variants={popup}
                                    initial="hidden"
                                    animate="show"
                                    exit="hidden"
                                    className="bg-carbon-white border border-carbon-bronze/20 shadow-lg shadow-carbon-bronze/20 rounded-xl absolute bottom-full right-2 flex flex-col gap-1 p-2"
                                >
                                    <Menu.Item>
                                        <button
                                            className="text-left py-0.5 px-2 rounded-lg duration-300 hover:bg-carbon-bronze/10"
                                            onClick={() => {
                                                browser.tabs.create({
                                                    url: "https://carbonvoyage.org/terms-of-service",
                                                });
                                            }}
                                        >
                                            Terms of Service
                                        </button>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <button
                                            className="text-left py-0.5 px-2 rounded-lg duration-300 hover:bg-carbon-bronze/10"
                                            onClick={() => {
                                                browser.tabs.create({
                                                    url: "https://carbonvoyage.org/privacy-policy",
                                                });
                                            }}
                                        >
                                            Privacy Policy
                                        </button>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <button
                                            className="text-left py-0.5 px-2 rounded-lg duration-300 hover:bg-carbon-bronze/10"
                                            onClick={() => {
                                                browser.tabs.create({
                                                    // TODO: Firefox support
                                                    url: "chrome://extensions/?options=mdcgbdmolfjpjaljhjaocjnlkmidgfed",
                                                });
                                            }}
                                        >
                                            Options
                                        </button>
                                    </Menu.Item>
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
