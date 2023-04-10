import browser from "webextension-polyfill";
import supabase from "./supabase";

type AuthFormMessage = {
    action: "signup" | "signin";
    value: {
        email: string;
        password: string;
    };
};

type UpdateIconMessage = {
    action: "updateIcon";
    value: string;
};

type AuthMessage = {
    action: "getSession" | "signout";
    value: null;
};

type FetchMessage = {
    action: "fetch";
    value: null;
};

type Message = AuthFormMessage | UpdateIconMessage | AuthMessage | FetchMessage;

type ResponseCallback = (data: any) => void;

async function handleMessage(
    { action, value }: Message,
    response: ResponseCallback
) {
    let result;

    switch (action) {
        case "fetch":
            result = await fetch("https://meowfacts.herokuapp.com/");
            const { data: fetchData } = await result.json();

            response({ message: "Successfully signed up!", fetchData });
            break;
        case "updateIcon":
            if (value) {
                browser.action.setIcon({ path: value });
            } else {
                browser.action.setIcon({ path: "./logo128.png" });
            }
        case "getSession":
            supabase.auth.getSession().then(response);
            break;
        case "signout":
            const { error: signOutError } = await supabase.auth.signOut();

            response({ data: null, signOutError });
            break;
        default:
            response({ data: null, error: "Unknown action" });
    }
}

// @ts-ignore
browser.runtime.onMessage.addListener((msg, _sender, response) => {
    handleMessage(msg, response);
    return true;
});

const validPages = [
    "carbonvoyage.org",
    "amazon.com",
    "walmart.com",
    "ebay.com",
];

// Listen for active tab changes to see if the icon should be disabled.
// We can't reach out to see if the content script is running since
// the content script is only injected on valid pages
browser.tabs.onActivated.addListener(async ({ tabId }) => {
    const tab = await browser.tabs.get(tabId);
    if (!tab.url) {
        browser.action.setIcon({ path: "./logoDisabled128.png" });
        return;
    }

    const url = new URL(tab.url);
    const domain = url.hostname.replace("www.", "");

    // Check if the active tab is a valid page
    if (!validPages.includes(domain)) {
        browser.action.setIcon({ path: "./logoDisabled128.png" });
    }
});

// Wait for the tab to load
// https://stackoverflow.com/a/20077404/9264137

// const tabId = tab.id;

// if (tabId !== activeInfo.tabId || !tab.url) {
//     return;
// }

// const url = new URL(tab.url);
// const domain = url.hostname.replace("www.", "");
// console.log(domain);

// // Check if the active tab is a valid page
// if (!validPages.includes(domain)) {
//     browser.action.setIcon({ path: "./logoDisabled128.png" });
// } else {
//     browser.action.setIcon({ path: "./logo128.png" });
// }

// Listen for messages from the website
browser.runtime.onMessageExternal.addListener(async (msg, sender) => {
    // Check if we're in development mode
    // https://stackoverflow.com/a/46269256/9264137
    const URL =
        "update_url" in browser.runtime.getManifest()
            ? "https://carbonvoyage.org"
            : "http://localhost:3000";

    // Only allow messages from the website
    // @ts-ignore
    if (sender.origin !== URL) {
        return;
    }

    switch (msg.action) {
        case "updateSession":
            const { error } = await supabase.auth.setSession(msg.session);
            if (error) {
                console.error(error);
            }
            break;
        case "removeSession":
            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) {
                console.error(signOutError);
            }
            break;
    }
});

// On install, open the onboarding page
browser.runtime.onInstalled.addListener(() => {
    const URL =
        "update_url" in browser.runtime.getManifest()
            ? "https://carbonvoyage.org/signin"
            : "http://localhost:3000/signin";

    browser.tabs.create({
        url: URL,
    });
});
