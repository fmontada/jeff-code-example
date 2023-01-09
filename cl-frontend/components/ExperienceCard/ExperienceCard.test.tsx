import { render, screen } from '@testing-library/react';
import React from 'react';

import { SweepsStatus } from '@/api/sweepstakes';
import { ExperienceCard } from '@/components/ExperienceCard';
import { formatDateToLocalString } from '@/utils/formatDateToLocalString';

describe('ExperienceCard', (): void => {
    const imageFileName = 'image.jpg';
    const in7Days = new Date();
    in7Days.setDate(in7Days.getDate() + 7);

    beforeEach(() => {
        render(
            <ExperienceCard
                experience={{
                    sweepstake_id: 'bbf7feee-acdb-414e-a228-88618893795b',
                    image: `http://${imageFileName}`,
                    charity: 'Make-A-Wish',
                    description:
                        'Win This Multimillion-Dollar Miami Dream House',
                    entries: 12500,
                    closeDate: in7Days.toISOString(),
                    status: SweepsStatus.Open,
                }}
            />,
        );
    });

    it('renders days left', (): void => {
        expect(
            screen.getByText('en-US experiences.statuses.open'),
        ).toBeInTheDocument();
    });

    it('renders image alt text', (): void => {
        const imageElement = screen.getByAltText(
            'en-US experiences.experiencesAlt',
        ) as HTMLImageElement;
        expect(imageElement.src).toContain(imageFileName);
    });

    it('renders charity text', (): void => {
        expect(screen.getByText('Make-A-Wish')).toBeInTheDocument();
    });

    it('renders experience description', (): void => {
        expect(
            screen.getByText('Win This Multimillion-Dollar Miami Dream House'),
        ).toBeInTheDocument();
    });

    it('renders entries', (): void => {
        expect(screen.getByText('12,500')).toBeInTheDocument();
    });

    it('renders closes text', (): void => {
        expect(
            screen.getByText('en-US experiences.closesLabel'),
        ).toBeInTheDocument();
    });

    it('renders closed date', (): void => {
        expect(
            screen.getByText(formatDateToLocalString(in7Days.toISOString())),
        ).toBeInTheDocument();
    });
});
