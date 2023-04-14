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
    action: "getEveryOrgCharity";
    value: string;
}

export type Message = UpdateMessage | GetMessage | GetMessageBy;

export type ResponseCallback = (data: any) => void;
