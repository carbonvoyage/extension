import browser from "webextension-polyfill";
import React, { useEffect, useState } from "react";
import Button from "../components/Button";

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

    if (!session) return <div>Not logged in</div>;

    return (
        <div>
            <h1>Settings</h1>
            <Button>Click me</Button>
        </div>
    );
};

export default App;
