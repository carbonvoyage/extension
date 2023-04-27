interface UpdateMessage {
    action: "updateIcon";
    value: string;
}

interface GetMessage {
    action:
        | "getSession"
        | "getUser"
        | "getSelectedCharity"
        | "getTransactions"
        | "getEveryOrgCharities";
    value: null;
}

interface GetMessageBy {
    action: "getEveryOrgCharity" | "updateSelectedCharity";
    value: string;
}

interface UpdateMessageBy {
    action: "updateSelectedCharity";
    value: {
        name: string;
        slug: string;
    };
}

export type Message =
    | UpdateMessage
    | GetMessage
    | GetMessageBy
    | UpdateMessageBy;

export type ResponseCallback = (data: any) => void;
