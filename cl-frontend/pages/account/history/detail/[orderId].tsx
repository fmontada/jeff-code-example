import {
    ICON_COLOR,
    ICON_SIZE,
    ICON_TYPE,
    OzDivider,
    OzIcon,
    OzLoadingSpinner,
} from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import { Layout } from '@/components/Layout';
import { OrderLineItem } from '@/components/OrderLineItem';
import { getAccountRoute } from '@/constants/routes';
import { getUserOrderDetailQuery } from '@/queries/getUserOrderDetailQuery';
import { useUserStore } from '@/store/useUserStore';
import { formatDateToLocalString } from '@/utils/formatDateToLocalString';
import { formatCentsWithCurrency } from '@/utils/formatNumbers';

export { getServerSideProps } from '@/utils/serverSideProps';

export enum AccountOrderDetailPageTestIds {
    ORDER_DETAIL_AMOUNT = 'OrderDetail__amount',
    ORDER_DETAIL_BACK_TO_EXPERIENCE = 'OrderDetail__back-to-experience',
    ORDER_DETAIL_CONTAINER = 'OrderDetail__container',
    ORDER_DETAIL_CREATED_AT = 'OrderDetail__created-at',
    ORDER_DETAIL_ITEMS = 'OrderDetail__items',
    ORDER_DETAIL_SUBTOTAL = 'OrderDetail__subtotal',
    ORDER_DETAIL_TOTAL = 'OrderDetail__total',
    ORDER_NOT_FOUND = 'OrderDetail__not-found',
    ORDER_DETAIL_TITLE = 'OrderDetail__title',
}

export default function AccountOrderDetailPage() {
    const router = useRouter();
    const { t } = useTranslation();
    const orderId = router?.query?.orderId;

    const authorizationToken = useUserStore(
        (store) => store.authorizationToken,
    );

    const { data: orderData, isLoading } = useQuery(
        ['userOrderHistory', orderId],
        getUserOrderDetailQuery,
        {
            enabled: !!authorizationToken,
            retry: false,
        },
    );

    if (!orderData || isLoading) {
        return (
            <Layout>
                <div
                    data-testid={
                        AccountOrderDetailPageTestIds.ORDER_DETAIL_CONTAINER
                    }
                >
                    {isLoading ? (
                        <OzLoadingSpinner />
                    ) : (
                        <p
                            data-testid={
                                AccountOrderDetailPageTestIds.ORDER_NOT_FOUND
                            }
                        >
                            {t('account.donationHistory.order.notFound')}
                        </p>
                    )}
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Head>
                <title>{t('account.donationHistory.title')}</title>
            </Head>
            <div
                className="flex flex-col px-3 md:px-[128px]"
                data-testid={
                    AccountOrderDetailPageTestIds.ORDER_DETAIL_CONTAINER
                }
            >
                <Link href={getAccountRoute('history')}>
                    <a
                        className="flex items-baseline mt-3 mb-[20px]"
                        data-testid={
                            AccountOrderDetailPageTestIds.ORDER_DETAIL_BACK_TO_EXPERIENCE
                        }
                    >
                        <OzIcon
                            type={ICON_TYPE.OZ_ARROW_LEFT}
                            size={ICON_SIZE.SMALL}
                            color={ICON_COLOR.DARK}
                        />
                        <span className="ml-1 text-sm font-bold decoration-gray-500 underline-offset-2 underline">
                            {t('account.donationHistory.backToDonationHistory')}
                        </span>
                    </a>
                </Link>

                <h3
                    className="text-xl font-bold leading-9 text-navy-600 mb-2"
                    data-testid={
                        AccountOrderDetailPageTestIds.ORDER_DETAIL_TITLE
                    }
                >
                    {t('account.donationHistory.order.title', { orderId })}
                </h3>

                <h4 className="text-navy-900 text-base mb-[4px] font-bold leading-[19px] tracking-[0.4px]">
                    {t('account.donationHistory.order.date')}
                </h4>

                <h5
                    className="text-navy-900 text-base mb-1 font-medium leading-9 tracking-[0.321429px]"
                    data-testid={
                        AccountOrderDetailPageTestIds.ORDER_DETAIL_CREATED_AT
                    }
                >
                    {formatDateToLocalString(orderData.created_at)}
                </h5>

                <h4 className="text-navy-900 text-base mb-[4px] font-bold leading-[19px] tracking-[0.4px]">
                    {t('account.donationHistory.donationTotal')}
                </h4>

                <h5
                    className="text-navy-900 text-base mb-1 font-medium leading-9 tracking-[0.321429px]"
                    data-testid={
                        AccountOrderDetailPageTestIds.ORDER_DETAIL_AMOUNT
                    }
                >
                    {formatCentsWithCurrency(
                        orderData.amount,
                        orderData.currency,
                    )}
                </h5>

                <h4 className="text-navy-900 text-base mb-[4px] font-bold leading-[19px] tracking-[0.4px]">
                    {t('account.donationHistory.order.paymentStatus')}
                </h4>

                <h5 className="text-navy-900 text-base mb-1 font-medium leading-9 tracking-[0.321429px]">
                    {t(
                        `account.donationHistory.order.status.${orderData.payment_status}`,
                    )}
                </h5>

                <h4 className="text-navy-900 text-base mb-[4px] font-bold leading-[19px] tracking-[0.4px]">
                    {t('account.donationHistory.order.paymentMethod')}
                </h4>

                <h5 className="text-navy-900 text-base mb-1 font-medium leading-9 tracking-[0.321429px]">
                    {orderData.order_type === 'cx'
                        ? t('account.donationHistory.order.method.freeEntries')
                        : t(
                              `account.donationHistory.order.method.${orderData.payment_method.type}`,
                              {
                                  cardSummary: `${orderData.payment_method.card?.brand} **${orderData.payment_method.card?.last4}`,
                              },
                          )}
                </h5>

                <h3 className="text-navy-900 text-med mb-[4px] font-bold mt-5 leading-9">
                    {t('account.donationHistory.order.summary')}
                </h3>

                <OzDivider />

                {orderData.line_items ? (
                    <div
                        className="flex flex-col items-center w-full"
                        data-testid={
                            AccountOrderDetailPageTestIds.ORDER_DETAIL_ITEMS
                        }
                    >
                        {Array.from(orderData.line_items).map((lineItem) => {
                            return (
                                <OrderLineItem
                                    key={lineItem.id}
                                    lineItem={lineItem}
                                    order={orderData}
                                />
                            );
                        })}
                    </div>
                ) : null}

                <ul className="mt-1 mb-5 text-base leading-[24px] text-navy-900">
                    <li className="flex w-full justify-between font-medium">
                        <div>
                            {t('account.donationHistory.order.subtotal')}:
                        </div>
                        <div
                            data-testid={
                                AccountOrderDetailPageTestIds.ORDER_DETAIL_SUBTOTAL
                            }
                        >
                            {formatCentsWithCurrency(
                                orderData.amount,
                                orderData.currency,
                            )}
                        </div>
                    </li>
                    <li className="flex w-full justify-between font-bold">
                        <div>{t('account.donationHistory.order.total')}:</div>
                        <div
                            data-testid={
                                AccountOrderDetailPageTestIds.ORDER_DETAIL_TOTAL
                            }
                        >
                            {formatCentsWithCurrency(
                                orderData.amount,
                                orderData.currency,
                            )}
                        </div>
                    </li>
                </ul>
            </div>
        </Layout>
    );
}
