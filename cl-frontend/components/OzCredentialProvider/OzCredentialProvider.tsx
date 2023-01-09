import { ComponentMeta, GlobalContextMeta } from '@plasmicapp/host';
import { usePlasmicQueryData } from '@plasmicapp/query';
import React, { ReactNode, createContext, useContext } from 'react';

import { Sweepstakes } from '@/api/sweepstakes';
import { SweepstakeContext } from '@/store/context';
import { fetchJson } from '@/utils/fetchJson';
import { ensure } from '@/utils/validators';

import { WrapIfI18NextProvider } from './I18nProvider';

export interface IOzCredentialsProviderProps {
    host?: string;
}

const CredentialsContext = createContext<
    IOzCredentialsProviderProps | undefined
>(undefined);

export function OzCredentialsProvider({
    host,
    children,
}: React.PropsWithChildren<IOzCredentialsProviderProps>) {
    return (
        <CredentialsContext.Provider value={{ host }}>
            {children}
        </CredentialsContext.Provider>
    );
}

export const OzCredentialsProviderMeta: GlobalContextMeta<IOzCredentialsProviderProps> =
    {
        name: 'OzCredentialsProvider',
        displayName: 'Omaze Credentials Provider',
        description: '',
        importPath: '',
        props: {
            host: {
                type: 'string',
                displayName: 'Host',
                defaultValueHint:
                    'https://cl-public-sweeps-api.qa.omazedev.com',
                defaultValue: 'https://cl-public-sweeps-api.qa.omazedev.com',
                description: 'Server where you application is hosted.',
            },
        },
    };

const SWEEPSTAKE_CACHE_KEY: string = 'OZ_SWEEPSTAKE_CACHE_KEY';

interface IOzDataLoaderProps {
    slug?: string;
    children?: ReactNode;
    sweepstakeData?: Sweepstakes;
    noI18n?: boolean;
}

export const OzDataLoaderMeta: ComponentMeta<IOzDataLoaderProps> = {
    name: 'OzDataLoader',
    displayName: 'Omaze Data Loader',
    importName: 'OzDataLoader',
    importPath: '',
    providesData: true,
    props: {
        children: {
            type: 'slot',
        },
        slug: {
            type: 'string',
            displayName: 'Slug',
            description: 'Name of the slug to be fetched.',
            defaultValueHint: 'win-50-gift-card',
        },
        noI18n: {
            type: 'boolean',
            displayName: 'No i18n',
            description: '',
            defaultValue: false,
        },
    },
};

export function OzDataLoader({
    slug,
    noI18n = false,
    sweepstakeData,
    children,
}: IOzDataLoaderProps) {
    const creds = ensure(useContext(CredentialsContext));

    const cacheKey = JSON.stringify({
        SWEEPSTAKE_CACHE_KEY,
        slug,
    });

    const data = usePlasmicQueryData<Sweepstakes>(cacheKey, async () => {
        if (sweepstakeData) {
            return sweepstakeData;
        }

        const { sweepstakes } = await fetchJson<{
            sweepstakes: Sweepstakes[];
        }>(`${creds.host}/v1/sweepstakes?slug=${slug}`);
        return sweepstakes?.[0];
    });

    if (!data?.data) {
        return <div>Please configure the OzLoader with a valid host.</div>;
    }

    sweepstakeData = data.data;

    return (
        <SweepstakeContext.Provider value={{ sweepstakeData }}>
            <WrapIfI18NextProvider wrap={noI18n}>
                {children}
            </WrapIfI18NextProvider>
        </SweepstakeContext.Provider>
    );
}
