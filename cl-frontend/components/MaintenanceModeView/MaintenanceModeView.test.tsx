import { render, screen } from '@testing-library/react';
import React from 'react';

import { MaintenanceModeView } from './MaintenanceModeView';

describe('MaintenanceModeView', (): void => {
    describe('on custom maintenance mode message', () => {
        const customMessage = 'CUSTOM MAINTENANCE MESSAGE';
        const beforeEnv = process.env.NEXT_PUBLIC_MAINTENACE_MESSAGE;

        beforeAll(() => {
            process.env.NEXT_PUBLIC_MAINTENACE_MESSAGE = customMessage;
        });

        afterAll(() => {
            process.env.NEXT_PUBLIC_MAINTENACE_MESSAGE = beforeEnv;
        });

        it('renders the maintenance mode view', async (): Promise<void> => {
            render(<MaintenanceModeView />);

            expect(
                screen.getByText('en-US error.maintenance.title'),
            ).toBeInTheDocument();
            expect(
                screen.queryByText('en-US error.maintenance.explanation'),
            ).not.toBeInTheDocument();
            expect(screen.queryByText(customMessage)).toBeInTheDocument();
        });
    });

    describe('on custom maintenance mode message', () => {
        const beforeEnv = process.env.NEXT_PUBLIC_MAINTENACE_MESSAGE;

        beforeAll(() => {
            process.env.NEXT_PUBLIC_MAINTENACE_MESSAGE = '';
        });

        afterAll(() => {
            process.env.NEXT_PUBLIC_MAINTENACE_MESSAGE = beforeEnv;
        });

        it('renders the maintenance mode view with default message', async (): Promise<void> => {
            render(<MaintenanceModeView />);

            expect(
                screen.getByText('en-US error.maintenance.title'),
            ).toBeInTheDocument();
            expect(
                screen.getByText('en-US error.maintenance.explanation'),
            ).toBeInTheDocument();
        });
    });
});
