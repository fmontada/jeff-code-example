import { render, screen } from '@testing-library/react';
import React from 'react';

import { Banner } from './Banner';
import { BannerTestIds } from './BannerTestIds';
import { BannerTypes } from './BannerTypes';

describe('Banner', (): void => {
    const BANNER_CONTENT = 'TEST CONTENT';

    it('renders a success banner', (): void => {
        render(<Banner type={BannerTypes.SUCCESS}>{BANNER_CONTENT}</Banner>);

        const successBannerElement: HTMLElement = screen.queryByTestId(
            BannerTestIds.BANNER_CONTAINER,
        );

        expect(successBannerElement).toBeInTheDocument();
        expect(successBannerElement).toHaveTextContent(BANNER_CONTENT);
        expect(successBannerElement).toHaveClass('bg-green-500');
    });

    it('renders a warning banner', (): void => {
        render(<Banner type={BannerTypes.WARNING}>{BANNER_CONTENT}</Banner>);

        const warningBannerElement: HTMLElement = screen.queryByTestId(
            BannerTestIds.BANNER_CONTAINER,
        );

        expect(warningBannerElement).toBeInTheDocument();
        expect(warningBannerElement).toHaveTextContent(BANNER_CONTENT);
        expect(warningBannerElement).toHaveClass('bg-yellow-500');
    });

    it('renders an error banner', (): void => {
        render(<Banner type={BannerTypes.ERROR}>{BANNER_CONTENT}</Banner>);

        const errorBannerElement: HTMLElement = screen.queryByTestId(
            BannerTestIds.BANNER_CONTAINER,
        );

        expect(errorBannerElement).toBeInTheDocument();
        expect(errorBannerElement).toHaveTextContent(BANNER_CONTENT);
        expect(errorBannerElement).toHaveClass('bg-red-500');
    });

    it('renders a banner with a custom className', (): void => {
        render(
            <Banner
                className="BANNER_MOCK_CUSTOM_CLASS"
                type={BannerTypes.ERROR}
            >
                {BANNER_CONTENT}
            </Banner>,
        );

        const customBannerElement: HTMLElement = screen.queryByTestId(
            BannerTestIds.BANNER_CONTAINER,
        );

        expect(customBannerElement).toBeInTheDocument();
        expect(customBannerElement).toHaveClass('BANNER_MOCK_CUSTOM_CLASS');
    });

    it('renders a banner with a custom data-testid', (): void => {
        render(
            <Banner data-testid="BANNER_MOCK_TEST_ID" type={BannerTypes.ERROR}>
                {BANNER_CONTENT}
            </Banner>,
        );

        const customBannerElement: HTMLElement = screen.queryByTestId(
            'BANNER_MOCK_TEST_ID',
        );

        expect(customBannerElement).toBeInTheDocument();
    });
});
