import { render, screen } from '@testing-library/react';
import React from 'react';

import { ExperiencesHeader } from './ExperiencesHeader';
import { ExperiencesHeaderTestIds } from './ExperiencesHeaderTestIds';

describe('ExperiencesHeader', (): void => {
    it('renders the component and its container', (): void => {
        render(<ExperiencesHeader name={'FirstName LastName'} />);

        const experiencesHeaderContainer: HTMLElement = screen.getByTestId(
            ExperiencesHeaderTestIds.EXPERIENCES_HEADER_CONTAINER,
        );
        expect(experiencesHeaderContainer).toBeInTheDocument();
        expect(experiencesHeaderContainer.querySelector('p')).toHaveTextContent(
            'FL',
        );

        const welcomeContainer: HTMLElement = screen.getByTestId(
            ExperiencesHeaderTestIds.EXPERIENCES_HEADER_WELCOME_CONTAINER,
        );
        expect(welcomeContainer).toHaveTextContent(
            'en-US account.experience.header',
        );
    });
});
