import { createClient } from "@supabase/supabase-js";
import browser from "webextension-polyfill";

const supabaseUrl = "https://xxkphskmxfgqcvubnfmy.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4a3Boc2tteGZncWN2dWJuZm15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA3Mjk2ODAsImV4cCI6MTk5NjMwNTY4MH0.y8mxnCOM6AOlxRsDVva7vPKyXB_nkZPrSAT2dU5JxC4";

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase URL or key");
}

// https://github.com/supabase/gotrue-js/issues/539#issuecomment-1334098416
// https://developer.chrome.com/docs/extensions/reference/storage/
function sessionStorageProvider() {
    const storage = browser.storage.local;
    return {
        getItem: (key: string) => {
            return storage.get(key).then((data) => data[key]);
        },
        setItem: (key: string, value: string) => {
            storage.set({ [key]: value });
        },
        removeItem: (key: string) => {
            storage.remove([key]);
        },
    };
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        detectSessionInUrl: false,
        // @ts-ignore uses internal type
        storage: sessionStorageProvider(),
    },
});

export default supabase;
