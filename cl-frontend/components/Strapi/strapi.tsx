// @ts-nocheck
import {
    ComponentMeta,
    DataProvider,
    GlobalContextMeta,
    repeatedElement,
    useSelector,
} from '@plasmicapp/host';
import { usePlasmicQueryData } from '@plasmicapp/query';
import L from 'lodash';
import React, { ReactNode, useContext } from 'react';
import ReactMarkdown from 'react-markdown';

export function ensure<T>(x: T | null | undefined): T {
    if (x === null || x === undefined) {
        throw new Error(`Value must not be undefined or null`);
    } else {
        return x;
    }
}

const modulePath = '@plasmicpkgs/plasmic-strapi';

const makeDataProviderName = (collection: string) =>
    `currentStrapi${L.capitalize(L.camelCase(collection))}Item`;

export interface StrapiCredentialsProviderProps {
    host?: string;
    token?: string;
}

const CredentialsContext = React.createContext<
    StrapiCredentialsProviderProps | undefined
>(undefined);

export const strapiCredentialsProviderMeta: GlobalContextMeta<StrapiCredentialsProviderProps> =
    {
        name: 'StrapiCredentialsProvider',
        displayName: 'Strapi Credentials Provider',
        description: `[Watch how to add Strapi data](https://www.youtube.com/watch?v=1SLoVY3hkQ4).

API token is needed only if data is not publicly readable.

Learn how to [get your API token](https://docs.strapi.io/user-docs/latest/settings/managing-global-settings.html#managing-api-tokens).`,
        importName: 'StrapiCredentialsProvider',
        importPath: modulePath,
        props: {
            host: {
                type: 'string',
                displayName: 'Host',
                defaultValueHint: 'https://strapi-plasmic.herokuapp.com',
                defaultValue: 'https://strapi-plasmic.herokuapp.com',
                description: 'Server where you application is hosted.',
            },
            token: {
                type: 'string',
                displayName: 'API Token',
                description:
                    'API Token (generated in http://yourhost/admin/settings/api-tokens) (or leave blank for unauthenticated usage).',
            },
        },
    };

export function StrapiCredentialsProvider({
    host,
    token,
    children,
}: React.PropsWithChildren<StrapiCredentialsProviderProps>) {
    host = host?.slice(-1) === '/' ? host.slice(0, -1) : host;
    return (
        <CredentialsContext.Provider value={{ host, token }}>
            {children}
        </CredentialsContext.Provider>
    );
}

interface StrapiCollectionProps {
    name?: string;
    filter?: string;
    children?: ReactNode;
    className?: string;
    noLayout?: boolean;
}

export const strapiCollectionMeta: ComponentMeta<StrapiCollectionProps> = {
    name: 'StrapiCollection',
    displayName: 'Strapi Collection',
    importName: 'StrapiCollection',
    importPath: modulePath,
    providesData: true,
    description:
        'Fetches Strapi data of a given collection and repeats content of children once for every row fetched.',
    defaultStyles: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gridRowGap: '8px',
        gridColumnGap: '8px',
        padding: '8px',
        maxWidth: '100%',
    },
    props: {
        children: {
            type: 'slot',
            defaultValue: {
                type: 'vbox',
                children: {
                    type: 'component',
                    name: 'StrapiField',
                },
            },
        },
        name: {
            type: 'string',
            displayName: 'Name',
            description: 'Name of the collection to be fetched.',
            defaultValueHint: 'restaurants',
        },
        filter: {
            type: 'string',
            displayName: 'Filter',
            description: 'Filter URL paremeter.',
            defaultValueHint: 'restaurants?filters[slug]=my-restaurant-slug',
        },
        noLayout: {
            type: 'boolean',
            displayName: 'No layout',
            description:
                'When set, Strapi Collection will not layout its children; instead, the layout set on its parent element will be used. Useful if you want to set flex gap or control container tag type.',
            defaultValue: false,
        },
    },
};

// https://docs.strapi.io/developer-docs/latest/guides/slug.html
function strapiQuery(
    host: string,
    name: string,
    propFilter: string | undefined,
    contextFilter: string | undefined,
): string {
    const baseUrl = `${host}/api/${name}`;

    if (propFilter) {
        return `${baseUrl}?${propFilter}`;
    }

    return `${baseUrl}?populate=*`;
}

export function StrapiCollection({
    name,
    filter,
    children,
    className,
    noLayout,
}: StrapiCollectionProps) {
    const creds = ensure(useContext(CredentialsContext));

    const query: string = strapiQuery(creds.host, name, filter);

    if (!creds.host) {
        return <div>Please specify a host.</div>;
    }

    const cacheKey = JSON.stringify({
        creds,
        name,
        query,
    });

    const data = usePlasmicQueryData<any[] | null>(cacheKey, async () => {
        if (!query) {
            return null;
        }

        const requestInit: any = { method: 'GET' };
        if (creds.token) {
            requestInit.headers = { Authorization: 'Bearer ' + creds.token };
        }

        const resp = await fetch(query, requestInit);
        return resp.json();
    });

    if (!data?.data) {
        return (
            <div>
                Please configure the Strapi provider with a valid host and
                token.
            </div>
        );
    }

    if (!L.get(data.data, ['data'])) {
        return <div>Please specify a valid collection.</div>;
    }

    let collection: any[] = L.get(data.data, ['data']);
    if (!Array.isArray(collection)) {
        collection = [collection];
    }

    const repElements = collection.map((item, index) => (
        <DataProvider
            key={item.id}
            name={'strapiItem'}
            data={item}
            hidden={true}
        >
            <DataProvider name={makeDataProviderName(name!)} data={item}>
                {repeatedElement(index, children)}
            </DataProvider>
        </DataProvider>
    ));

    return noLayout ? (
        <> {repElements} </>
    ) : (
        <div className={className}> {repElements} </div>
    );
}

interface StrapiFieldProps {
    className?: string;
    path?: string;
    setControlContextData?: (data: {
        fields: string[];
        isImage: boolean;
    }) => void;
    isMarkdown?: boolean;
}

export const strapiFieldMeta: ComponentMeta<StrapiFieldProps> = {
    name: 'StrapiField',
    displayName: 'Strapi Field',
    importName: 'StrapiField',
    importPath: modulePath,
    props: {
        path: {
            type: 'choice',
            options: (props, ctx) => {
                return ctx?.fields ?? [];
            },
            displayName: 'Field',
            description: 'Field name',
        },
        isMarkdown: {
            type: 'boolean',
            displayName: 'Markdown',
            description: 'Markdown Fields',
        },
    },
};

export function StrapiField({
    className,
    path,
    isMarkdown,
    setControlContextData,
}: StrapiFieldProps) {
    const item = useSelector('strapiItem');
    if (!item) {
        return <div>StrapiField must be used within a StrapiCollection</div>;
    }

    // Getting only fields that aren't objects
    const attributes = L.get(item, ['attributes']);
    const displayableFields = [];

    Object.keys(attributes).forEach((field) => {
        const value = attributes[field];

        if (typeof value === 'object') {
            if (value?.data?.attributes?.mime.startsWith('image')) {
                displayableFields.push(field);
                return;
            }

            L.keys(value).forEach((el) => {
                displayableFields.push(`${field}.${el}`);
            });

            return;
        }

        displayableFields.push(field);
    });

    setControlContextData?.({
        fields: displayableFields,
        isImage: false,
    });

    if (!path) {
        return <div>StrapiField must specify a field name.</div>;
    }

    const data = L.get(item, `attributes.${path}`);

    setControlContextData?.({
        fields: displayableFields,
        isImage: data?.data?.attributes?.mime.startsWith('image'),
    });

    if (!data) {
        return <div>Please specify a valid field name.</div>;
    } else if (data?.data?.attributes?.mime.startsWith('image')) {
        const creds = ensure(useContext(CredentialsContext));
        const attrs = data.data.attributes;
        const img_url = attrs.url.startsWith('http')
            ? attrs.url
            : creds.host + attrs.url;
        const img_width = attrs.width;
        const img_height = attrs.height;
        return (
            <img
                className={className}
                src={img_url}
                width={300}
                height={(300 * img_height) / img_width}
            />
        );
    } else {
        if (L.isObject(data)) {
            return <></>;
        } else if (isMarkdown) {
            return (
                <div className={className}>
                    <ReactMarkdown children={data} />
                </div>
            );
        }
        return <div className={className}>{data}</div>;
    }
}
