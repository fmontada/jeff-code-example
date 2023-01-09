import { OzDivider, OzSkeletonBox, SKELETON_BOX_SIZE } from '@omaze/omaze-ui';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import { LineItem, Order, Status } from '@/api/orders';
import { useStrapiSweepstakeBySlug } from '@/hooks/useStrapiSweepstakeBySlug';
import { useSweepstakeById } from '@/hooks/useSweepstakeById';
import { formatCentsWithCurrency } from '@/utils/formatNumbers';
import { filterSubprizeAfterDate } from '@/utils/subprizes';

import { OrderLineItemTestIds } from './OrderLineItemTestIds';

export interface IOrderLineItemProps {
    lineItem: LineItem;
    order: Order;
}

export function OrderLineItem({ lineItem, order }: IOrderLineItemProps) {
    const { t } = useTranslation();
    const refundedLine = lineItem.status === Status.Refunded;
    const numEntriesClassName = classNames({
        'font-bold': true,
        'line-through': refundedLine,
    });
    const pricingClassName = classNames({
        'font-bold': true,
        'text-teal-800 line-through': refundedLine,
    });

    const { data: sweepstakeData } = useSweepstakeById(lineItem.sweepstakes_id);

    const {
        data: strapiData,
        error: errorStrapiData,
        isLoading: isLoadingStrapiData,
    } = useStrapiSweepstakeBySlug(sweepstakeData?.slug, !!sweepstakeData);

    const isStrapiDataReady =
        !isLoadingStrapiData && !errorStrapiData && !!strapiData;

    const filteredSubprizes = sweepstakeData?.subprizes?.filter((subprize) =>
        filterSubprizeAfterDate(subprize, new Date(lineItem.created_at)),
    );
    const hasSubprizes = filteredSubprizes?.length > 0;
    const cartLineItemNote = hasSubprizes
        ? 'cart.lineItem.noteWithSubprizes'
        : 'cart.lineItem.noteWithoutSubprizes';

    return (
        <>
            <div className="flex flex-col w-full">
                <div className="flex w-full items-center">
                    <div
                        data-testid={OrderLineItemTestIds.ORDER_LINE_ITEM_IMAGE}
                        className="bg-gray-300 w-1/3 md:w-[108px] h-auto mr-1 text-xl flex items-center justify-center mb-auto"
                    >
                        {isStrapiDataReady ? (
                            <Image
                                src={
                                    strapiData.attributes.heroImage.data[0]
                                        .attributes.url
                                }
                                alt={strapiData.attributes.prizeDetailsTitle}
                                height={108}
                                width={108}
                            />
                        ) : (
                            <OzSkeletonBox />
                        )}
                    </div>
                    <ul
                        data-testid={
                            OrderLineItemTestIds.ORDER_LINE_ITEM_CONTAINER
                        }
                        className="w-2/3 md:w-full"
                    >
                        <li className="text-gray-900 font-medium text-sm leading-9 mb-[4px]">
                            <div
                                data-testid={
                                    OrderLineItemTestIds.ORDER_LINE_ITEM_SWEEPSTAKES_TITLE
                                }
                            >
                                {isStrapiDataReady ? (
                                    t(cartLineItemNote, {
                                        prize: strapiData.attributes
                                            .prizeDetailsTitle,
                                    })
                                ) : (
                                    <OzSkeletonBox
                                        size={SKELETON_BOX_SIZE.SIZE_5}
                                    />
                                )}
                            </div>
                            {hasSubprizes ? (
                                <ul
                                    className="list-disc pl-3"
                                    data-testid={
                                        OrderLineItemTestIds.ORDER_LINE_ITEM_SUBPRIZES
                                    }
                                >
                                    {filteredSubprizes.map((subprize) => {
                                        return (
                                            <li
                                                key={`cart_line_item_${subprize.id}`}
                                            >
                                                {subprize.name}
                                            </li>
                                        );
                                    })}
                                </ul>
                            ) : null}
                        </li>
                        <li
                            className="text-gray-900 text-xs leading-9 font-normal italic mt-1"
                            data-testid={
                                OrderLineItemTestIds.ORDER_LINE_ITEM_CHARITY
                            }
                        >
                            {isStrapiDataReady ? (
                                t('cartOrder.supporting', {
                                    charityName:
                                        strapiData.attributes.charityInfo
                                            ?.charityDetailsTitle,
                                })
                            ) : (
                                <OzSkeletonBox
                                    size={SKELETON_BOX_SIZE.SIZE_3}
                                />
                            )}
                        </li>
                    </ul>
                </div>
                <ul className="flex justify-between mt-2">
                    <li
                        data-testid={
                            OrderLineItemTestIds.ORDER_LINE_ITEM_QUANTITY
                        }
                    >
                        {t('cartOrder.quantity', {
                            quantity: lineItem.quantity,
                        })}
                    </li>
                    <li
                        data-testid={
                            OrderLineItemTestIds.ORDER_LINE_ITEM_NUM_ENTRIES
                        }
                        className={numEntriesClassName}
                    >
                        {t('cartOrder.entries', {
                            numEntries: lineItem.num_entries,
                        })}
                    </li>
                    <li
                        data-testid={OrderLineItemTestIds.ORDER_LINE_ITEM_PRICE}
                        className={pricingClassName}
                    >
                        {formatCentsWithCurrency(
                            lineItem.amount,
                            order.currency,
                        )}
                    </li>
                </ul>
                {refundedLine ? (
                    <div
                        data-testid={
                            OrderLineItemTestIds.ORDER_LINE_ITEM_REFUNDED_LABEL
                        }
                        className="text-teal-800 font-bold w-full text-right tracking-wide text-sm"
                    >
                        ({t('account.donationHistory.order.refunded')})
                    </div>
                ) : null}
            </div>
            <OzDivider className="w-full my-2" />
        </>
    );
}
