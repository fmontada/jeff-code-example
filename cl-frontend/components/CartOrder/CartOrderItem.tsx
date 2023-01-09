import { OzDivider, OzSkeletonBox, SKELETON_BOX_SIZE } from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { ICartStoreLineItem } from 'types/api';

import { getSweepstakeRoute } from '@/constants/routes';
import { formatCentsWithCurrency, formatNumber } from '@/utils/formatNumbers';
import { filterOpenedSubprizes } from '@/utils/subprizes';

import { CartOrderTestIds } from './CartOrderTestIds';

export interface ICartOrderItemProps {
    lineItem: ICartStoreLineItem;
    showDivider: boolean;
}

export function CartOrderItem({ lineItem, showDivider }: ICartOrderItemProps) {
    const { t } = useTranslation();

    const openSubprizes = lineItem.sweepstake?.subprizes?.filter(
        filterOpenedSubprizes,
    );

    const cartLineItemNote =
        openSubprizes?.length > 0
            ? 'cart.lineItem.noteWithSubprizes'
            : 'cart.lineItem.noteWithoutSubprizes';

    const heroImageUrl =
        lineItem.strapiData?.attributes?.heroImage?.data?.[0]?.attributes?.url;
    const prizeDetailTitle = lineItem.strapiData?.attributes?.prizeDetailsTitle;
    const charityDetailsTitle =
        lineItem.strapiData?.attributes?.charityInfo?.charityDetailsTitle;

    return (
        <>
            <div className="flex flex-col w-full pt-2 leading-9 text-gray-900 tracking-wide">
                <div className="flex">
                    <div className="relative">
                        {heroImageUrl ? (
                            <Link
                                href={getSweepstakeRoute(
                                    lineItem.sweepstake.slug,
                                )}
                            >
                                <a>
                                    <Image
                                        data-testid={
                                            CartOrderTestIds.CART_ORDER_IMAGE
                                        }
                                        src={heroImageUrl}
                                        width={108}
                                        height={108}
                                        alt={t('cartOrder.orderImage')}
                                    />
                                </a>
                            </Link>
                        ) : (
                            <OzSkeletonBox size={SKELETON_BOX_SIZE.SIZE_8} />
                        )}
                    </div>
                    <div className="flex flex-col ml-2">
                        <Link
                            href={getSweepstakeRoute(lineItem.sweepstake.slug)}
                        >
                            <a>
                                <div
                                    className="font-medium text-sm mb-[4px] leading-9"
                                    data-testid={
                                        CartOrderTestIds.CART_ORDER_DESCRIPTION
                                    }
                                >
                                    {prizeDetailTitle ? (
                                        t(cartLineItemNote, {
                                            prize: prizeDetailTitle,
                                        })
                                    ) : (
                                        <OzSkeletonBox
                                            size={SKELETON_BOX_SIZE.SIZE_5}
                                        />
                                    )}
                                    {openSubprizes?.length > 0 && (
                                        <ul className="list-disc pl-3">
                                            {openSubprizes.map((subprize) => {
                                                return (
                                                    <li
                                                        key={`cart_line_item_${subprize.id}`}
                                                    >
                                                        {subprize.name}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>
                                <p className="font-medium text-xs leading-9 italic">
                                    {charityDetailsTitle ? (
                                        t('cartOrder.supporting', {
                                            charityName:
                                                lineItem.strapiData.attributes
                                                    .charityInfo
                                                    ?.charityDetailsTitle,
                                        })
                                    ) : (
                                        <OzSkeletonBox
                                            size={SKELETON_BOX_SIZE.SIZE_4}
                                        />
                                    )}
                                </p>
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div
                        data-testid={CartOrderTestIds.CART_ORDER_QUANTITY}
                        className="text-sm font-medium leading-9 relative top-[1.5px]"
                    >
                        {t('cartOrder.quantity', {
                            quantity: lineItem.quantity,
                        })}
                    </div>
                    <div
                        data-testid={CartOrderTestIds.CART_ORDER_ENTRIES}
                        className="text-base font-bold leading-9"
                    >
                        {t('cartOrder.entries', {
                            numEntries: formatNumber(lineItem.num_entries),
                        })}
                    </div>
                    <div
                        data-testid={CartOrderTestIds.CART_ORDER_PRICE}
                        className="text-base font-bold leading-9"
                    >
                        {formatCentsWithCurrency(lineItem.amount)}
                    </div>
                </div>
            </div>
            {showDivider ? <OzDivider className="mt-2" /> : null}
        </>
    );
}
