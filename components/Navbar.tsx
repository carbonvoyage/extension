import React from "react";

import Button from "./Button";
import Activity from "../assets/icons/Activity";
import Menu from "../assets/icons/Menu";
import History from "../assets/icons/History";
import User from "../assets/icons/User";

const Navbar = () => {
    return (
        <div className="fixed bottom-0 h-16 w-full backdrop-blur-lg bg-carbon-gold bg-opacity-50 border-t border-carbon-bronze/20">
            <div className="flex justify-between items-center h-full px-8">
                <Button variant="icon" size="none" aria-label="Carbon Voyage">
                    <Activity className="w-6 h-6" />
                </Button>
                <Button variant="icon" size="none" aria-label="Carbon Voyage">
                    <History className="w-6 h-6" />
                </Button>
                <Button variant="icon" size="none" aria-label="Carbon Voyage">
                    <User className="w-6 h-6" />
                </Button>
                <Button variant="icon" size="none" aria-label="Carbon Voyage">
                    <Menu className="w-6 h-6" />
                </Button>
            </div>
        </div>
    );
};

export default Navbar;
