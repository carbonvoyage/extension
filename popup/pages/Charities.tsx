import React, { useState, useEffect } from "react";
import browser from "webextension-polyfill";

import Card from "../../components/Card";
import { Charity } from "../types";
import { Check } from "../../assets/icons";
import { EVERYORG_IMAGE_URL, EVERYORG_IMAGE_OPTIONS } from "../constants";

const Charities = () => {
    const [charities, setCharities] = useState<Charity[]>();
    useEffect(() => {
        browser.runtime
            .sendMessage({ action: "getCharities" })
            .then((response) => {
                // Limit name and description length
                response.charities.forEach((charity: Charity) => {
                    if (charity.name && charity.name.length > 20) {
                        charity.name = charity.name.slice(0, 20);
                        charity.name = charity.name.trim();
                        charity.name += "...";
                    }

                    if (
                        charity.description &&
                        charity.description.length > 45
                    ) {
                        charity.description = charity.description.slice(0, 45);
                        charity.description = charity.description.trim();
                        charity.description += "...";
                    }

                    return charity;
                });
                setCharities(response.charities);
            });
    }, []);

    // TODO Add skeleton loading
    if (!charities) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div>
                <h1 className="text-2xl font-display mt-6">Charities</h1>
                <p className="font-body mb-6">Select a charity to support.</p>
            </div>
            <div className="bg-carbon-white border border-carbon-bronze/20 rounded-xl p-2 mb-6">
                <div className="flex flex-col -my-2 divide-y divide-carbon-bronze/20">
                    {charities.map((charity) => {
                        let linkText = charity.profileUrl.replace(
                            "https://www.",
                            ""
                        );
                        if (linkText.length > 20) {
                            linkText = linkText.slice(0, 20);
                            linkText = linkText.trim();
                            linkText += "...";
                        }

                        return (
                            <Card
                                key={charity.id}
                                HoverIcon={Check}
                                image={{
                                    src: `${EVERYORG_IMAGE_URL}${EVERYORG_IMAGE_OPTIONS}${charity.logoCloudinaryId}`,
                                    alt: charity.name,
                                    shape: "circle",
                                }}
                            >
                                <h1>{charity.name}</h1>
                                <button
                                    className="text-sm text-left cursor-pointer underline text-carbon-bronze/70"
                                    onClick={() => {
                                        browser.tabs.create({
                                            url: charity.profileUrl,
                                        });
                                    }}
                                >
                                    {linkText}
                                </button>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Charities;
