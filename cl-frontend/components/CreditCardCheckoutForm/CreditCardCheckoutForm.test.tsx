import { useAuth0 } from '@auth0/auth0-react';
import { render, screen } from '@testing-library/react';
import React from 'react';

import { CreditCardCheckoutForm } from './CreditCardCheckoutForm';
import { CreditCardCheckoutFormTestIds } from './CreditCardCheckoutFormTestIds';

jest.mock('@stripe/react-stripe-js', (): jest.Mock<any, any> => {
    const actual: any = jest.requireActual('@stripe/react-stripe-js');

    return {
        ...actual,
        useElements: jest.fn(),
        useStripe: () => {
            return {
                processOrder: jest.fn(),
            };
        },
        PaymentElement: jest.fn(),
    };
});

jest.mock('@auth0/auth0-react', () => ({
    useAuth0: jest.fn(),
    Auth0Provider: jest.fn(({ children }) => children),
}));

describe('CreditCardCheckoutForm', (): void => {
    describe('user authenticated', () => {
        const userMock = {
            email: 'test@test.com',
            name: 'test',
            picture: 'https://test.com/test.jpg',
        };

        (useAuth0 as jest.Mock).mockReturnValue({
            isAuthenticated: true,
            user: userMock,
        });

        it('renders the component and its container', (): void => {
            render(<CreditCardCheckoutForm cartId="FAKE_CART_ID" />);

            const creditCardCheckoutContainer: HTMLElement = screen.getByTestId(
                CreditCardCheckoutFormTestIds.CONTAINER,
            );

            expect(creditCardCheckoutContainer).toBeInTheDocument();
        });

        it('renders a disabled input field', (): void => {
            render(<CreditCardCheckoutForm cartId="FAKE_CART_ID" />);

            const emailInputField: HTMLElement =
                screen.getAllByRole('textbox')[0];
            expect(emailInputField).toBeInTheDocument();
            expect(emailInputField).toBeDisabled();
            expect(emailInputField).toHaveValue(userMock.email);
        });

        it('render a pay button screen', async (): Promise<void> => {
            render(<CreditCardCheckoutForm cartId="FAKE_CART_ID" />);

            const payButton: HTMLElement = screen.getByRole('button');
            expect(payButton).toBeInTheDocument();
            expect(payButton).toBeEnabled();
        });

        it('renders the legal links', () => {
            render(<CreditCardCheckoutForm cartId="FAKE_CART_ID" />);

            const legalLink: HTMLElement = screen.getByTestId(
                CreditCardCheckoutFormTestIds.LEGAL_LINKS,
            );
            expect(legalLink).toHaveTextContent(
                'en-US checkout.legalDisclaimer',
            );
        });

        it('renders the sign up form with a checked box', () => {
            render(<CreditCardCheckoutForm cartId="FAKE_CART_ID" />);

            const signUpCheckbox: HTMLInputElement = screen.getByTestId(
                CreditCardCheckoutFormTestIds.SIGN_UP,
            );
            expect(signUpCheckbox).toBeInTheDocument();
            expect(signUpCheckbox.checked).toBeTruthy();
        });
    });

    describe('visitor', () => {
        it('renders an enabled input field', (): void => {
            (useAuth0 as jest.Mock).mockReturnValue({
                isAuthenticated: false,
                user: undefined,
            });

            render(<CreditCardCheckoutForm cartId="FAKE_CART_ID" />);

            const emailInputField: HTMLElement =
                screen.getAllByRole('textbox')[0];
            expect(emailInputField).toBeInTheDocument();
            expect(emailInputField).toBeEnabled();
            expect(emailInputField).toHaveValue('');

            const signUpCheckbox: HTMLInputElement = screen.getByTestId(
                CreditCardCheckoutFormTestIds.SIGN_UP,
            );

            expect(signUpCheckbox).toBeInTheDocument();
            expect(signUpCheckbox.checked).toBeTruthy();
        });
    });
});
