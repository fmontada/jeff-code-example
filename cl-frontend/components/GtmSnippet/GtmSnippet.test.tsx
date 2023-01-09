import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { GtmSnippet } from './GtmSnippet';

describe('GtmSnippet', (): void => {
    const oldValue = process.env.NEXT_PUBLIC_GTM_ID;

    beforeAll(() => {
        process.env.NEXT_PUBLIC_GTM_ID = 'GTM-1234567';
    });

    afterAll(() => {
        process.env.NEXT_PUBLIC_GTM_ID = oldValue;
    });

    it('renders the integration script', async (): Promise<void> => {
        render(<GtmSnippet />);

        await waitFor(() => {
            const scriptTags = Array.from(document.querySelectorAll('script'));
            const gtmTag = scriptTags.filter((scriptTag) => {
                return !!scriptTag.innerHTML.includes(
                    'https://www.googletagmanager.com/gtm.js',
                );
            });

            expect(gtmTag).toHaveLength(1);
        });
    });
});
