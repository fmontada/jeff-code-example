import {
    COLLAPSE_SIZES,
    COLLAPSE_STYLES,
    OzCollapse,
    OzDivider,
} from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useState } from 'react';

import { CartOrderTestIds } from '@/components/CartOrder/CartOrderTestIds';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { useCartStore } from '@/store/useCartStore';
import { ICartStore } from '@/types/api';
import { formatCentsWithCurrency } from '@/utils/formatNumbers';

import { CartOrderItem } from './CartOrderItem';

export interface ICartOrderProps {
    cartOrder?: ICartStore | null;
    defaultOpenState?: boolean;
}

export function CartOrder({
    cartOrder,
    defaultOpenState = true,
}: ICartOrderProps) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(defaultOpenState);
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const cart = useCartStore((store) => store.cart);
    const orderData = cartOrder || cart;

    if (!orderData) {
        return null;
    }

    return (
        <>
            <div
                data-testid={CartOrderTestIds.CART_ORDER_CONTAINER}
                className="w-full bg-gray-50 py-2 px-3 items-center relative"
            >
                <OzCollapse
                    buttonClassName="w-full items-center mb-1"
                    style={COLLAPSE_STYLES.TEXT}
                    size={COLLAPSE_SIZES.SMALL}
                    expanded={isDrawerOpen}
                >
                    <OzCollapse.Title>
                        <div className="flex justify-between">
                            <div className="mr-1">
                                <Image
                                    data-testid={
                                        CartOrderTestIds.CART_ORDER_CART_ICON
                                    }
                                    src="/assets/images/cart-icon-black.svg"
                                    layout="fixed"
                                    width={35}
                                    height={35}
                                    alt={t('cartOrder.cartIconAlt')}
                                />
                            </div>
                            <div
                                data-testid={
                                    CartOrderTestIds.CART_ORDER_COLLAPSE
                                }
                                className="self-center"
                                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                            >
                                {isDrawerOpen ? (
                                    <h4>
                                        {t('cartOrder.hideOrderSummaryLabel')}
                                    </h4>
                                ) : (
                                    <h4>
                                        {t('cartOrder.showOrderSummaryLabel')}
                                    </h4>
                                )}
                            </div>
                        </div>
                    </OzCollapse.Title>
                    <OzCollapse.Content>
                        {orderData.line_items.map((lineItem, index) => {
                            return (
                                <CartOrderItem
                                    key={lineItem.order_id}
                                    lineItem={lineItem}
                                    showDivider={
                                        index < orderData.line_items.length - 1
                                    }
                                />
                            );
                        })}
                    </OzCollapse.Content>
                </OzCollapse>
                <div className="text-gray-900 font-bold absolute right-3 top-[20px]">
                    {formatCentsWithCurrency(
                        orderData?.total_amount || 0,
                        'USD',
                    )}
                </div>
            </div>
            <OzDivider className="mt-0" />
        </>
    );
}
