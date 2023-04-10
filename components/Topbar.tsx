import React, { useEffect } from "react";
import browser from "webextension-polyfill";

import Button from "./Button";
import { Logo, Known, Unknown, Close, Heart } from "../assets/icons";

enum SiteType {
    UNKNOWN,
    KNOWN,
    ORIGIN,
}

const Topbar = () => {
    const [url, setUrl] = React.useState("");
    const [known, setKnown] = React.useState<SiteType>(SiteType.UNKNOWN);

    // Get the current tab's URL from content-script
    useEffect(() => {
        const getURL = async () => {
            // Send a message to the content-script in the current tab
            browser.tabs
                .query({ active: true, currentWindow: true })
                .then(async (tabs) => {
                    try {
                        const { url } = await browser.tabs.sendMessage(
                            // @ts-ignore
                            tabs[0].id,
                            {
                                action: "getURL",
                            }
                        );
                        const urlObj = new URL(url);
                        const domain = urlObj.hostname.replace("www.", "");
                        setUrl(domain);

                        if (domain === "carbonvoyage.org") {
                            setKnown(SiteType.ORIGIN);
                        } else {
                            setKnown(SiteType.KNOWN);
                        }

                        browser.runtime.sendMessage({
                            action: "updateIcon",
                            value: "./logo128.png",
                        });
                    } catch (e) {
                        setUrl("Unsupported Site");
                        setKnown(SiteType.UNKNOWN);
                        browser.runtime.sendMessage({
                            action: "updateIcon",
                            value: "./logoDisabled128.png",
                        });
                    }
                });
        };
        getURL();
    }, []);

    return (
        <div className="fixed top-0 h-12 w-full backdrop-blur-lg bg-carbon-gold bg-opacity-50 border-b border-carbon-bronze/20">
            <div className="flex justify-between items-center h-full px-4">
                <Button
                    variant="icon"
                    size="none"
                    aria-label="Carbon Voyage"
                    onClick={() => {
                        browser.tabs.create({
                            url: "https://carbonvoyage.org/dashboard",
                        });
                    }}
                >
                    <Logo width="20px" height="20px" />
                </Button>
                <div className="bg-carbon-bronze text-carbon-gold text-sm py-0.5 px-2 rounded-full">
                    {(() => {
                        switch (known) {
                            case SiteType.UNKNOWN:
                                return (
                                    <Unknown
                                        className="inline-block mr-1 mb-px"
                                        width="14px"
                                        height="14px"
                                    />
                                );
                            case SiteType.KNOWN:
                                return (
                                    <Known
                                        className="inline-block mr-1 mb-px"
                                        width="14px"
                                        height="14px"
                                    />
                                );
                            case SiteType.ORIGIN:
                                return (
                                    <Heart
                                        className="inline-block mr-1 mb-px"
                                        width="14px"
                                        height="14px"
                                    />
                                );
                        }
                    }).call(this)}
                    {url}
                </div>
                <Button
                    variant="icon"
                    size="none"
                    aria-label="Carbon Voyage"
                    onClick={() => {
                        window.close();
                    }}
                >
                    <Close className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};

export default Topbar;
