import browser from "webextension-polyfill";
import supabase from "./supabase";

import { Message, ResponseCallback } from "../types/background";

import type { Database } from "../types/supabase";

type Charity = Database["public"]["Tables"]["charities"]["Row"];

const updateSelectedCharity = async (
    name: string,
    slug: string,
    response: ResponseCallback
) => {
    if (!name || !slug) {
        console.error("No charity name provided");
        response({ data: null, error: "No charity name provided" });
        return;
    }

    // TODO: Store UID in local storage and use that to get the user's data
    // Get the user's Id to use as a foreign key
    const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .single();

    if (userError) {
        console.error(userError.message);
        response({ data: null, error: userError });
        return;
    }

    // De-select the current selected charity
    const { error: deselectError } = await supabase
        .from("charities")
        .update({ selected: false })
        .eq("selected", true);

    if (deselectError) {
        console.error(deselectError.message);
        response({ data: null, error: deselectError });
        return;
    }

    // Check for an existing charity
    const { data: charities, error: existingCharityError } = await supabase
        .from("charities")
        .select("*")
        .eq("slug", slug);

    if (existingCharityError) {
        console.error(existingCharityError.message);
        response({ data: null, error: existingCharityError });
        return;
    }

    if (charities.length > 0) {
        // Update the existing charity
        const { error: updateError } = await supabase
            .from("charities")
            .update({ selected: true })
            .eq("slug", slug);

        if (updateError) {
            console.error(updateError.message);
            response({ data: null, error: updateError });
            return;
        }

        response({
            data: {
                message: "Selected charity updated",
            },
        });
        return;
    }

    // Create a new charity
    const { error: createError } = await supabase.from("charities").insert([
        {
            name,
            slug,
            selected: true,
            user_id: user.id,
        },
    ]);

    if (createError) {
        console.error(createError.message);
        response({ data: null, error: createError });
        return;
    }

    response({
        data: {
            message: "Selected charity updated",
        },
    });
};

async function handleMessage(
    { action, value }: Message,
    response: ResponseCallback
) {
    switch (action) {
        case "getSession":
            supabase.auth.getSession().then(response);
            break;

        case "getUser":
            const { data: user, error: userError } = await supabase
                .from("users")
                .select("*")
                .single();

            if (userError) {
                console.error(userError.message);
                response({ user: null, error: userError });
                break;
            }

            response({ data: user });
            break;

        case "getSelectedCharity":
            // TODO: Can be missing if the user has not selected a charity
            const { data: selectedCharityList, error: selectedCharityError } =
                await supabase
                    .from("charities")
                    .select("*")
                    .eq("selected", "true");

            if (selectedCharityError || selectedCharityList.length === 0) {
                console.error(selectedCharityError?.message);
                response({
                    selectedCharity: null,
                    error: selectedCharityError,
                });
                break;
            }

            // TODO: Error if more than one selected charity
            const selectedCharity = selectedCharityList[0];

            // Get charity's monthly donations
            const from = new Date(
                Date.now() - 30 * 24 * 60 * 60 * 1000
            ).toISOString(); // 30 days ago
            const to = new Date().toISOString(); // now
            const { data: monthlyDonations, error: monthlyDonationsError } =
                await supabase
                    .from("transactions")
                    .select("*")
                    .eq("selected_charity", selectedCharity.id)
                    .gte("created_at", from)
                    .lte("created_at", to);

            console.log(monthlyDonations);

            if (monthlyDonationsError) {
                console.error(monthlyDonationsError.message);
                response({
                    selectedCharity: null,
                    error: monthlyDonationsError,
                });
                break;
            }

            const customCharity: Charity & {
                month_donated: number;
            } = {
                ...selectedCharity,
                month_donated: monthlyDonations.reduce(
                    (acc, { total_offset: amount }) => acc + amount,
                    0
                ),
            };

            console.log(customCharity);

            response({ data: customCharity });
            break;

        case "getTransactions":
            const { data: transactions, error: transactionsError } =
                await supabase.from("transactions").select("*");

            if (transactionsError) {
                console.error(transactionsError.message);
                response({ transactions: null, error: transactionsError });
                break;
            }

            response({ data: transactions });
            break;

        case "getEveryOrgCharities":
            // TODO: Move API key to env
            const charitiesRes = await fetch(
                "https://partners.every.org/v0.2/search/carbon?causes=environment&take=10&apiKey=pk_live_4bd96cb06d0f55b6f2f9b62fb81bee4a"
            );
            const { nonprofits, error: charitiesError } =
                await charitiesRes.json();

            if (charitiesError) {
                console.error(charitiesError.message);
                response({ charities: null, error: charitiesError });
                break;
            }

            response({ data: nonprofits });
            break;

        case "getEveryOrgCharity":
            if (!value) {
                console.error("No charity ID provided");
                response({ charity: null, error: "No charity ID provided" });
                break;
            }

            // TODO: Move API key to env
            const charityRes = await fetch(
                `https://partners.every.org/v0.2/nonprofit/${value}?apiKey=pk_live_4bd96cb06d0f55b6f2f9b62fb81bee4a`
            );
            const { data, error: charityError } = await charityRes.json();

            // TODO: Fix this error
            // Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'nonprofit')
            if (charityError || !data?.nonprofit) {
                console.error(charityError.message);
                response({ charity: null, error: charityError });
                break;
            }
            const charity = data.nonprofit;

            response({ data: charity });
            break;

        case "updateSelectedCharity":
            if (typeof value !== "object" || !value.name || !value.slug) {
                console.error("No charity provided");
                response({ data: null, error: "No charity provided" });
                break;
            }

            updateSelectedCharity(value.name, value.slug, response);
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
            ? "https://carbonvoyage.org/extension/onboarding"
            : "http://localhost:3000/extension/onboarding";

    browser.tabs.create({
        url: URL,
    });
});
