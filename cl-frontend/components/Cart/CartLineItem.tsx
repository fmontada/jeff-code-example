import { OzDivider, OzSkeletonBox, SKELETON_BOX_SIZE } from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

import { CartItem } from '@/api/orders';
import { getSweepstakeRoute } from '@/constants/routes';
import { getUserQuery } from '@/queries/getUserQuery';
import { useCartStore } from '@/store/useCartStore';
import { useUserStore } from '@/store/useUserStore';
import { ICartStore, ICartStoreLineItem } from '@/types/api';
import { getCartApi } from '@/utils/api';
import { formatCentsWithCurrency, formatNumber } from '@/utils/formatNumbers';
import { appendStripeDataToCart } from '@/utils/formatter';
import { filterOpenedSubprizes } from '@/utils/subprizes';
import { trackChangeOfCartEvent } from '@/utils/tracking/trackChangeOfCartEvent';

import { CartSkeleton } from './CartSkeleton';
import { CartTestIds } from './CartTestIds';

export interface ICartLineItemProps {
    cart: ICartStore;
    lineItem: ICartStoreLineItem;
    showDivider: boolean;
}

export function CartLineItem({
    cart,
    lineItem,
    showDivider = false,
}: ICartLineItemProps) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const setCartStore = useCartStore((store) => store.set);

    const authorizationToken = useUserStore(
        (store) => store.authorizationToken,
    );

    const { data: user } = useQuery('userData', getUserQuery, {
        enabled: !!authorizationToken,
        retry: false,
    });

    async function increaseQuantity(event: React.FormEvent<HTMLButtonElement>) {
        changeQuantity(event, lineItem.quantity + 1);
    }

    async function decreaseQuantity(event: React.FormEvent<HTMLButtonElement>) {
        changeQuantity(event, lineItem.quantity - 1);
    }

    async function changeQuantity(
        event: React.FormEvent<HTMLButtonElement>,
        newQuantity: number,
    ) {
        event.stopPropagation();
        event.preventDefault();

        const cartItems = formatCartItems(newQuantity);

        try {
            setIsLoading(true);
            let newCart = undefined;

            if (cartItems.length === 0) {
                removeCart();
            } else {
                newCart = await updateAndReturnCartInStore(cartItems);
            }

            trackChangeOfCartEvent(user?.email, newCart);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    function formatCartItems(newQuantity: number) {
        const cartItems: CartItem[] = [];

        for (const cartLineItem of cart.line_items) {
            const newCartLineItem = { ...cartLineItem };
            const isThislineItem =
                lineItem.external_id === newCartLineItem.external_id;
            const isDeleting = newQuantity === 0;

            if (isThislineItem && !isDeleting) {
                newCartLineItem.quantity = newQuantity;
            } else if (isThislineItem) {
                continue;
            }

            cartItems.push({
                ...newCartLineItem,
                external_id: newCartLineItem.external_id,
            });
        }

        return cartItems;
    }

    function removeCart() {
        setCartStore((store) => {
            store.cart = undefined;
        });
    }

    async function updateAndReturnCartInStore(cartItems: CartItem[]) {
        const cartApi = getCartApi();
        const { data: cartData } = await cartApi.putV1CartById(
            cart.id,
            cartItems,
        );
        const newCart = await appendStripeDataToCart(cartData);

        setCartStore((store) => {
            store.cart = newCart;
        });

        return newCart;
    }

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
            <div
                className={`flex flex-col w-full ${isLoading ? 'hidden' : ''}`}
                data-testid={CartTestIds.CART_LINE_ITEM}
            >
                <div className="flex w-full mb-1">
                    <div className="w-1/3 md:w-1/6 max-w-[108px]">
                        {heroImageUrl && prizeDetailTitle ? (
                            <Link
                                href={getSweepstakeRoute(
                                    lineItem.sweepstake.slug,
                                )}
                            >
                                <a>
                                    <Image
                                        src={heroImageUrl}
                                        height={108}
                                        width={108}
                                        alt={prizeDetailTitle}
                                        className="rounded"
                                    />
                                </a>
                            </Link>
                        ) : (
                            <OzSkeletonBox size={SKELETON_BOX_SIZE.SIZE_8} />
                        )}
                    </div>
                    <div className="w-2/3 md:w-5/6 pl-2 flex flex-col">
                        <Link
                            href={getSweepstakeRoute(lineItem.sweepstake.slug)}
                        >
                            <a>
                                <div
                                    className="text-sm leading-9 tracking-wide text-gray-900 font-medium mb-[4px]"
                                    data-testid={
                                        CartTestIds.CART_LINE_ITEM_TITLE
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
                            </a>
                        </Link>
                        {charityDetailsTitle ? (
                            <Link
                                href={getSweepstakeRoute(
                                    lineItem.sweepstake.slug,
                                )}
                            >
                                <a>
                                    <p
                                        data-testid={
                                            CartTestIds.CART_LINE_ITEM_CHARITY
                                        }
                                        className="italic font-medium text-xs leading-9"
                                    >
                                        {t('cart.lineItem.supporting', {
                                            charity: charityDetailsTitle,
                                        })}
                                    </p>
                                </a>
                            </Link>
                        ) : (
                            <OzSkeletonBox size={SKELETON_BOX_SIZE.SIZE_4} />
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="w-1/3 md:w-1/6 max-w-[108px] h-4 flex justify-between items-center text-sm font-bold text-gray-900 tracking-wide leading-9 border-2 border-gray-400 rounded">
                        <button
                            className="w-1/3 h-4 border-r-2 border-gray-400 flex items-center justify-center"
                            onClick={decreaseQuantity}
                            onKeyDown={decreaseQuantity}
                            type="button"
                            data-testid={CartTestIds.CART_LINE_ITEM_DECREASE}
                        >
                            {lineItem.quantity === 1 ? (
                                <Image
                                    src="/assets/images/trash-icon.svg"
                                    width={14}
                                    height={16}
                                    alt={t('checkout.remove')}
                                    data-testid={
                                        CartTestIds.CART_LINE_ITEM_ICON_TRASH
                                    }
                                />
                            ) : (
                                <Image
                                    src="/assets/images/minus-icon.svg"
                                    width={12}
                                    height={1.67}
                                    alt={t('checkout.reduceQuantity')}
                                    data-testid={
                                        CartTestIds.CART_LINE_ITEM_ICON_MINUS
                                    }
                                />
                            )}
                        </button>
                        <div
                            className="w-1/3 h-4 font-bold flex items-center justify-center relative -top-[2px]"
                            data-testid={CartTestIds.CART_LINE_ITEM_QUANTITY}
                        >
                            {lineItem.quantity}
                        </div>
                        <button
                            className="w-1/3 h-4 border-l-2 border-gray-400 flex items-center justify-center"
                            onClick={increaseQuantity}
                            onKeyDown={increaseQuantity}
                            type="button"
                            data-testid={CartTestIds.CART_LINE_ITEM_INCREASE}
                        >
                            <Image
                                src="/assets/images/plus-icon.svg"
                                width={12}
                                height={12}
                                alt={t('checkout.increaseQuantity')}
                                data-testid={
                                    CartTestIds.CART_LINE_ITEM_ICON_PLUS
                                }
                            />
                        </button>
                    </div>
                    <div className="flex items-center w-2/3 md:w-5/6 flex-grow pl-2 leading-9 tracking-wide text-gray-900 font-bold text-base justify-between">
                        <span data-testid={CartTestIds.CART_LINE_ITEM_ENTRIES}>
                            {t('general.entries', {
                                numEntries: formatNumber(lineItem.num_entries),
                            })}
                        </span>{' '}
                        <div
                            className="ml-auto"
                            data-testid={CartTestIds.CART_LINE_ITEM_AMOUNT}
                        >
                            {formatCentsWithCurrency(lineItem.amount)}
                        </div>
                    </div>
                </div>
            </div>
            {isLoading ? <CartSkeleton /> : null}
            {showDivider ? <OzDivider /> : null}
        </>
    );
}
