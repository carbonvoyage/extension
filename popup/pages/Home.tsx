import React, { useEffect } from "react";
import browser from "webextension-polyfill";
import Skeleton from "react-loading-skeleton";

import Card from "../../components/Card";
import { External } from "../../assets/icons";
import { Charity } from "../types";
import {
    EVERYORG_IMAGE_URL,
    EVERYORG_IMAGE_OPTIONS,
    LIGHT_SKELETON_THEME,
} from "../constants";

const Home = () => {
    const [charity, setCharity] = React.useState<Charity>();
    const [toggleLoading, setToggleLoading] = React.useState<boolean>(false);
    const fakeData = [
        {
            id: 1,
            title: "Apple Seeds",
            price: 1.99,
            image: "",
        },
        {
            id: 2,
            title: "Garden Hose",
            price: 19.99,
            image: "",
        },
        {
            id: 3,
            title: "Garden Trowel",
            price: 9.99,
            image: "",
        },
    ];

    useEffect(() => {
        browser.runtime
            .sendMessage({ action: "getCharity", value: "carbonplan" })
            .then((response) => {
                // Limit name length
                if (
                    response.charity.name &&
                    response.charity.name.length > 14
                ) {
                    response.charity.name = response.charity.name.slice(0, 14);
                    response.charity.name = response.charity.name.trim();
                    response.charity.name += "...";
                }

                // Clean up websiteUrl
                if (response.charity.websiteUrl) {
                    const url = new URL(response.charity.websiteUrl);
                    response.charity.websiteUrl = url.hostname.replace(
                        "www.",
                        ""
                    );
                }

                if (toggleLoading) {
                    setCharity(undefined);
                    return;
                }

                setCharity(response.charity);
            });
    }, [toggleLoading]);

    return (
        <>
            {/* <button
                onClick={() => {
                    setToggleLoading(!toggleLoading);
                }}
            >
                Toggle Load
            </button> */}
            <div className="flex flex-row gap-4 my-4">
                <div className="flex flex-col justify-center">
                    <div className="relative w-16 h-16 border border-carbon-bronze/20 bg-carbon-gold overflow-hidden rounded-full">
                        {!charity ? (
                            <Skeleton
                                className="absolute top-0"
                                height={64}
                                width={64}
                            />
                        ) : (
                            <img
                                className="w-full h-full object-cover"
                                src={`${EVERYORG_IMAGE_URL}${EVERYORG_IMAGE_OPTIONS}${charity.logoCloudinaryId}`}
                                alt={charity.name}
                            />
                        )}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <p className="text-sm">
                        {charity ? (
                            "Selected Charity"
                        ) : (
                            <Skeleton width={100} />
                        )}
                    </p>
                    <h1 className="font-display text-2xl -mb-1">
                        {charity?.name ? (
                            charity.name
                        ) : (
                            <Skeleton width={160} />
                        )}
                    </h1>
                    <button
                        className="underline text-left cursor-pointer"
                        onClick={() => {
                            browser.tabs.create({
                                url: charity?.websiteUrl,
                            });
                        }}
                    >
                        {charity?.websiteUrl ? (
                            charity.websiteUrl
                        ) : (
                            <Skeleton width={120} />
                        )}
                    </button>
                </div>
            </div>
            <p className="mb-2">
                {charity ? "Your offset summary." : <Skeleton width={154} />}
            </p>
            <div className="bg-carbon-white border border-carbon-bronze/20 text-center rounded-xl p-4 mb-6">
                <div className="flex flex-row -mx-2 divide-x divide-carbon-bronze/20">
                    <div className="basis-1/2 flex flex-col justify-center px-2">
                        <p className="text-sm">
                            {charity ? (
                                "This Month"
                            ) : (
                                <Skeleton
                                    {...LIGHT_SKELETON_THEME}
                                    width={60}
                                />
                            )}
                        </p>
                        <h1 className="font-display text-2xl">
                            {charity ? (
                                "$20.23"
                            ) : (
                                <Skeleton
                                    {...LIGHT_SKELETON_THEME}
                                    width={80}
                                />
                            )}
                        </h1>
                    </div>
                    <div className="basis-1/2 flex flex-col justify-center px-2">
                        <p className="text-sm">
                            {charity ? (
                                "This Year"
                            ) : (
                                <Skeleton
                                    {...LIGHT_SKELETON_THEME}
                                    width={60}
                                />
                            )}
                        </p>
                        <h1 className="font-display text-2xl">
                            {charity ? (
                                "$420.23"
                            ) : (
                                <Skeleton
                                    {...LIGHT_SKELETON_THEME}
                                    width={80}
                                />
                            )}
                        </h1>
                    </div>
                </div>
            </div>
            <div>
                <h1 className="text-2xl font-display mt-6">
                    {charity ? "Your Voyage" : <Skeleton width={144} />}
                </h1>
                <p className="font-body mb-2">
                    {charity ? (
                        "Latest carbon offset activity."
                    ) : (
                        <Skeleton width={216} />
                    )}
                </p>
                <div className="bg-carbon-white border border-carbon-bronze/20 rounded-xl p-2 mb-6">
                    <div className="flex flex-col -my-2 divide-y divide-carbon-bronze/20">
                        {charity ? (
                            fakeData.map((item) => (
                                <Card
                                    key={item.id}
                                    HoverIcon={External}
                                    image={{
                                        src: item.image,
                                        alt: item.title,
                                        shape: "square",
                                    }}
                                >
                                    <h1>{item.title}</h1>
                                    <p className="text-sm text-carbon-bronze/50">
                                        ${item.price}
                                    </p>
                                </Card>
                            ))
                        ) : (
                            <>
                                {/* TODO: Make this look nicer */}
                                {["", "", ""].map((_, index) => (
                                    <Card
                                        key={index}
                                        loading
                                        hover={false}
                                        image={{
                                            shape: "square",
                                        }}
                                    >
                                        <h1>
                                            <Skeleton
                                                {...LIGHT_SKELETON_THEME}
                                                width={110}
                                            />
                                        </h1>
                                        <p className="text-sm text-carbon-bronze/50">
                                            <Skeleton
                                                {...LIGHT_SKELETON_THEME}
                                                width={54}
                                            />
                                        </p>
                                    </Card>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
