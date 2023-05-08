import browser from "webextension-polyfill";
import { Database } from "./types/supabase";
import { Nonprofit as EveryOrgCharity } from "./types/everyOrg";

type User = Database["public"]["Tables"]["users"]["Row"];
type Charity = Database["public"]["Tables"]["charities"]["Row"];
type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

/*
 * Gets Every.org charity data from their API via the background script
 * and returns a promise with the charity data.
 *
 * @param charityName - The name of the charity
 * @returns Promise<Charity>
 */
export const getEveryOrgCharity = async (
    charityName: string
): Promise<EveryOrgCharity> => {
    const { data: charity }: { data: EveryOrgCharity } =
        await browser.runtime.sendMessage({
            action: "getEveryOrgCharity",
            value: charityName,
        });

    return charity;
};

/*
 * Gets Every.org charity data from their API via the background script
 * and returns a promise with the charity data.
 *
 * @returns Promise<Charity[]>
 */
export const getEveryOrgCharities = async (): Promise<EveryOrgCharity[]> => {
    const { data: charities }: { data: EveryOrgCharity[] } =
        await browser.runtime.sendMessage({ action: "getEveryOrgCharities" });

    return charities;
};

/*
 * Gets user data from Supabase via the background script
 * and returns a promise with the user data.
 *
 * @param user - The user data
 * @returns Promise<User>
 */
export const getUser = async (): Promise<User> => {
    const { data: user }: { data: User } = await browser.runtime.sendMessage({
        action: "getUser",
    });

    return user;
};

/*
 * Gets the user's selected charity data from Supabase via the background script
 * and returns a promise with the user selected charity data.
 *
 * @returns Promise<Charity>
 */
export const getSelectedCharity = async (): Promise<
    Charity & {
        month_donated: number;
    }
> => {
    const {
        data: selectedCharity,
    }: {
        data: Charity & {
            month_donated: number;
        };
    } = await browser.runtime.sendMessage({
        action: "getSelectedCharity",
    });

    return selectedCharity;
};

/*
 * Updates the user's selected charity data in Supabase via the background script
 * and returns a promise with the user selected charity data.
 *
 * @param charityName - The name of the charity
 * @returns Promise<Charity>
 */
export const updateSelectedCharity = async (
    name: string,
    slug: string
): Promise<Charity> => {
    const { data: userSelectedCharity }: { data: Charity } =
        await browser.runtime.sendMessage({
            action: "updateSelectedCharity",
            value: {
                name,
                slug,
            },
        });

    return userSelectedCharity;
};

/*
 * Gets transaction data from Supabase via the background script
 * and returns a promise with the transaction data.
 *
 * @param transaction - The transaction data
 * @returns Promise<Transaction>
 */
export const getTransactions = async (): Promise<Transaction[]> => {
    const { data: transactions }: { data: Transaction[] } =
        await browser.runtime.sendMessage({ action: "getTransactions" });

    return transactions;
};
