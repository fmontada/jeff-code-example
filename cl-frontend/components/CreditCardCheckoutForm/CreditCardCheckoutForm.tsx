import { useAuth0 } from '@auth0/auth0-react';
import {
    BUTTON_SIZE,
    BUTTON_STYLE,
    OzButton,
    OzCheckBox,
    OzLoadingSpinner,
    OzTextInput,
} from '@omaze/omaze-ui';
import {
    PaymentElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import shallow from 'zustand/shallow';

import {
    Banner,
    BannerTypes,
    DEFAULT_BANNER_TRANSITION_DURATION_IN_MS,
} from '@/components/Banner';
import {
    PAYMENT_CONFIRMED_ROUTE,
    PRIVACY_POLICY_ROUTE,
    TERMS_OF_USE_ROUTE,
} from '@/constants/routes';
import { useAppStore } from '@/store/useAppStore';
import { useCartStore } from '@/store/useCartStore';
import { signUpEvent } from '@/utils/sailthru/signUpEvent';
import { validateEmail } from '@/utils/validators';

import { CreditCardCheckoutFormTestIds } from './CreditCardCheckoutFormTestIds';

export interface ICreditCardCheckoutFormProps {
    cartId: string;
}

export function CreditCardCheckoutForm({
    cartId,
}: ICreditCardCheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const { t } = useTranslation();
    const [errorBannerMessage, setErrorBannerMessage] = useState<string | null>(
        null,
    );
    const [emailError, setEmailError] = useState<string | null>(null);
    const [signUp, setSignUp] = useState<boolean>(true);
    const { user } = useAuth0();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setCartStore] = useCartStore(
        (store) => [store.email, store.set],
        shallow,
    );
    const sailthru = useAppStore((appStore) => appStore.sailthru);

    function displayError(errorMessage: string) {
        setErrorBannerMessage(errorMessage);
        setTimeout(() => {
            setErrorBannerMessage(null);
        }, DEFAULT_BANNER_TRANSITION_DURATION_IN_MS);
        setIsLoading(false);
    }

    async function handleSubmit(event?: React.FormEvent<HTMLFormElement>) {
        event?.preventDefault();
        setIsLoading(true);

        const emailToUse = user?.email || email;

        if (!emailToUse || !validateEmail(emailToUse)) {
            setEmailError(t('checkout.emailAddressInvalid'));
            setIsLoading(false);
            return;
        }

        if (!stripe || !elements) {
            setIsLoading(false);
            return;
        }

        try {
            setCartStore((store) => {
                store.email = emailToUse;
            });

            await axios.post(`/api/cart/${cartId}/submit`, {
                email: emailToUse,
            });

            if (signUp) {
                signUpEvent(sailthru, emailToUse);
            }

            const result = await stripe.processOrder({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}${PAYMENT_CONFIRMED_ROUTE}`,
                },
            });

            if (result.error) {
                displayError(result.error.message);
            } else {
                router.push(PAYMENT_CONFIRMED_ROUTE);
            }
        } catch (error) {
            const alreadyCompleted = error.response?.data?.alreadyCompleted;
            if (alreadyCompleted) {
                displayError(t('checkout.alreadyCompleted'));
            } else {
                console.error(error);
                displayError(t('checkout.error'));
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="p-3"
            data-testid={CreditCardCheckoutFormTestIds.CONTAINER}
        >
            {isLoading ? (
                <div
                    className="flex flex-col items-center"
                    data-testid={CreditCardCheckoutFormTestIds.LOADING}
                >
                    <OzLoadingSpinner />
                    <p className="text-xl mt-2">{t('checkout.submitting')}</p>
                </div>
            ) : null}
            <div className={isLoading ? 'hidden' : ''}>
                <OzTextInput
                    data-testid={CreditCardCheckoutFormTestIds.EMAIL}
                    onChange={(e) => {
                        setCartStore((store) => {
                            store.email = e.target.value;
                        });
                        setEmailError(null);
                    }}
                    onBlur={(e) => {
                        setEmailError(
                            validateEmail(e.target.value)
                                ? null
                                : t('checkout.emailAddressInvalid'),
                        );
                    }}
                    value={user ? user.email : email}
                    label={t('checkout.emailAddress')}
                    type="email"
                    error={emailError}
                    placeholder={t('checkout.emailAddress')}
                    disabled={!!user}
                />

                <div className="flex items-center my-3">
                    <OzCheckBox
                        id="sign-up-for-emails"
                        data-testid={CreditCardCheckoutFormTestIds.SIGN_UP}
                        onChange={(e) => {
                            setSignUp(e.target.checked);
                        }}
                        checked={signUp}
                    />
                    <label
                        className="text-md font-gellix ml-1 cursor-pointer"
                        htmlFor="sign-up-for-emails"
                        dangerouslySetInnerHTML={{
                            __html: t('checkout.signUpForEmails', {
                                privacyPolicy: `<a class="underline underline-offset-2" href= "${PRIVACY_POLICY_ROUTE}"> ${t(
                                    'checkout.privacyPolicy',
                                )}</a>`,
                            }),
                        }}
                    />
                </div>

                <PaymentElement />

                <OzButton
                    style={BUTTON_STYLE.PRIMARY}
                    size={BUTTON_SIZE.MEDIUM}
                    className="w-full mt-2"
                    disabled={!stripe || !!emailError}
                    onClick={() => handleSubmit()}
                >
                    {t('checkout.pay')}
                </OzButton>
                <div
                    className="text-center font-normal font-gellix"
                    data-testid={CreditCardCheckoutFormTestIds.LEGAL_LINKS}
                    dangerouslySetInnerHTML={{
                        __html: t('checkout.legalDisclaimer', {
                            termsOfService: `<a class="underline underline-offset-2" href= "${TERMS_OF_USE_ROUTE}"> ${t(
                                'checkout.termsOfService',
                            )}</a>`,
                            privacyPolicy: `<a class="underline underline-offset-2" href= "${PRIVACY_POLICY_ROUTE}"> ${t(
                                'checkout.privacyPolicy',
                            )}</a>`,
                        }),
                    }}
                ></div>
            </div>
            {errorBannerMessage ? (
                <Banner
                    delayTime={0}
                    type={BannerTypes.ERROR}
                    data-testid={CreditCardCheckoutFormTestIds.ERROR}
                >
                    {errorBannerMessage}
                </Banner>
            ) : null}
        </form>
    );
}
