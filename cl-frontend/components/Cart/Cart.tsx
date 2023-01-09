import { BUTTON_SIZE, BUTTON_STYLE, OzButton } from '@omaze/omaze-ui';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import type { Cart as CartInterface } from '@/api/orders';
import { formatCentsWithCurrency } from '@/utils/formatNumbers';

import { CartLineItem } from './CartLineItem';
import { CartTestIds } from './CartTestIds';
import { CartWarning } from './CartWarning';

export interface ICartProps {
    cart: CartInterface | null;
}

export interface ICartPayLineProps {
    inTop: boolean;
    totalAmount: number;
    topShown: boolean;
}

function CartPayLine({ inTop, totalAmount, topShown }: ICartPayLineProps) {
    const { t } = useTranslation();

    const cartPayLineClassName = classNames({
        'md:hidden top-0 fixed w-screen z-10 p-3 bg-white-500 shadow-xl': inTop,
        'w-full mb-2': !inTop,
        'hidden md:block': !inTop && topShown,
    });

    return (
        <div className={cartPayLineClassName}>
            <div className="flex items-center justify-between">
                <div className="w-2/4">{t('cart.subtotal')}</div>
                <div className="w-2/4 text-right">
                    {formatCentsWithCurrency(totalAmount)}
                </div>
            </div>
            <Link href="/checkout" passHref>
                <a>
                    <OzButton
                        style={BUTTON_STYLE.PRIMARY}
                        size={BUTTON_SIZE.MEDIUM}
                        className="w-full mt-2"
                    >
                        {t('checkout.title')}
                    </OzButton>
                </a>
            </Link>
        </div>
    );
}

export function Cart({ cart }: ICartProps) {
    const [notInTop, setNotInTop] = useState<boolean>(false);

    useEffect(() => {
        function updateNotInTop() {
            setNotInTop(window.scrollY > 100);
        }

        window.addEventListener('scroll', updateNotInTop);

        return () => {
            window.removeEventListener('scroll', updateNotInTop);
        };
    }, []);

    return (
        <>
            {notInTop ? (
                <CartPayLine
                    inTop
                    totalAmount={cart.total_amount}
                    topShown={false}
                />
            ) : null}
            <div
                className="flex flex-col mt-3 w-full px-3 md:px-0"
                data-testid={CartTestIds.CART_CONTAINER}
            >
                {cart.line_items.map((lineItem) => {
                    return (
                        <CartLineItem
                            cart={cart}
                            lineItem={lineItem}
                            key={`cart_line_item_${lineItem.id}`}
                            showDivider={cart.line_items.length > 1}
                        />
                    );
                })}
                <div className="mt-2">
                    <CartPayLine
                        inTop={false}
                        topShown={notInTop}
                        totalAmount={cart.total_amount}
                    />
                </div>
            </div>
            <CartWarning />
        </>
    );
}
