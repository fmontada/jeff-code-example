export interface IStrapiSweepstake {
    id: number;
    attributes: IStrapiSweepstakeAttributes;
}

export interface IStrapiSweepstakeAttributes {
    slug: string;
    heroImage: IHeroImage;
    heroImageMobile: IHeroImage;
    details: IDetails;
    prizeDetailsTitle: string;
    prizeDetails: IPrizeDetails[];
    charityInfo: ICharityInfo;
    subprizes: ISubprizes[];
    winnerPendingTitle: any;
    winnerAnnounceTitle: any;
    winnerInfo?: IWinnerInfo;
    donationVariantsTitle: string;
    rules: string;
    impact: IImpactInfo;
    localizations: ILocalizations;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
}

export interface IDetails {
    id: number;
    detailsSupport: string;
    detailsTitle: string;
    detailsBodyText: string;
    detailsLegalText: string;
}

export interface IPrizeDetails {
    id: number;
    prizeDetailsSubtitle?: string;
    prizeDetailsBody: string;
    prizeDetailsImage: IImage;
    prizeDetailsYoutubeLink?: string;
}

export interface ICharityInfo {
    id: number;
    charityDetailsTitle: string;
    charityDetailsBody: string;
    charityDetailsLegalText: string;
    charityDetailsCharityLogo: IImage;
    charityDetailsImage: IImage;
}

export interface ISubprizes {
    id: number;
    apiId: string;
    slug: string;
    imageAlt: string;
    title: string;
    winnerName: string;
    winnerLocation: string;
    image: IImage;
}

export interface IWinnerInfo {
    id: number;
    winnerName: string;
    winnerLocation: string;
    winnerImageAlt: string;
    winnerImage: IImage;
    winnerQuote?: string;
    winnerYoutubeLink: string;
}

export interface IImpactInfo {
    totalAmountRaised: string;
    winDetails: string;
}

export interface ILocalizations {
    data: any[];
}

export interface IImage {
    data: {
        id: number;
        attributes: {
            name: string;
            alternativeText: string;
            caption: string;
            width: number;
            height: number;
            formats: {
                thumbnail?: IImageFormatData;
                small?: IImageFormatData;
                medium?: IImageFormatData;
                large?: IImageFormatData;
            };
            hash: string;
            ext: string;
            mime: string;
            size: number;
            url: string;
            previewUrl?: any;
            provider: string;
            provider_metadata?: any;
            createdAt: string;
            updatedAt: string;
        };
    };
}

export interface IImageFormatData {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    path: string;
    size: number;
    width: number;
    height: number;
}

export interface IHeroImage {
    data: IHeroImageData[];
}

export interface IHeroImageData {
    id: number;
    attributes: IHeroImageAttributes;
}

export interface IHeroImageAttributes {
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    formats: {
        thumbnail?: IImageFormatData;
        small?: IImageFormatData;
        medium?: IImageFormatData;
        large?: IImageFormatData;
    };
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl?: any;
    provider: string;
    provider_metadata?: any;
    createdAt: string;
    updatedAt: string;
}
