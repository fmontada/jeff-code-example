import { ICON_COLOR, ICON_SIZE, ICON_TYPE, OzIcon } from '@omaze/omaze-ui';
import {
    act,
    fireEvent,
    render,
    renderHook,
    screen,
    waitFor,
} from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

import SettingsPage, { SettingsPageTestIds } from '@/pages/account/settings';
import { useUserStore } from '@/store/useUserStore';

const mockedUseQuery = jest.spyOn(require('react-query'), 'useQuery');

const queryClient = new QueryClient();

jest.mock('@/utils/fetchJson', () => {
    return {
        fetchJson: jest.fn(() => Promise.resolve({})),
    };
});

describe('SettingsPage', (): void => {
    describe('User is not authenticated', () => {
        it('redirects user if not authenticated', (): void => {
            mockedUseQuery.mockReturnValue({
                isLoading: false,
                error: undefined,
                data: undefined,
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <SettingsPage />
                </QueryClientProvider>,
            );

            expect(
                screen.getByTestId(SettingsPageTestIds.ERROR_PAGE),
            ).toBeInTheDocument();
            expect(
                screen.getByText('en-US account.settings.notAuthenticated'),
            ).toBeInTheDocument();
        });
    });

    describe('User is authenticated', () => {
        beforeEach(() => {
            const { result } = renderHook(() => useUserStore());
            act(() => {
                result.current.authorizationToken = 'AUTHENTICATED_MOCK';
            });
        });

        it('renders a loading state', (): void => {
            mockedUseQuery.mockReturnValue({
                isLoading: true,
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <SettingsPage />
                </QueryClientProvider>,
            );

            expect(
                screen.getByTestId(SettingsPageTestIds.LOADING_PAGE),
            ).toBeInTheDocument();
        });

        it('renders an error state', async (): Promise<void> => {
            mockedUseQuery.mockReturnValue({
                error: 'Error',
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <SettingsPage />
                </QueryClientProvider>,
            );

            await screen.findByTestId(SettingsPageTestIds.ERROR_PAGE);
        });

        it('renders a user state', async (): Promise<void> => {
            mockedUseQuery.mockReturnValue({
                data: {},
            });

            render(
                <QueryClientProvider client={queryClient}>
                    <SettingsPage />
                </QueryClientProvider>,
            );

            await screen.findByTestId(
                SettingsPageTestIds.USER_SETTINGS_MAIN_CONTAINER,
            );
        });

        describe('User is authenticated, and renders the settings page', () => {
            beforeEach(() => {
                mockedUseQuery.mockReturnValue({
                    data: {},
                });

                render(
                    <QueryClientProvider client={queryClient}>
                        <SettingsPage />
                    </QueryClientProvider>,
                );
            });

            it('renders the experience link', () => {
                const experienceLink: HTMLElement = screen.getByTestId(
                    SettingsPageTestIds.USER_SETTINGS_BACK_TO_EXPERIENCE,
                );
                expect(experienceLink.querySelector('img')).toBeInTheDocument();
                expect(experienceLink.querySelector('span')).toHaveTextContent(
                    'en-US account.backToYourExperience',
                );
            });

            it('renders page title and subtitles', () => {
                const pageTitle: HTMLElement = screen.getByTestId(
                    SettingsPageTestIds.USER_SETTINGS_ACCOUNT_SETTINGS,
                );
                expect(pageTitle).toHaveTextContent(
                    'en-US account.settings.accountSettings',
                );

                const personalInfo: HTMLElement = screen.getByTestId(
                    SettingsPageTestIds.USER_SETTINGS_PERSONAL_INFO,
                );
                expect(personalInfo).toHaveTextContent(
                    'en-US account.settings.personalInformation.personalInfo',
                );

                const infoNote: HTMLElement = screen.getByTestId(
                    SettingsPageTestIds.USER_SETTINGS_INFO_NOTE,
                );
                expect(infoNote).toHaveTextContent(
                    'en-US account.settings.personalInformation.infoNote',
                );
            });

            describe('email section', (): void => {
                it('renders the email section and help tip icon', () => {
                    const emailContainer: HTMLElement = screen.getByTestId(
                        SettingsPageTestIds.USER_SETTINGS_EMAIL_CONTAINER,
                    );
                    expect(
                        emailContainer.querySelector('h4'),
                    ).toHaveTextContent(
                        'en-US account.settings.personalInformation.email',
                    );
                    expect(emailContainer.querySelector('img')).toHaveAttribute(
                        'alt',
                        'en-US account.settings.toolTipMsg.altTextHelpIcon',
                    );
                });

                it('opens the tooltip message when icon is clicked', async (): Promise<void> => {
                    const handleClick = jest.fn();
                    render(
                        <span onClick={handleClick}>
                            <OzIcon
                                type={ICON_TYPE.OZ_TOOLTIP}
                                size={ICON_SIZE.MEDIUM}
                                color={ICON_COLOR.DARK}
                                alt="Help Tip"
                            />
                        </span>,
                    );

                    await waitFor(() => {
                        fireEvent.click(screen.getByAltText('Help Tip'));

                        expect(handleClick).toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
