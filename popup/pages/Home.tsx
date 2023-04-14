import React, { FunctionComponent, useEffect, useState } from "react";
import browser from "webextension-polyfill";
import Skeleton from "react-loading-skeleton";

import {
    getEveryOrgCharity,
    getTransactions,
    getSelectedCharity,
} from "../../utils";
import Card from "../../components/Card";
import { External } from "../../assets/icons";
import {
    EVERYORG_IMAGE_URL,
    EVERYORG_IMAGE_OPTIONS,
    LIGHT_SKELETON_THEME,
} from "../../constants";

import type { Database } from "../../types/supabase";
import type { Nonprofit as EveryOrgCharity } from "../../types/everyOrg";

type Charity = Database["public"]["Tables"]["charities"]["Row"];
type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

interface SummaryProps {
    charity?: Charity;
    everyOrgCharity?: EveryOrgCharity;
}

const Summary: FunctionComponent<SummaryProps> = ({
    charity,
    everyOrgCharity,
}) => {
    return (
        <>
            <div className="flex flex-row gap-4 my-4">
                <div className="flex flex-col justify-center">
                    <div className="relative w-16 h-16 border border-carbon-bronze/20 bg-carbon-gold overflow-hidden rounded-full">
                        {!everyOrgCharity ? (
                            <Skeleton
                                className="absolute top-0"
                                height={64}
                                width={64}
                            />
                        ) : (
                            <img
                                className="w-full h-full object-cover"
                                src={`${EVERYORG_IMAGE_URL}${EVERYORG_IMAGE_OPTIONS}${everyOrgCharity.logoCloudinaryId}`}
                                alt={everyOrgCharity.name}
                            />
                        )}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <p className="text-sm">
                        {everyOrgCharity ? (
                            "Selected Charity"
                        ) : (
                            <Skeleton width={100} />
                        )}
                    </p>
                    <h1 className="font-display text-2xl -mb-1">
                        {everyOrgCharity ? (
                            everyOrgCharity.name
                        ) : (
                            <Skeleton width={160} />
                        )}
                    </h1>
                    <button
                        className="underline text-left cursor-pointer"
                        onClick={() => {
                            browser.tabs.create({
                                url: everyOrgCharity?.websiteUrl,
                            });
                        }}
                    >
                        {everyOrgCharity ? (
                            everyOrgCharity.websiteUrl
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
                                `$${charity.total_donated}`
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
        </>
    );
};

interface TransactionsProps {
    transactions?: Transaction[];
}

const Transactions: FunctionComponent<TransactionsProps> = ({
    transactions,
}) => {
    const skeletons = Array.from({ length: 3 }, (_, i) => i);

    return (
        <>
            <h1 className="text-2xl font-display mt-6">
                {transactions ? "Your Voyage" : <Skeleton width={144} />}
            </h1>
            <p className="font-body mb-2">
                {transactions ? (
                    "Latest carbon offset activity."
                ) : (
                    <Skeleton width={216} />
                )}
            </p>
            <div className="bg-carbon-white border border-carbon-bronze/20 rounded-xl p-3 mb-6">
                <div className="flex flex-col -my-3 divide-y divide-carbon-bronze/20">
                    {transactions
                        ? transactions.map((item) => (
                              <Card
                                  key={item.id}
                                  HoverIcon={External}
                                  image={{
                                      shape: "square",
                                  }}
                              >
                                  <h1>
                                      Purchased on{" "}
                                      {(() => {
                                          if (!item.created_at) {
                                              return <></>;
                                          }

                                          const date = new Date(
                                              // TODO: Is required
                                              item.created_at
                                          );

                                          return (
                                              <>
                                                  {date.toLocaleDateString(
                                                      "en-US",
                                                      {
                                                          month: "short",
                                                      }
                                                  )}{" "}
                                                  {date.getDate()}
                                              </>
                                          );
                                      }).call(this)}
                                  </h1>
                                  <p className="text-sm text-carbon-bronze/50">
                                      Donated ${item.offset}.
                                      {/* TODO: Get actual charity. */}
                                      {/* {item.selected_charity}. */}
                                  </p>
                              </Card>
                          ))
                        : skeletons.map((index) => (
                              <Card
                                  key={index}
                                  loading
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
                </div>
            </div>
        </>
    );
};

const Home = () => {
    const [charity, setCharity] = useState<Charity>();
    const [everyOrgCharity, setEveryOrgCharity] = useState<EveryOrgCharity>();
    const [transactions, setTransactions] = useState<Transaction[]>();

    useEffect(() => {
        getSelectedCharity().then(async (selectedCharity) => {
            // TODO: Name should be required
            if (!selectedCharity.name) {
                return;
            }

            const everyOrgCharityRes = await getEveryOrgCharity(
                selectedCharity.name
            );
            const transactionsRes = await getTransactions();

            setCharity(selectedCharity);
            setEveryOrgCharity(everyOrgCharityRes);
            setTransactions(transactionsRes);
        });
    }, []);

    return (
        <>
            <Summary everyOrgCharity={everyOrgCharity} charity={charity} />
            <Transactions transactions={transactions} />
        </>
    );
};

export default Home;
