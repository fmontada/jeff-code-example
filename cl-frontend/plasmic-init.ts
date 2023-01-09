import { OzDivider, OzLogo } from '@omaze/omaze-ui';
import { initPlasmicLoader } from '@plasmicapp/loader-nextjs';

import { CharityDetails } from '@/components/CharityDetails';
import { DonationVariants } from '@/components/DonationVariants';
import { EnterNowButton } from '@/components/EnterNowButton';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { HeroImage } from '@/components/HeroImage';
import { HeroTitle } from '@/components/HeroTitle';
import { MeetOurWinners } from '@/components/MeetOurWinners';
import { MoreToWin } from '@/components/MoreToWin';
import {
    OzCredentialsProvider,
    OzCredentialsProviderMeta,
    OzDataLoader,
    OzDataLoaderMeta,
} from '@/components/OzCredentialProvider';
import { WrapperPrizeDetails } from '@/components/PrizeDetails';
import { SecondaryHeader } from '@/components/SecondaryHeader';
import { registerAll } from '@/components/Strapi';
import { SubprizeCarousel } from '@/components/SubprizeCarousel';
import { SubprizeHeader } from '@/components/SubprizeHeader';
import { SweepstakeDetails } from '@/components/SweepstakeDetails';
import { SweepstakeRules } from '@/components/SweepstakeRules';
import { WinnerDetails } from '@/components/WinnerDetails';
import { WinnerPending } from '@/components/WinnerPending';

export const PLASMIC = initPlasmicLoader({
    projects: [
        {
            id: process.env.NEXT_PUBLIC_PLASMIC_ID,
            token: process.env.NEXT_PUBLIC_PLASMIC_TOKEN,
            version: process.env.NEXT_PUBLIC_PLASMIC_TAG_VERSION,
        },
    ],
    // Fetches the latest revisions, whether or not they were unpublished!
    // Disable for production to ensure you render only published changes.
    preview:
        process.env.NODE_ENV !== 'production' &&
        process.env.NEXT_PUBLIC_PLASMIC_PREVIEW === 'true',
});

PLASMIC.registerComponent(Footer, {
    name: 'Footer',
    props: {
        className: 'string',
        'data-testid': 'string',
    },
    importName: 'Footer',
    importPath: '@/components/Footer',
});

PLASMIC.registerComponent(Header, {
    name: 'Header',
    props: {
        className: 'string',
        'data-testid': 'string',
    },
    importName: 'Header',
    importPath: '@/components/Header',
});

PLASMIC.registerComponent(HeroImage, {
    name: 'HeroImage',
    props: {
        className: 'string',
        'data-testid': 'string',
    },
    importName: 'HeroImage',
    importPath: '@/components/HeroImage',
});

PLASMIC.registerComponent(HeroTitle, {
    name: 'HeroTitle',
    props: {
        className: 'string',
        'data-testid': 'string',
    },
    importName: 'HeroTitle',
    importPath: '@/components/HeroTitle',
});

PLASMIC.registerComponent(SweepstakeDetails, {
    name: 'SweepstakeDetails',
    props: {
        className: 'string',
        'data-testid': 'string',
    },
    importName: 'SweepstakeDetails',
    importPath: '@/components/SweepstakeDetails',
});

PLASMIC.registerComponent(WrapperPrizeDetails, {
    name: 'PrizeDetails',
    props: {
        className: 'string',
        'data-testid': 'string',
    },
    importName: 'WrapperPrizeDetails',
    importPath: '@/components/WrapperPrizeDetails',
});

PLASMIC.registerComponent(CharityDetails, {
    name: 'CharityDetails',
    props: {
        className: 'string',
        children: 'slot',
    },
    importName: 'CharityDetails',
    importPath: '@/components/CharityDetails',
});

PLASMIC.registerComponent(DonationVariants, {
    name: 'DonationVariants',
    props: {
        className: 'string',
        'data-testid': 'string',
    },
    importName: 'DonationVariants',
    importPath: '@/components/DonationVariants',
});

PLASMIC.registerComponent(SweepstakeRules, {
    name: 'SweepstakeRules',
    props: {
        className: 'string',
        'data-testid': 'string',
    },
    importName: 'SweepstakeRules',
    importPath: '@/components/SweepstakeRules',
});

PLASMIC.registerComponent(OzDivider, {
    name: 'OzDivider',
    importName: 'OzDivider',
    importPath: '@omaze/omaze-ui',
    props: {
        className: 'string',
    },
});

PLASMIC.registerComponent(OzLogo, {
    name: 'OzLogo',
    importName: 'OzLogo',
    importPath: '@omaze/omaze-ui',
    props: {
        color: {
            type: 'number',
            options: [
                {
                    label: 'LIGHT',
                    value: 0,
                },
                {
                    label: 'DARK',
                    value: 1,
                },
            ],
        },
    },
});

PLASMIC.registerComponent(WinnerPending, {
    name: 'WinnerPending',
    props: {
        className: 'string',
        'data-testid': 'string',
        announcedDate: 'string',
    },
    importName: 'WinnerPending',
    importPath: '@/components/WinnerPending',
});

PLASMIC.registerComponent(WinnerDetails, {
    name: 'WinnerDetails',
    props: {
        className: 'string',
        'data-testid': 'string',
    },
    importName: 'WinnerDetails',
    importPath: '@/components/WinnerDetails',
});

PLASMIC.registerComponent(OzDataLoader, OzDataLoaderMeta);

PLASMIC.registerGlobalContext(OzCredentialsProvider, OzCredentialsProviderMeta);

PLASMIC.registerComponent(SubprizeHeader, {
    name: 'SubprizeHeader',
    props: {
        className: 'string',
        'data-testid': 'string',
    },
    importName: 'SubprizeHeader',
    importPath: '@/components/SubprizeHeader',
});

PLASMIC.registerComponent(SubprizeCarousel, {
    name: 'SubprizeCarousel',
    props: {
        className: 'string',
        'data-testid': 'string',
    },
    importName: 'SubprizeCarousel',
    importPath: '@/components/SubprizeCarousel',
});

PLASMIC.registerComponent(EnterNowButton, {
    name: 'EnterNowButton',
    props: {
        className: 'string',
        'data-testid': 'string',
        isSticky: 'boolean',
    },
    importName: 'EnterNowButton',
    importPath: '@/components/EnterNowButton',
});

PLASMIC.registerComponent(SecondaryHeader, {
    name: 'SecondaryHeader',
    props: {
        className: 'string',
        'data-testid': 'string',
    },
    importName: 'SecondaryHeader',
    importPath: '@/components/SecondaryHeader',
});

PLASMIC.registerComponent(MoreToWin, {
    name: 'MoreToWin',
    props: {
        className: 'string',
        'data-testid': 'string',
    },
    importName: 'MoreToWin',
    importPath: '@/components/MoreToWin',
});

PLASMIC.registerComponent(MeetOurWinners, {
    name: 'MeetOurWinners',
    props: {
        className: 'string',
        'data-testid': 'string',
    },
    importName: 'MeetOurWinners',
    importPath: '@/components/MeetOurWinners',
});

registerAll(PLASMIC);
