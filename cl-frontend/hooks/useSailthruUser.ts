import axios from 'axios';
import { useEffect, useState } from 'react';

import { ISailthruUser } from '@/types/sailthru';

export function useSailthruUser(userEmail: string): ISailthruUser | null {
    const [sailthruUser, setSailthruUser] = useState<ISailthruUser | null>(
        null,
    );

    async function fetchSailthruUser() {
        try {
            const { data: userData } = await axios.get(
                '/api/sailthru/user?email=' + encodeURIComponent(userEmail),
            );

            setSailthruUser(userData);
        } catch (error) {
            setSailthruUser(null);
        }
    }

    useEffect(() => {
        if (!userEmail) {
            setSailthruUser(null);
            return;
        }

        fetchSailthruUser();
    }, [userEmail]);

    return sailthruUser;
}
