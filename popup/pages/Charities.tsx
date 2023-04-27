import React, { useState, useEffect } from "react";
import browser from "webextension-polyfill";
import Skeleton from "react-loading-skeleton";

import Card from "../../components/Card";
import { Check } from "../../assets/icons";
import { getEveryOrgCharities, updateSelectedCharity } from "../../utils";
import {
    EVERYORG_IMAGE_URL,
    EVERYORG_IMAGE_OPTIONS,
    LIGHT_SKELETON_THEME,
} from "../../constants";

import type { Nonprofit as EveryOrgCharity } from "../../types/everyOrg";

const Charities = () => {
    const [charities, setCharities] = useState<EveryOrgCharity[]>();
    const skeletons = Array.from({ length: 10 }, (_, i) => i);

    useEffect(() => {
        getEveryOrgCharities().then((charities) => {
            setCharities(charities);
        });
    }, []);

    return (
        <>
            <div>
                <h1 className="text-2xl font-display mt-6">
                    {charities ? "Charities" : <Skeleton width={90} />}
                </h1>
                <p className="font-body mb-6">
                    {charities ? (
                        "Select a charity to support."
                    ) : (
                        <Skeleton width={200} />
                    )}
                </p>
            </div>
            <div className="bg-carbon-white border border-carbon-bronze/20 rounded-xl p-3 mb-6">
                <div className="flex flex-col -my-3 divide-y divide-carbon-bronze/20">
                    {charities
                        ? charities.map((charity) => {
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
                                      onClick={() => {
                                          updateSelectedCharity(
                                              charity.name,
                                              charity.slug
                                          );
                                      }}
                                      image={{
                                          src:
                                              charity.logoCloudinaryId &&
                                              `${EVERYORG_IMAGE_URL}${EVERYORG_IMAGE_OPTIONS}${charity.logoCloudinaryId}`,
                                          alt: charity.name,
                                          shape: "circle",
                                      }}
                                  >
                                      <h1 className="truncate w-48">
                                          {charity.name}
                                      </h1>
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
                          })
                        : skeletons.map((index) => (
                              <Card
                                  key={index}
                                  loading
                                  image={{
                                      shape: "circle",
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
                </div>
            </div>
        </>
    );
};

export default Charities;
