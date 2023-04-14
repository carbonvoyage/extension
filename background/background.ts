import browser from "webextension-polyfill";
import supabase from "./supabase";

import { Message, ResponseCallback } from "../types/background";

async function handleMessage(
    { action, value }: Message,
    response: ResponseCallback
) {
    switch (action) {
        case "getSession":
            supabase.auth.getSession().then(response);
            break;

        case "getUser":
            const { data: user } = await supabase
                .from("users")
                .select("*, charities ( * )")
                .single();
            response({ user, charities: user?.charities });
            break;

        case "getSelectedCharity":
            // TODO: Clean up returned data
            const { data } = await supabase
                .from("users")
                .select("charities ( selected_charity:id, * )")
                .single();
            const userSelectedCharity = data!.charities;

            response({ userSelectedCharity });
            break;

        case "getTransactions":
            const { data: transactions } = await supabase
                .from("transactions")
                .select("*");
            response({ transactions });
            break;

        case "getEveryOrgCharities":
            // TODO: Move API key to env
            const charitiesRes = await fetch(
                "https://partners.every.org/v0.2/search/carbon?causes=environment&take=10&apiKey=pk_live_4bd96cb06d0f55b6f2f9b62fb81bee4a"
            );
            const { nonprofits } = await charitiesRes.json();
            response({ charities: nonprofits });
            break;

        case "getEveryOrgCharity":
            if (!value) {
                console.error("No charity ID provided");
                response({ charity: null });
                break;
            }

            // TODO: Move API key to env
            const charityRes = await fetch(
                `https://partners.every.org/v0.2/nonprofit/${value}?apiKey=pk_live_4bd96cb06d0f55b6f2f9b62fb81bee4a`
            );
            const {
                data: { nonprofit: charity },
            } = await charityRes.json();
            response({ charity: charity });
            break;

        case "updateIcon":
            if (value) {
                browser.action.setIcon({ path: value });
            } else {
                browser.action.setIcon({ path: "./logo128.png" });
            }
            break;

        default:
            response({ data: null, error: "Unknown action" });
    }
}

browser.runtime.onMessage.addListener(
    // @ts-ignore response is supported but not in type definition
    (msg: Message, _sender: any, response: ResponseCallback) => {
        handleMessage(msg, response);
        return true;
    }
);

/*
 * Listen for active tab changes to see if the icon should be disabled.
 * We can't reach out to see if the content script is running since
 * the content script is only injected on valid pages
 *
 * @param tabId - The ID of the tab that was activated
 * @returns void
 */
browser.tabs.onActivated.addListener(async ({ tabId }) => {
    const tab = await browser.tabs.get(tabId);
    if (!tab.url) {
        browser.action.setIcon({ path: "./logoDisabled128.png" });
        return;
    }

    const url = new URL(tab.url);
    const domain = url.hostname.replace("www.", "");

    // TODO: Get from manifest
    const validPages = [
        "carbonvoyage.org",
        "amazon.com",
        "walmart.com",
        "ebay.com",
    ];

    // Check if the active tab is a valid page
    if (!validPages.includes(domain)) {
        browser.action.setIcon({ path: "./logoDisabled128.png" });
    }
});

/*
 * Listen for messages from the website
 *
 * @param msg - The message sent from the website
 * @param sender - The sender of the message
 * @returns void
 */
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

/*
 * On install, prompt the user to sign into the site.
 *
 * TODO: Change to onboarding page.
 */
browser.runtime.onInstalled.addListener(() => {
    const URL =
        "update_url" in browser.runtime.getManifest()
            ? "https://carbonvoyage.org/signin"
            : "http://localhost:3000/signin";

    browser.tabs.create({
        url: URL,
    });
});
