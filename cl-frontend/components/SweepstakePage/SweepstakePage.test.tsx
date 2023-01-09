import { render, screen } from '@testing-library/react';
import { ReactElement } from 'react';

import {
    SweepstakePage,
    SweepstakePageTestIds,
} from '@/components/SweepstakePage';
import { muteConsole } from '@/mocks/muteConsole';
import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';
import { MOCK_SWEEPSTAKE_DATA } from '@/mocks/sweepstakeData';

const addDataLayer = jest.spyOn(require('@/utils/gtm/main'), 'addDataLayer');

jest.mock('next/head', () => {
    return {
        __esModule: true,
        default: ({ children }: { children: Array<ReactElement> }) => {
            return <>{children}</>;
        },
    };
});

jest.mock('@plasmicapp/loader-nextjs', () => {
    return {
        ...jest.requireActual('@plasmicapp/loader-nextjs'),
        PlasmicComponent: ({ children }: { children: Array<ReactElement> }) => {
            return <>{children}</>;
        },
        PlasmicRootProvider: ({
            children,
            ...props
        }: {
            children: Array<ReactElement>;
            props: any;
        }) => {
            return (
                <div data-test="true" data-testid={props?.['data-testid']}>
                    {children}
                </div>
            );
        },
    };
});

describe('SweepstakeDetailPage', () => {
    beforeEach(() => {
        muteConsole();
    });

    describe('a valid sweepstake page', () => {
        beforeEach(() => {
            render(
                <SweepstakePage
                    plasmicData={null}
                    queryCache={null}
                    slug={MOCK_SWEEPSTAKE_DATA.slug}
                    strapiData={MOCK_STRAPI_SWEEPSTAKE}
                    sweepstakeData={MOCK_SWEEPSTAKE_DATA}
                />,
            );
        });

        it('renders a container with plasmic data', () => {
            const container = screen.getByTestId(
                SweepstakePageTestIds.SWEEPSTAKE_PAGE_PLASMIC_PROVIDER,
            );
            expect(container).toBeInTheDocument();
        });

        it('renders a page with a title like the CMS details one', () => {
            expect(document.title).toBe(
                MOCK_STRAPI_SWEEPSTAKE.attributes.details.detailsTitle,
            );
        });

        it('renders a page with a sailthru tags', () => {
            expect(
                document.getElementsByName('sailthru.title')[0],
            ).toHaveAttribute(
                'content',
                MOCK_STRAPI_SWEEPSTAKE.attributes.details.detailsTitle,
            );
            expect(
                document.getElementsByName('sailthru.description')[0],
            ).toHaveAttribute(
                'content',
                MOCK_STRAPI_SWEEPSTAKE.attributes.details.detailsSupport,
            );
            expect(
                document.getElementsByName('sailthru.image.full')[0],
            ).toHaveAttribute(
                'content',
                MOCK_STRAPI_SWEEPSTAKE.attributes.heroImage.data[0].attributes
                    .url,
            );
            expect(
                document.getElementsByName('sailthru.image.thumb')[0],
            ).toHaveAttribute(
                'content',
                MOCK_STRAPI_SWEEPSTAKE.attributes.heroImage.data[0].attributes
                    .previewUrl,
            );

            expect(
                document.getElementsByName('sailthru.tags')[0],
            ).toHaveAttribute(
                'content',
                `${MOCK_SWEEPSTAKE_DATA.primary_tag},${MOCK_SWEEPSTAKE_DATA.secondary_tag}`,
            );
        });

        it('calls gtm to mark a page view', () => {
            expect(addDataLayer).toHaveBeenCalledWith({
                dataLayer: {
                    ecommerce: null,
                },
            });

            expect(addDataLayer).toHaveBeenCalledWith({
                dataLayer: {
                    event: 'view_item',
                    ecommerce: {
                        items: [
                            {
                                item_id: MOCK_SWEEPSTAKE_DATA.id,
                                item_name: MOCK_SWEEPSTAKE_DATA.title,
                                currency: 'USD',
                                discount: 0,
                                item_brand: 'Omaze',
                                item_category: 'Sweepstake',
                                item_variant:
                                    MOCK_SWEEPSTAKE_DATA.prices[0].external_id,
                                price: '10.00',
                                quantity: 1,
                            },
                        ],
                    },
                },
            });
        });
    });

    describe('an invalid sweepstake page', () => {
        beforeEach(() => {
            render(
                <SweepstakePage
                    plasmicData={null}
                    queryCache={null}
                    slug={MOCK_SWEEPSTAKE_DATA.slug}
                    strapiData={undefined}
                    sweepstakeData={undefined}
                />,
            );
        });

        it('renders no container with plasmic data', () => {
            const container = screen.queryByTestId(
                SweepstakePageTestIds.SWEEPSTAKE_PAGE_PLASMIC_PROVIDER,
            );
            expect(container).not.toBeInTheDocument();
        });

        it('renders no sweepstake title as the page title', () => {
            expect(document.title).not.toBe(MOCK_SWEEPSTAKE_DATA.title);
        });
    });
});
