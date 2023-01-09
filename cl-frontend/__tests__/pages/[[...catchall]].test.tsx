import { render, screen } from '@testing-library/react';

import { CatchallPageTestIds } from '@/components/PlasmicPage/PlasmicPage';
import { muteConsole } from '@/mocks/muteConsole';
import { default as CatchAllPage } from '@/pages/[[...catchall]]';

describe('CatchAllPage', () => {
    beforeEach(() => {
        muteConsole();
    });

    it('renders a container with plasmic data', () => {
        render(
            <CatchAllPage
                isSweepstakeDetail={false}
                isSweepstakesIndex={false}
                plasmicData={{
                    bundle: {
                        modules: {
                            browser: [],
                            server: [],
                        },
                        external: [],
                        components: [],
                        globalGroups: [],
                        projects: [],
                        activeSplits: [],
                    },
                    entryCompMetas: [
                        {
                            id: '',
                            usedComponents: [],
                            projectId: '',
                            name: '',
                            displayName: '',
                            cssFile: '',
                            isGlobalContextProvider: true,
                            isPage: true,
                            path: '',
                            entry: '',
                            isCode: false,
                        },
                    ],
                    remoteFontUrls: [],
                }}
                sweepstakes={[]}
            />,
        );

        const container = screen.getByTestId(
            CatchallPageTestIds.CATCH_ALL_PAGE_CONTAINER,
        );
        expect(container).toBeInTheDocument();
    });

    it('renders a 404 page when there is no plasmic data', () => {
        render(
            <CatchAllPage
                isSweepstakesIndex={false}
                isSweepstakeDetail={false}
                plasmicData={undefined}
                sweepstakes={[]}
            />,
        );

        const notFoundText = screen.getByText('This page could not be found.');
        expect(notFoundText).toBeInTheDocument();

        const container = screen.queryByTestId(
            CatchallPageTestIds.CATCH_ALL_PAGE_CONTAINER,
        );
        expect(container).not.toBeInTheDocument();
    });
});
