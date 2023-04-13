export enum PageView {
    HOME,
    CHARITIES,
    ACCOUNT,
    OPTIONS,
}

export type Charity = {
    id: string;
    name: string;
    description: string;
    location: string;
    websiteUrl: string;
    logoUrl: string;
    logoCloudinaryId: string;
    coverImageUrl: string;
    profileUrl: string;
};
