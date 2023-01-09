import { render, screen } from '@testing-library/react';
import { ReactElement } from 'react';

import {
    PlasmicPage,
    SweepstakeIndexPageTestIds,
} from '@/components/PlasmicPage';
import { muteConsole } from '@/mocks/muteConsole';

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
        }: {
            children: Array<ReactElement>;
        }) => {
            return <>{children}</>;
        },
    };
});

describe('SweepstakesIndex', () => {
    describe('a valid sweepstake home page', () => {
        beforeAll(muteConsole);

        beforeEach(() => {
            render(
                <PlasmicPage
                    isSweepstakesIndex={true}
                    plasmicData={{
                        bundle: null,
                        remoteFontUrls: [],
                        entryCompMetas: [
                            {
                                id: '123',
                                usedComponents: [],
                                projectId: '123',
                                name: 'SweepstakesIndex',
                                displayName: 'SweepstakesIndex',
                                path: 'SweepstakesIndex',
                                cssFile: null,
                                isPage: true,
                                isCode: true,
                                entry: null,
                                isGlobalContextProvider: false,
                            },
                        ],
                    }}
                    queryCache={null}
                    filter={null}
                />,
            );
        });

        it('renders a container with plasmic data', () => {
            const container = screen.getByTestId(
                SweepstakeIndexPageTestIds.SWEEPSTAKE_INDEX_PAGE_CONTAINER,
            );
            expect(container).toBeInTheDocument();
        });

        it('renders a page with a title like the sweepstake one', () => {
            expect(document.title).toBe('Omaze en-US sweepstakes.seoTitle');
        });
    });
});
