import {
    CacheLocation,
    Auth0Provider as _Auth0Provider,
} from '@auth0/auth0-react';
import { IParentProps } from '@omaze/omaze-ui/dist/shared/types/IParentProps';
import { useRouter } from 'next/router';

import { useUserStore } from '@/store/useUserStore';

import { extractEmail } from './extractEmail';

export function Auth0Provider(props: IParentProps) {
    const { children }: any = props;

    const router = useRouter();
    const errorDescription: string = router.query?.error_description as string;
    const setUserStore = useUserStore((store) => store.set);

    if (
        router.query?.error === 'access_denied' &&
        errorDescription.includes('Please verify your email before logging in')
    ) {
        router.push(
            `/create-account-message?email=${extractEmail(errorDescription)}`,
        );
    }

    function onRedirectCallback() {
        router.replace(router.pathname, undefined, { shallow: true });
        setUserStore((store) => {
            store.fromAuth = true;
        });
    }

    const redirectUri =
        typeof window !== 'undefined'
            ? `${window.location.origin}/account`
            : undefined;

    return (
        <_Auth0Provider
            domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN}
            clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}
            redirectUri={redirectUri}
            cacheLocation={
                process.env.NEXT_PUBLIC_AUTH0_CACHE_LOCATION as CacheLocation
            }
            onRedirectCallback={onRedirectCallback}
            audience={process.env.NEXT_PUBLIC_AUTH0_AUDIENCE}
        >
            {children}
        </_Auth0Provider>
    );
}
