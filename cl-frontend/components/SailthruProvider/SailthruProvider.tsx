import { useAuth0 } from '@auth0/auth0-react';
import { ReactElement, useEffect } from 'react';
import shallow from 'zustand/shallow';

import { SAILTHRU_ACTIONS, SAILTHRU_WEB_SOURCE } from '@/constants/sailthru';
import { useAppStore } from '@/store/useAppStore';
import { isUserAllowingTracking } from '@/utils/onetrust';

export function SailthruProvider({ children }): ReactElement {
    const [sailthru, setAppStore] = useAppStore(
        (store) => [store.sailthru, store.set],
        shallow,
    );
    const { user } = useAuth0();

    async function isSailthruLoaded() {
        const isLoaded = !!window.Sailthru;
        let attempts = 0;

        while (!isLoaded && attempts < 10) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            attempts++;
        }

        return isLoaded;
    }

    useEffect(() => {
        async function fetchSailthru() {
            const isLoaded = await isSailthruLoaded();

            if (!isLoaded) {
                console.error('Unable to load Sailthru');
                return;
            }

            setAppStore((appStore) => {
                appStore.sailthru = window.Sailthru;
            });
        }

        fetchSailthru();
    }, []);

    useEffect(() => {
        if (!sailthru || !user?.email || !isUserAllowingTracking()) {
            return;
        }

        sailthru.integration(SAILTHRU_ACTIONS.USER_SIGN_UP, {
            email: user.email,
            source: SAILTHRU_WEB_SOURCE,
        });
    }, [sailthru, user?.email]);

    return children;
}
