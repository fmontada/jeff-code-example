import { render, screen } from '@testing-library/react';
import React from 'react';

import { ExperiencesLinks } from './ExperiencesLinks';
import { ExperiencesLinksTestIds } from './ExperiencesLinksTestIds';

describe('ExperiencesLinks', (): void => {
    it('renders the component and its container', (): void => {
        render(<ExperiencesLinks />);

        const experiencesLinksContainer: HTMLElement = screen.getByTestId(
            ExperiencesLinksTestIds.EXPERIENCES_LINKS_CONTAINER,
        );
        expect(experiencesLinksContainer).toBeInTheDocument();

        const historyLink: HTMLElement = screen.getByTestId(
            ExperiencesLinksTestIds.EXPERIENCES_LINKS_HISTORY_LINK,
        );
        expect(historyLink).toHaveTextContent(
            'en-US account.donationHistory.title',
        );

        const settingsLink: HTMLElement = screen.getByTestId(
            ExperiencesLinksTestIds.EXPERIENCES_LINKS_SETTINGS_LINK,
        );
        expect(settingsLink).toHaveTextContent(
            'en-US account.settings.accountSettings',
        );
    });
});
