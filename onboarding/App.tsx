import browser from "webextension-polyfill";
import React, { useEffect, useState } from "react";
import AuthModal from "../components/AuthModal";
import Button from "../components/Button";

enum SCREEN {
    SIGN_IN,
    SIGN_UP,
    FACTS,
}

const App = () => {
    const [session, setSession] = useState(null);

    async function getSession() {
        const {
            data: { session },
        } = await browser.runtime.sendMessage({ action: "getSession" });
        setSession(session);
    }

    useEffect(() => {
        getSession();
    }, []);

    useEffect(() => {
        console.log("session", session);
    }, [session]);

    async function handleSignIn(email: string, password: string) {
        const { data } = await browser.runtime.sendMessage({
            action: "signin",
            value: { email, password },
        });

        setSession(data.session);
    }

    if (!session) {
        return <AuthModal />;
    }

    return <></>;
};
export default App;
