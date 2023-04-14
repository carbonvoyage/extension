import browser from "webextension-polyfill";
import { Database } from "./types/supabase";
import { Nonprofit as EveryOrgCharity } from "./types/everyOrg";

type User = Database["public"]["Tables"]["users"]["Row"];
type Charity = Database["public"]["Tables"]["charities"]["Row"];
type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

/*
 * Gets Every.org charity data from the background script
 * and returns a promise with the charity data.
 *
 * This function also limits the name length to 14 characters
 * and cleans up the websiteUrl for display purposes.
 *
 * @param charityName - The name of the charity
 * @returns Promise<Charity>
 */
export const getEveryOrgCharity = async (
    charityName: string
): Promise<EveryOrgCharity> => {
    const { charity }: { charity: EveryOrgCharity } =
        await browser.runtime.sendMessage({
            action: "getEveryOrgCharity",
            value: charityName,
        });

    // Limit name length
    if (charity.name && charity.name.length > 14) {
        charity.name = charity.name.slice(0, 14);
        charity.name = charity.name.trim();
        charity.name += "...";
    }

    // Clean up websiteUrl
    if (charity.websiteUrl) {
        const url = new URL(charity.websiteUrl);
        charity.websiteUrl = url.hostname.replace("www.", "");
    }

    return charity;
};

/*
 * Gets user data from the background script
 * and returns a promise with the user data.
 *
 * @param user - The user data
 * @returns Promise<User>
 */
export const getUser = async (): Promise<{
    user: User;
    charities: Charity[];
}> => {
    // ? Is there a better way to incorporate the charities data?
    const { user, charities }: { user: User; charities: Charity[] } =
        await browser.runtime.sendMessage({
            action: "getUser",
        });

    return { user, charities };
};

/*
 * Gets the user's selected charity data from the background script
 * and returns a promise with the user selected charity data.
 *
 * @returns Promise<Charity>
 */
export const getSelectedCharity = async (): Promise<Charity> => {
    const { userSelectedCharity }: { userSelectedCharity: Charity } =
        await browser.runtime.sendMessage({
            action: "getSelectedCharity",
        });

    return userSelectedCharity;
};

/*
 * Gets transaction data from the background script
 * and returns a promise with the transaction data.
 *
 * @param transaction - The transaction data
 * @returns Promise<Transaction>
 */
export const getTransactions = async (): Promise<Transaction[]> => {
    const { transactions }: { transactions: Transaction[] } =
        await browser.runtime.sendMessage({ action: "getTransactions" });

    return transactions;
};
