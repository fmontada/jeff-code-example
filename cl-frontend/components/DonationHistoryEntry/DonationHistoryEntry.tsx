import {
    ICON_COLOR,
    ICON_SIZE,
    ICON_TYPE,
    OzDivider,
    OzIcon,
} from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { Order } from '@/api/orders';
import { getAccountRoute } from '@/constants/routes';
import { formatDateToLocalString } from '@/utils/formatDateToLocalString';
import { formatCentsWithCurrency, formatNumber } from '@/utils/formatNumbers';

import { DonationHistoryEntryTestIds } from './DonationHistoryEntryTestIds';

export interface IDonationHistoryEntryProps {
    order: Order;
}

export function DonationHistoryEntry({ order }: IDonationHistoryEntryProps) {
    const { t } = useTranslation();

    const totalEntries = Array.from(order.line_items).reduce((acc, item) => {
        return acc + item.num_entries;
    }, 0);

    return (
        <>
            <div className="flex w-full items-center">
                <ul
                    className="w-2/4"
                    data-testid={
                        DonationHistoryEntryTestIds.DONATION_HISTORY_CONTAINER
                    }
                >
                    <li
                        className="font-bold text-gray-900 text-base leading-9 mb-1"
                        data-testid={
                            DonationHistoryEntryTestIds.DONATION_HISTORY_CREATED_AT
                        }
                    >
                        {formatDateToLocalString(order.order_date)}
                    </li>
                    <li
                        className="text-sm leading-9 text-navy-600 mb-1"
                        data-testid={
                            DonationHistoryEntryTestIds.DONATION_HISTORY_ORDER_ID
                        }
                    >
                        {t('account.donationHistory.order.title', {
                            orderId: order.id,
                        })}
                    </li>
                    <li
                        className="text-sm leading-9 text-navy-600 mb-1"
                        data-testid={
                            DonationHistoryEntryTestIds.DONATION_HISTORY_TOTAL_ENTRIES
                        }
                    >
                        {t('account.donationHistory.totalEntries')}:{' '}
                        {formatNumber(totalEntries)}
                    </li>
                    <li
                        className="text-gray-900 text-sm leading-9 font-medium"
                        data-testid={
                            DonationHistoryEntryTestIds.DONATION_HISTORY_TOTAL_AMOUNT
                        }
                    >
                        {t('account.donationHistory.donationTotal')}:{' '}
                        {formatCentsWithCurrency(order.amount, order.currency)}
                    </li>
                </ul>
                <Link href={getAccountRoute(`history/detail/${order.id}`)}>
                    <a className="ml-auto text-xs md:text-med text-gray-900 font-bold leading-9 flex items-center">
                        <span className="mr-1">See more details</span>{' '}
                        <div className="mt-[2px]">
                            <OzIcon
                                type={ICON_TYPE.OZ_ARROW_RIGHT}
                                size={ICON_SIZE.SMALL}
                                color={ICON_COLOR.DARK}
                            />
                        </div>
                    </a>
                </Link>
            </div>
            <OzDivider className="w-full my-2" />
        </>
    );
}
