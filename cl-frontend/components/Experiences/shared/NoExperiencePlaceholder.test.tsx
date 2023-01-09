import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import {
    INoExperiencePlaceholderTestIds,
    NoExperiencesPlaceholder,
} from '@/components/Experiences/shared/NoExperiencesPlaceholder';

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

describe('NoExperiencesPlaceholder', (): void => {
    let push;
    beforeEach(() => {
        push = jest.fn();
        useRouter.mockImplementationOnce(() => ({
            query: {
                error: 'access_denied',
                error_description: 'Please verify your email before logging in',
            },
            push,
        }));
        render(<NoExperiencesPlaceholder />);
    });

    it('renders Nothing to see here text', (): void => {
        expect(
            screen.getByText('en-US experiences.nothingToSee'),
        ).toBeInTheDocument();
    });

    it('renders experience subtext', (): void => {
        expect(
            screen.getByText('en-US experiences.dontMissContext'),
        ).toBeInTheDocument();
    });

    describe('CTA', (): void => {
        it('renders', (): void => {
            expect(
                screen.getByTestId(
                    INoExperiencePlaceholderTestIds.NO_EXPERIENCE_CTA,
                ),
            ).toBeInTheDocument();
        });

        it('redirects to sweepstakes page', async (): Promise<void> => {
            const cta = screen.getByTestId(
                INoExperiencePlaceholderTestIds.NO_EXPERIENCE_CTA,
            );
            fireEvent.click(cta);

            await waitFor(() => {
                expect(push).toHaveBeenCalledWith('/sweepstakes');
            });
        });
    });
});
