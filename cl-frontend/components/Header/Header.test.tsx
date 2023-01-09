import {
    act,
    fireEvent,
    renderHook,
    screen,
    waitFor,
} from '@testing-library/react';
import React from 'react';

import { MenuTestIds } from '../Menu/MenuTestIds';

import { HeaderTestIds } from '@/components/Header/HeaderTestIds';
import {
    MOCK_CART_WITH_MULTIPLE_LINE_ITEMS,
    MOCK_CART_WITH_ONE_CART_ITEM,
    MOCK_EMPTY_CART,
} from '@/mocks/cart';
import { renderWithQueryClient } from '@/mocks/renderWithQueryClient';
import { useCartStore } from '@/store/useCartStore';

import { Header } from './Header';

describe('Header', (): void => {
    describe('no maintenance mode', () => {
        const previousEnv = process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED;

        beforeAll(() => {
            process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED = '0';
        });

        afterAll(() => {
            process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED = previousEnv;
        });

        it('renders', (): void => {
            const { container } = renderWithQueryClient(<Header />);

            expect(container.querySelector('header')).toBeInTheDocument();
        });

        it('responds to click events to dogfood', (): void => {
            renderWithQueryClient(<Header />);

            screen.getAllByRole('link').forEach((link) => {
                expect(link).toHaveAttribute('href');
            });
        });

        it('includes the data-test-id prop', (): void => {
            const { container } = renderWithQueryClient(
                <Header data-testid="testing-header" />,
            );

            expect(container.querySelector('header')).toHaveAttribute(
                'data-testid',
                'testing-header',
            );
        });

        it('includes the class passed by prop', (): void => {
            const { container } = renderWithQueryClient(
                <Header className="testing-header-class" />,
            );

            expect(container.querySelector('header')).toHaveClass(
                'testing-header-class',
            );
        });

        it('renders cart icon', (): void => {
            renderWithQueryClient(<Header className="testing-header-class" />);
            expect(
                screen.getByTestId(HeaderTestIds.HEADER_CART_BUTTON),
            ).toBeInTheDocument();
        });

        describe('cart icon', () => {
            it('renders empty cart when there are 0 items in the cart', (): void => {
                const { result } = renderHook(() => {
                    return useCartStore();
                });

                act(() => {
                    result.current.set((store) => {
                        store.cart = MOCK_EMPTY_CART;
                    });
                });
                renderWithQueryClient(<Header />);

                expect(
                    screen.queryByTestId(HeaderTestIds.CART_ITEMS_AMOUNT),
                ).not.toBeInTheDocument();
            });

            it('renders the value of 1 when there is 1 item in the cart', (): void => {
                const { result } = renderHook(() => {
                    return useCartStore();
                });

                act(() => {
                    result.current.set((store) => {
                        store.cart = MOCK_CART_WITH_ONE_CART_ITEM;
                    });
                });
                renderWithQueryClient(<Header />);
                expect(
                    screen.getByTestId(HeaderTestIds.CART_ITEMS_AMOUNT)
                        .textContent,
                ).toBe('1');
            });

            it('renders the value of 3 when there are 3 items in the cart', (): void => {
                const { result } = renderHook(() => {
                    return useCartStore();
                });

                act(() => {
                    result.current.set((store) => {
                        store.cart = MOCK_CART_WITH_MULTIPLE_LINE_ITEMS;
                    });
                });
                renderWithQueryClient(<Header />);
                expect(
                    screen.getByTestId(HeaderTestIds.CART_ITEMS_AMOUNT)
                        .textContent,
                ).toBe('3');
            });
        });

        describe('menu', () => {
            it('opens the menu', async () => {
                renderWithQueryClient(<Header />);

                expect(
                    screen.getByTestId(MenuTestIds.MENU_CONTAINER),
                ).toHaveAttribute('data-test-status', 'close');

                await waitFor(() => {
                    fireEvent.click(
                        screen.getByTestId(
                            HeaderTestIds.HEADER_TOGGLE_MENU_BUTTON,
                        ),
                    );
                });

                expect(
                    screen.getByTestId(MenuTestIds.MENU_CONTAINER),
                ).toHaveAttribute('data-test-status', 'open');
            });

            it('shows the proper logo', async () => {
                renderWithQueryClient(<Header />);

                expect(
                    screen.getByTestId(HeaderTestIds.HEADER_LOGO_FULL),
                ).toBeInTheDocument();

                await waitFor(() => {
                    fireEvent.click(
                        screen.getByTestId(
                            HeaderTestIds.HEADER_TOGGLE_MENU_BUTTON,
                        ),
                    );
                });

                expect(
                    screen.getByTestId(HeaderTestIds.HEADER_LOGO_SIMPLE),
                ).toBeInTheDocument();
            });
        });
    });

    describe('maintenance mode', () => {
        const previousEnv = process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED;

        beforeAll(() => {
            process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED = '1';
        });

        afterAll(() => {
            process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED = previousEnv;
        });

        it('renders the logo and no cart, menu nor account', (): void => {
            process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED = '1';
            const { container } = renderWithQueryClient(<Header />);

            expect(container.querySelector('header')).toBeInTheDocument();

            expect(
                screen.getByTestId(HeaderTestIds.HEADER_LOGO_FULL),
            ).toBeInTheDocument();

            expect(
                screen.queryByTestId(MenuTestIds.MENU_CONTAINER),
            ).not.toBeInTheDocument();

            expect(
                screen.queryByTestId(HeaderTestIds.HEADER_TOGGLE_MENU_BUTTON),
            ).not.toBeInTheDocument();

            expect(
                screen.queryByTestId(HeaderTestIds.HEADER_CART_BUTTON),
            ).not.toBeInTheDocument();
        });
    });
});
