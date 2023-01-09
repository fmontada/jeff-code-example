import { useAuth0 } from '@auth0/auth0-react';
import {
    ICON_COLOR,
    ICON_SIZE,
    ICON_TYPE,
    OzIcon,
    OzLoadingSpinner,
} from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useQuery } from 'react-query';

import { DonationHistoryEntry } from '@/components/DonationHistoryEntry';
import { Layout } from '@/components/Layout';
import { getUserOrdersQuery } from '@/queries/getUserOrdersQuery';
import { useUserStore } from '@/store/useUserStore';

export { getStaticProps } from '@/utils/serverSideProps';

export enum DonationHistoryPageTestIds {
    DONATION_HISTORY_CONTAINER = 'DonationHistory__container',
    DONATION_HISTORY_BACK_TO_EXPERIENCE = 'DonationHistory__back-to-experience',
    DONATION_HISTORY_ORDERS = 'DonationHistory__orders',
    DONATION_HISTORY_NO_ORDERS = 'DonationHistory__no-orders',
    DONATION_HISTORY_TITLE = 'DonationHistory__title',
}

export default function AccountDonationHistoryPage() {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const router = useRouter();
    const { t } = useTranslation();

    const authorizationToken = useUserStore(
        (store) => store.authorizationToken,
    );

    const { data: ordersData, isLoading: isLoadingOrders } = useQuery(
        'userOrderHistory',
        getUserOrdersQuery,
        {
            enabled: !!authorizationToken,
            retry: false,
        },
    );

    useEffect(() => {
        if (!router) {
            return;
        }

        if (!isAuthenticated && !isLoading) {
            router.replace('/');
        }
    }, [isAuthenticated, isLoading, router]);

    if (!user) {
        return null;
    }

    return (
        <Layout>
            <Head>
                <title>{t('account.donationHistory.title')}</title>
            </Head>
            <div
                className="flex flex-col px-3 md:px-[128px]"
                data-testid={
                    DonationHistoryPageTestIds.DONATION_HISTORY_CONTAINER
                }
            >
                <Link href="/">
                    <a
                        className="flex items-baseline mt-3 mb-[20px]"
                        data-testid={
                            DonationHistoryPageTestIds.DONATION_HISTORY_BACK_TO_EXPERIENCE
                        }
                    >
                        <OzIcon
                            type={ICON_TYPE.OZ_ARROW_LEFT}
                            size={ICON_SIZE.SMALL}
                            color={ICON_COLOR.DARK}
                        />
                        <span className="ml-1 text-sm font-bold decoration-gray-500 underline-offset-2 underline">
                            {t('account.backToYourExperience')}
                        </span>
                    </a>
                </Link>

                <h3
                    className="text-gray-900 text-xl font-bold leading-9"
                    data-testid={
                        DonationHistoryPageTestIds.DONATION_HISTORY_TITLE
                    }
                >
                    {t('account.donationHistory.title')}
                </h3>
                <div
                    className="flex flex-col items-center mt-2 w-full"
                    data-testid={
                        DonationHistoryPageTestIds.DONATION_HISTORY_ORDERS
                    }
                >
                    {ordersData?.map((order) => {
                        return (
                            <DonationHistoryEntry
                                key={order.id}
                                order={order}
                            />
                        );
                    })}
                    {isLoadingOrders ? (
                        <OzLoadingSpinner />
                    ) : !ordersData?.length ? (
                        <p
                            className="text-lg w-full text-left"
                            data-testid={
                                DonationHistoryPageTestIds.DONATION_HISTORY_NO_ORDERS
                            }
                        >
                            {t('account.donationHistory.noOrders')}
                        </p>
                    ) : null}
                </div>
            </div>
        </Layout>
    );
}
