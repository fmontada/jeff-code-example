import registerComponent, {
    ComponentMeta,
} from '@plasmicapp/host/registerComponent';
import registerGlobalContext from '@plasmicapp/host/registerGlobalContext';

import {
    StrapiCollection,
    StrapiCredentialsProvider,
    StrapiField,
    strapiCollectionMeta,
    strapiCredentialsProviderMeta,
    strapiFieldMeta,
} from './strapi';

export function registerAll(loader?: {
    registerComponent: typeof registerComponent;
    registerGlobalContext: typeof registerGlobalContext;
}) {
    const _registerComponent = <T extends React.ComponentType<any>>(
        Component: T,
        defaultMeta: ComponentMeta<React.ComponentProps<T>>,
    ) => {
        if (loader) {
            loader.registerComponent(Component, defaultMeta);
        } else {
            registerComponent(Component, defaultMeta);
        }
    };

    if (loader) {
        loader.registerGlobalContext(
            StrapiCredentialsProvider,
            strapiCredentialsProviderMeta,
        );
    } else {
        registerGlobalContext(
            StrapiCredentialsProvider,
            strapiCredentialsProviderMeta,
        );
    }

    _registerComponent(StrapiCollection, strapiCollectionMeta);
    _registerComponent(StrapiField, strapiFieldMeta);
}

export * from './strapi';
