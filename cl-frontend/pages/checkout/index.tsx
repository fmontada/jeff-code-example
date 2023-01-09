import {
    BUTTON_SIZE,
    BUTTON_STYLE,
    OzButton,
    OzLoadingSpinner,
} from '@omaze/omaze-ui';
import { Elements } from '@stripe/react-stripe-js';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import StripeClient from 'stripe';

import { CartOrder } from '@/components/CartOrder';
import { CreditCardCheckoutForm } from '@/components/CreditCardCheckoutForm';
import { Layout } from '@/components/Layout';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { useCart } from '@/hooks/useCart';
import { fetchJson } from '@/utils/fetchJson';
import { gtmAddDataLayerWithCartItems } from '@/utils/gtm/gtmAddDataLayerWithCartItems';

export { getStaticProps } from '@/utils/serverSideProps';

function CheckoutPage() {
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const [stripe, setStripe] = useState<Stripe>(null);
    const [orderClientSecret, setOrderClientSecret] = useState<
        StripeClient.PaymentIntent['client_secret'] | null
    >(null);
    const [loadingSecret, setLoadingSecret] = useState<boolean>(false);
    const { cart, isLoading } = useCart();

    const lineItems = cart?.line_items;

    useEffect(() => {
        if (isLoading || !lineItems) {
            return;
        }

        gtmAddDataLayerWithCartItems(lineItems, 'begin_checkout');
    }, [lineItems, isLoading]);

    useEffect(() => {
        async function fetchStripe() {
            const stripe = await loadStripe(
                process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
                {
                    apiVersion: process.env.NEXT_PUBLIC_STRIPE_API_VERSION,
                    betas: ['process_order_beta_1'],
                },
            );
            setStripe(stripe);
        }

        fetchStripe();
    }, []);

    useEffect(() => {
        if (!stripe || orderClientSecret) {
            return;
        }

        if (!cart) {
            setLoadingSecret(false);
            return;
        }

        async function submitOrderAndGetPaymentIntent() {
            setLoadingSecret(true);
            try {
                const clientSecret = await fetchJson(
                    `/api/cart/${cart.id}/stripe-data`,
                );
                setOrderClientSecret(clientSecret as string);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingSecret(false);
            }
        }

        submitOrderAndGetPaymentIntent();
    }, [cart, orderClientSecret, stripe]);

    function displayContent() {
        if (isLoading || loadingSecret) {
            return <OzLoadingSpinner />;
        }

        if (orderClientSecret && cart) {
            return (
                <Elements
                    stripe={stripe}
                    options={{
                        appearance: {
                            theme: 'stripe',
                            variables: {
                                colorPrimary: '#0570de',
                                colorBackground: '#ffffff',
                                colorText: 'rgb(9 15 21)',
                                colorDanger: 'rgb(219 40 0)',
                                fontFamily: 'Gellix, system-ui, sans-serif',
                                spacingUnit: '8px',
                                borderRadius: '4px',
                            },
                        },
                        clientSecret: orderClientSecret,
                    }}
                >
                    <CartOrder defaultOpenState={false} />
                    <div className="container mx-auto">
                        <CreditCardCheckoutForm cartId={cart.id} />
                    </div>
                </Elements>
            );
        }

        return (
            <div className="flex flex-col items-center">
                <p className="text-2xl my-4 text-center">
                    {t('checkout.submitted')}
                </p>
                <Link href="/">
                    <a>
                        <OzButton
                            size={BUTTON_SIZE.MEDIUM}
                            style={BUTTON_STYLE.PRIMARY}
                        >
                            {t('checkout.continue')}
                        </OzButton>
                    </a>
                </Link>
            </div>
        );
    }

    return (
        <Layout containerClassName="mx-auto w-full">
            <Head>
                <title>{t('checkout.title')}</title>
            </Head>
            {displayContent()}
        </Layout>
    );
}

export default CheckoutPage;
