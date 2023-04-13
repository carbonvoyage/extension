import browser from "webextension-polyfill";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";
import { PageView } from "./types";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Account from "./pages/Account";
import Charities from "./pages/Charities";

const App = () => {
    const [session, setSession] = useState(null);
    const [pageView, setPageView] = useState(PageView.HOME);

    useEffect(() => {
        async function getSession() {
            const {
                data: { session },
            } = await browser.runtime.sendMessage({ action: "getSession" });
            setSession(session);
        }

        getSession();
    }, []);

    if (!session) {
        return <SignIn />;
    }

    return (
        <div className="w-80 h-120 overflow-y-auto">
            <Topbar />
            <div className="pt-12 pb-16 px-4">
                {(() => {
                    switch (pageView) {
                        case PageView.HOME:
                            return <Home />;
                        case PageView.CHARITIES:
                            return <Charities />;
                        case PageView.ACCOUNT:
                            return <Account session={session} />;
                        case PageView.OPTIONS:
                            return <div>Options</div>;
                    }
                }).call(this)}
            </div>
            <Navbar pageView={pageView} setPageView={setPageView} />
        </div>
    );
};

export default App;
