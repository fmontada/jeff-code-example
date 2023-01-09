import { Trans, useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';

import { CartOrder } from '@/components/CartOrder';
import { Layout } from '@/components/Layout';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { useAppStore } from '@/store/useAppStore';
import { useCartStore } from '@/store/useCartStore';
import { ICartStore } from '@/types/api';
import { addDataLayer, convertToGtmLineItems } from '@/utils/gtm/main';
import { purchaseEvent } from '@/utils/sailthru/purchaseEvent';

export { getStaticProps } from '@/utils/serverSideProps';

export enum ThankYouPageTestIds {
    THANK_YOU_CONTAINER = 'ThankYouPage__container',
    THANK_YOU_BODY = 'ThankYouPage__body',
    THANK_YOU_SURVEY = 'ThankYouPage__survey',
    THANK_YOU_TITLE = 'ThankYouPage__title',
}

export interface ICartStoreRef {
    cart: ICartStore;
    email: string;
}

function ThankYouPage() {
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const [cart, email, setCartStore] = useCartStore((store) => [
        store.cart,
        store.email,
        store.set,
    ]);
    const cartStoreRef = useRef<ICartStoreRef | null>(null);
    const [trackEventSubmitted, setTrackEventSubmitted] =
        useState<boolean>(false);

    const sailthru = useAppStore((appStore) => appStore.sailthru);

    useEffect(() => {
        if (cart) {
            cartStoreRef.current = {
                cart,
                email,
            };
        }

        setCartStore((store) => {
            store.cart = undefined;
            store.email = undefined;
        });
    }, [cart]);

    useEffect(() => {
        if (!sailthru || trackEventSubmitted || !cartStoreRef?.current?.cart) {
            return;
        }

        purchaseEvent(
            sailthru,
            cartStoreRef.current.email,
            cartStoreRef.current.cart,
        );
        setTrackEventSubmitted(true);
    }, [
        cartStoreRef?.current,
        cartStoreRef?.current?.email,
        sailthru,
        trackEventSubmitted,
    ]);

    useEffect(() => {
        if (!cartStoreRef?.current?.cart) {
            return;
        }

        addDataLayer({
            dataLayer: {
                ecommerce: null,
            },
        });

        addDataLayer({
            dataLayer: {
                event: 'purchase',
                ecommerce: {
                    transaction_id: cartStoreRef.current.cart.id,
                    value: cartStoreRef.current.cart.total_amount,
                    currency: 'USD',
                    items: convertToGtmLineItems(
                        cartStoreRef.current.cart.line_items,
                    ),
                },
            },
        });
    }, []);

    return (
        <Layout
            containerClassName="mx-auto w-full"
            data-testid={ThankYouPageTestIds.THANK_YOU_CONTAINER}
        >
            <Head>
                <title>{t('thankYou.title')}</title>
            </Head>
            {cartStoreRef?.current?.cart ? (
                <CartOrder cartOrder={cartStoreRef.current.cart} />
            ) : null}
            <div className="flex flex-col container px-3 md:px-0 items-center mx-auto">
                <div className="mt-6 text-green-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            className="animate-fill-slow"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
                <h1
                    className="mt-3 text-xl md:text-3xl text-gray-700 text-center"
                    data-testid={ThankYouPageTestIds.THANK_YOU_TITLE}
                >
                    {t('thankYou.title')}
                </h1>
                <p
                    className="my-3 text-lg md:text-xl text-gray-500 text-center"
                    data-testid={ThankYouPageTestIds.THANK_YOU_BODY}
                >
                    {t('thankYou.body')}
                </p>
                <p
                    className="text-lg md:text-xl mb-4"
                    data-testid={ThankYouPageTestIds.THANK_YOU_SURVEY}
                >
                    <Trans i18nKey="thankYou.survey">
                        Link to{' '}
                        <a
                            href={process.env.NEXT_PUBLIC_DOGFOOD_SURVEY}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            dogfooding survey
                        </a>
                        .
                    </Trans>
                </p>
            </div>
        </Layout>
    );
}

export default ThankYouPage;
