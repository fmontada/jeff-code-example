import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import React from 'react';

import { GeoLocationProvider } from './GeoLocationProvider';
import { GeoLocationProviderTestIds } from './GeoLocationProviderTestIds';

jest.mock('axios');

jest.mock('next/router', () => ({
    useRouter: () => {
        return {
            asPath: '/',
        };
    },
}));

describe('GeoLocationProvider', (): void => {
    const DUMMY_TEXT = 'test';
    const DUMMY_COMPONENT = <div>{DUMMY_TEXT}</div>;

    const listBeforeTest = process.env.NEXT_PUBLIC_RESTRICTED_REGIONS_LIST;
    const routesBeforeTest = process.env.NEXT_PUBLIC_ROUTES_GEO_DISABLED_LIST;

    beforeAll((): void => {
        process.env.NEXT_PUBLIC_RESTRICTED_REGIONS_LIST = 'FL';
        process.env.NEXT_PUBLIC_ROUTES_GEO_DISABLED_LIST = '/plasmic-host';
    });

    afterAll(() => {
        process.env.NEXT_PUBLIC_RESTRICTED_REGIONS_LIST = listBeforeTest;
        process.env.NEXT_PUBLIC_ROUTES_GEO_DISABLED_LIST = routesBeforeTest;
    });

    it('hides the modal if user is from a restricted region', async (): Promise<void> => {
        (axios as unknown as any).get.mockResolvedValue({
            data: {
                region: 'FL',
            },
        });

        render(<GeoLocationProvider>{DUMMY_COMPONENT}</GeoLocationProvider>);

        const geoLocationModal = await waitFor(() =>
            screen.queryByTestId(GeoLocationProviderTestIds.GEO_LOCATION_MODAL),
        );

        expect(geoLocationModal).not.toBeInTheDocument();
        expect(screen.getByText(DUMMY_TEXT)).toBeInTheDocument();
    });

    it('shows the modal if user is not from a restricted region', async (): Promise<void> => {
        (axios as unknown as any).get.mockResolvedValue({
            data: {
                region: 'CA',
            },
        });

        render(<GeoLocationProvider>{DUMMY_COMPONENT}</GeoLocationProvider>);

        const geoLocationModal = await waitFor(() =>
            screen.getByTestId(GeoLocationProviderTestIds.GEO_LOCATION_MODAL),
        );

        expect(geoLocationModal).toBeInTheDocument();
        expect(screen.getByText(DUMMY_TEXT)).toBeInTheDocument();
    });
});
