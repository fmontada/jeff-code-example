import { render, screen } from '@testing-library/react';
import React from 'react';

import { MaintenanceModeProvider } from './MaintenanceModeProvider';

describe('MaintenanceModeProvider', (): void => {
    const DUMMY_TEXT = 'test';
    const DUMMY_COMPONENT = <div>{DUMMY_TEXT}</div>;

    describe('on maintenance mode', () => {
        const beforeEnv = process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED;

        beforeAll(() => {
            process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED = '1';
        });

        afterAll(() => {
            process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED = beforeEnv;
        });

        it('renders the maintenance mode page', async (): Promise<void> => {
            render(
                <MaintenanceModeProvider>
                    {DUMMY_COMPONENT}
                </MaintenanceModeProvider>,
            );

            expect(
                screen.getByText('en-US error.maintenance.title'),
            ).toBeInTheDocument();
            expect(
                screen.getByText('en-US error.maintenance.explanation'),
            ).toBeInTheDocument();
            expect(screen.queryByText(DUMMY_TEXT)).not.toBeInTheDocument();
        });
    });

    describe('on maintenance mode', () => {
        const beforeEnv = process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED;

        beforeAll(() => {
            process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED = '0';
        });

        afterAll(() => {
            process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED = beforeEnv;
        });

        it('renders the child component', async (): Promise<void> => {
            render(
                <MaintenanceModeProvider>
                    {DUMMY_COMPONENT}
                </MaintenanceModeProvider>,
            );

            expect(
                screen.queryByText('Maintenance Mode'),
            ).not.toBeInTheDocument();
            expect(screen.getByText(DUMMY_TEXT)).toBeInTheDocument();
        });
    });
});
