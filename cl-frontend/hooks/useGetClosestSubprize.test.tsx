import { renderHook } from '@testing-library/react';

import { Sweepstakes } from '@/api/sweepstakes';
import { MOCK_STRAPI_SWEEPSTAKE } from '@/mocks/strapiSweepstake';
import { MOCK_SWEEPSTAKE_DATA } from '@/mocks/sweepstakeData';
import { IStrapiSweepstake } from '@/types/strapi';

import { useGetClosestSubprize } from './useGetClosestSubprize';

const mockedUseContext = jest.spyOn(require('react'), 'useContext');

const mockedUseSelector = jest.spyOn(
    require('@plasmicapp/host'),
    'useSelector',
);

describe('useGetClosestSubprize', (): void => {
    it('returns null if no sweepstake is available', (): void => {
        mockedUseSelector.mockImplementation(() => MOCK_STRAPI_SWEEPSTAKE);

        mockedUseContext.mockReturnValue({
            sweepstakeData: null,
        });

        const { result } = renderHook(() => useGetClosestSubprize());

        expect(result.current).toBeNull();
    });

    it('returns null if no active subprize is available', (): void => {
        mockedUseSelector.mockImplementation(() => MOCK_STRAPI_SWEEPSTAKE);

        const MOCKED_SWEEPSTAKE_DATA_WITH_NO_ACTIVE_SUBPRIZE: Sweepstakes = {
            ...MOCK_SWEEPSTAKE_DATA,
            subprizes: [
                {
                    ...MOCK_SWEEPSTAKE_DATA.subprizes[0],
                    close_date: new Date('2020-01-01').toISOString(),
                },
            ],
        };

        mockedUseContext.mockReturnValue({
            sweepstakeData: MOCKED_SWEEPSTAKE_DATA_WITH_NO_ACTIVE_SUBPRIZE,
        });

        const { result } = renderHook(() => useGetClosestSubprize());

        expect(result.current).toBeNull();
    });

    it('returns a valid subprize', (): void => {
        mockedUseSelector.mockImplementation(() => MOCK_STRAPI_SWEEPSTAKE);

        mockedUseContext.mockReturnValue({
            sweepstakeData: MOCK_SWEEPSTAKE_DATA,
        });

        const { result } = renderHook(() => useGetClosestSubprize());

        expect(result.current).toStrictEqual({
            ...MOCK_SWEEPSTAKE_DATA.subprizes[1],
            ...MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[1],
            id: MOCK_SWEEPSTAKE_DATA.subprizes[1].id,
        });
    });

    describe('when multiple open subprizes', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const nextWeek = new Date();
        nextWeek.setDate(tomorrow.getDate() + 7);

        it('renders the subprize that is closer to be over', (): void => {
            const MOCK_STRAPI_WITH_SUBPRIZES: IStrapiSweepstake = {
                ...MOCK_STRAPI_SWEEPSTAKE,
                attributes: {
                    ...MOCK_STRAPI_SWEEPSTAKE.attributes,
                    subprizes: [
                        {
                            ...MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[0],
                            apiId: 'next_week',
                        },
                        {
                            ...MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[1],
                            apiId: 'tomorrow',
                        },
                    ],
                },
            };

            mockedUseSelector.mockImplementation(
                () => MOCK_STRAPI_WITH_SUBPRIZES,
            );

            mockedUseContext.mockReturnValue({
                sweepstakeData: {
                    ...MOCK_SWEEPSTAKE_DATA,
                    subprizes: [
                        {
                            ...MOCK_SWEEPSTAKE_DATA.subprizes[0],
                            id: 'next_week',
                            close_date: nextWeek.toISOString(),
                        },
                        {
                            ...MOCK_SWEEPSTAKE_DATA.subprizes[1],
                            id: 'tomorrow',
                            close_date: tomorrow.toISOString(),
                        },
                    ],
                },
            });

            const { result } = renderHook(() => useGetClosestSubprize());

            expect(result.current).toStrictEqual({
                ...MOCK_SWEEPSTAKE_DATA.subprizes[1],
                ...MOCK_STRAPI_SWEEPSTAKE.attributes.subprizes[1],
                id: 'tomorrow',
                apiId: 'tomorrow',
                close_date: tomorrow.toISOString(),
            });
        });
    });
});
