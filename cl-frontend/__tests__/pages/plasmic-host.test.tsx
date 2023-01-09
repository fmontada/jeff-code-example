import { render } from '@testing-library/react';

import PlasmicHostPage from '@/pages/plasmic-host';

describe('PlasmicHostPage', () => {
    it('renders a plasmic host page', () => {
        render(<PlasmicHostPage />);

        expect(document.querySelector('iframe')).toBeInTheDocument();
        expect(document.querySelector('iframe').getAttribute('src')).toContain(
            'plasmic.app',
        );
    });
});
