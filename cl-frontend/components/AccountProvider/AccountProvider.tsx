import { useAuth0 } from '@auth0/auth0-react';
import { PropsWithChildren, useEffect } from 'react';
import shallow from 'zustand/shallow';

import { useUserStore } from '@/store/useUserStore';
import { addDataLayer } from '@/utils/gtm/main';

export function AccountProvider(
    props: PropsWithChildren<Record<string, unknown>>,
): JSX.Element {
    const { children } = props;
    const { user, isAuthenticated, getAccessTokenSilently, error } = useAuth0();
    const [authorizationToken, set] = useUserStore(
        (store) => [store.authorizationToken, store.set],
        shallow,
    );

    useEffect(() => {
        const isUserLoggedIn = isAuthenticated && user && !error;
        if (!isUserLoggedIn) {
            set((store) => {
                store.authorizationToken = undefined;
            });
            return;
        }

        async function saveToken() {
            const token = await getAccessTokenSilently();
            set((store) => {
                store.authorizationToken = token;
            });
        }

        addDataLayer({ dataLayer: { userId: user.id } });

        void saveToken();
    }, [authorizationToken, isAuthenticated, getAccessTokenSilently, user]);

    return children as JSX.Element;
}
