export interface Everyorg {
    data: Data;
}

export interface Data {
    nonprofit: Nonprofit;
    nonprofitTags: NonprofitTag[];
}

export interface Nonprofit {
    id: string;
    name: string;
    primarySlug: string;
    ein: string;
    isDisbursable: boolean;
    description: string;
    descriptionLong: string;
    locationAddress: string;
    nteeCode: string;
    nteeCodeMeaning: NteeCodeMeaning;
    websiteUrl: string;
    logoCloudinaryId: string;
    coverImageCloudinaryId: string;
    directDisbursement: boolean;
    hasAdmin: boolean;
    logoUrl: string;
    coverImageUrl: string;
    profileUrl: string;
}

export interface NteeCodeMeaning {
    majorCode: string;
    majorMeaning: string;
    decileCode: string;
    decileMeaning: string;
}

export interface NonprofitTag {
    id: string;
    tagName: string;
    causeCategory: string;
    title: string;
    tagImageCloudinaryId: string;
    tagUrl: string;
    tagImageUrl: string;
}
