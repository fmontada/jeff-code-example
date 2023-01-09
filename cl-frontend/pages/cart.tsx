import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { ICartStore } from 'types/api';

import { Cart } from '@/components/Cart';
import { EmptyCart } from '@/components/Cart/EmptyCart';
import { Layout } from '@/components/Layout';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { useCartStore } from '@/store/useCartStore';

export { getStaticProps } from '@/utils/serverSideProps';

export default function CartPage() {
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const cart = useCartStore((store) => store.cart);
    const [cartState, setCartState] = useState<ICartStore | null>(null);

    useEffect(() => {
        setCartState(cart);
    }, [cart]);

    return (
        <Layout containerClassName="container mx-auto mt-4 h-full flex-grow flex">
            <Head>
                <title>{t('cart.title')}</title>
            </Head>
            <div
                className={`flex flex-col items-center ${
                    cart ? '' : 'justify-between'
                } flex-grow`}
            >
                <h1 className="text-2xl font-bold text-gray-900 leading-9">
                    {t('cart.yourCart')}
                </h1>
                {cartState ? <Cart cart={cartState} /> : <EmptyCart />}
            </div>
        </Layout>
    );
}
