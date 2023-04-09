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

    return (
        <div className="w-80 h-80">
            <h1>Popup</h1>
            <Button>Click me</Button>
            {!session ? <div>Not logged in</div> : <div>Logged in!</div>}
        </div>
    );
};

export default App;
