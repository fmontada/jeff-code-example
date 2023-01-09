import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { NewRelicSnippet } from './index';

describe('NewRelicSnippet', (): void => {
    it('renders the integration script', async (): Promise<void> => {
        render(<NewRelicSnippet />);

        await waitFor(() => {
            const scriptTags = Array.from(document.querySelectorAll('script'));
            const nreumTags = scriptTags.filter((scriptTag) => {
                return !!scriptTag.innerHTML.includes('NREUM');
            });

            expect(nreumTags).toHaveLength(1);
        });
    });
});
