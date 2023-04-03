import browser from "webextension-polyfill";
import supabase from "./supabase";

type AuthFormMessage = {
    action: "signup" | "signin";
    value: {
        email: string;
        password: string;
    };
};

type AuthMessage = {
    action: "getSession" | "signout";
    value: null;
};

type FetchMessage = {
    action: "fetch";
    value: null;
};

type Message = AuthFormMessage | AuthMessage | FetchMessage;

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
        case "signup":
            result = await supabase.auth.signUp(value);

            response({ message: "Successfully signed up!", data: result });
            break;
        case "signin":
            console.log("requesting auth");
            const { data: signInData, error: signInError } =
                await supabase.auth.signInWithPassword(value);

            response({ signInData, signInError });
            break;
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

// On install, open the onboarding page
browser.runtime.onInstalled.addListener(() => {
    browser.tabs.create({
        url: browser.runtime.getURL("onboarding/index.html"),
    });
});
