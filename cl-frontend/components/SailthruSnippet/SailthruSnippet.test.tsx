import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { SailthruSnippet } from './index';

describe('SailthruSnippet', (): void => {
    it('renders the integration script', async (): Promise<void> => {
        render(<SailthruSnippet />);

        await waitFor(() => {
            const scriptTags = Array.from(document.querySelectorAll('script'));
            const sailthruTags = scriptTags.filter((scriptTag) => {
                return !!scriptTag.src.includes('ak.sail-horizon.com');
            });

            expect(sailthruTags).toHaveLength(1);
        });
    });
});
