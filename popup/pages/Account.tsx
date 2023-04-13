import React, { useEffect, useState, FunctionComponent } from "react";
import browser from "webextension-polyfill";

type User = {
    first_name: string;
    last_name: string;
    avatar_url: string;
};

type Props = {
    session: any;
};

const Account: FunctionComponent<Props> = ({ session }) => {
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        browser.runtime.sendMessage({ action: "getUser" }).then((response) => {
            setUser(response.user);
            setLoading(false);
        });
    }, []);

    if (loading || !user) {
        // TODO: Add skeleton loading
        return (
            <div className="absolute w-full top-1/2 left-0 -translate-y-1/2 text-center">
                Loading...
            </div>
        );
    }

    return (
        <div>
            {user.first_name ? (
                <h1 className="text-2xl font-display mt-6">
                    Hey {user.first_name}!
                </h1>
            ) : (
                <h1 className="text-2xl font-display mt-6">Your Account</h1>
            )}
            {session.user.email && (
                <p className="font-body mb-6">{session.user.email}</p>
            )}
        </div>
    );
};

export default Account;
