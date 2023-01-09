import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { GtmNoScriptSnippet } from './GtmNoScriptSnippet';

describe('GtmNoScriptSnippet', (): void => {
    const oldValue = process.env.NEXT_PUBLIC_GTM_ID;
    const MOCK_GTM_ID = 'GTM-1234567';

    beforeAll(() => {
        process.env.NEXT_PUBLIC_GTM_ID = MOCK_GTM_ID;
    });

    afterAll(() => {
        process.env.NEXT_PUBLIC_GTM_ID = oldValue;
    });

    it('renders the integration script', async (): Promise<void> => {
        render(<GtmNoScriptSnippet />);

        await waitFor(() => {
            const noScriptTags = Array.from(
                document.querySelectorAll('noscript'),
            );
            const gtmNoScriptTag = noScriptTags.filter((scriptTag) => {
                return !!scriptTag.innerHTML.includes(
                    `https://www.googletagmanager.com/ns.html?id=${MOCK_GTM_ID}`,
                );
            });

            expect(gtmNoScriptTag).toHaveLength(1);
        });
    });
});
