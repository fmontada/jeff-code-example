import { OzLogo } from '@omaze/omaze-ui';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { AccountMenu } from '../Account';

import { HeaderTestIds } from '@/components/Header/HeaderTestIds';
import { Menu } from '@/components/Menu';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { useCartStore } from '@/store/useCartStore';
import { IWithClassName, IWithDataTestId } from '@/types/components';

export type IHeaderProps = IWithClassName & IWithDataTestId;

export function Header(props: IHeaderProps) {
    const router = useRouter();
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const headerRef = useRef<HTMLElement>(null);

    const { className = '', 'data-testid': dataTestId } = props;
    const cart = useCartStore((store) => store.cart);
    const [totalItemsInCart, setTotalItemsInCart] = useState<number>();

    const inMaintenanceMode =
        process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED === '1';

    function toggleMenu() {
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        if (!cart?.line_items) {
            setTotalItemsInCart(0);
            return;
        }

        const totalItems = cart.line_items.reduce((prev, lineItem) => {
            return prev + lineItem.quantity;
        }, 0);

        setTotalItemsInCart(totalItems);
    }, [cart]);

    const menuLineBaseClassNames = {
        'block absolute bg-white-500 transform transition duration-500 ease-in-out w-[25.75px] h-[2.75px]':
            true,
        'z-30': isOpen,
    };

    const firstLineClassNames = classNames({
        ...menuLineBaseClassNames,
        'rotate-45': isOpen,
        '-translate-y-[4px]': !isOpen,
    });

    const secondLineClassNames = classNames({
        ...menuLineBaseClassNames,
        '-rotate-45': isOpen,
        'translate-y-[4px]': !isOpen,
    });

    const headerClassName = `bg-navy-900 flex items-center justify-between md:justify-between w-full h-8 px-3 md:px-[168px] ${className}`;

    if (inMaintenanceMode) {
        return (
            <header
                className={headerClassName}
                data-testid={dataTestId}
                ref={headerRef}
            >
                <div className="flex">
                    <Link href="/">
                        <a className="z-30">
                            <OzLogo
                                data-testid={HeaderTestIds.HEADER_LOGO_FULL}
                            />
                        </a>
                    </Link>
                </div>
            </header>
        );
    }

    return (
        <>
            <header
                className={headerClassName}
                data-testid={dataTestId}
                ref={headerRef}
            >
                <div className="flex">
                    <div className="pr-3 md:hidden">
                        <button
                            className="w-4 h-4 relative focus:outline-none text-white -top-[5px]"
                            onClick={toggleMenu}
                            data-testid={
                                HeaderTestIds.HEADER_TOGGLE_MENU_BUTTON
                            }
                        >
                            <div className="block w-1 absolute left-1 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
                                <div className={firstLineClassNames}></div>
                                <div className={secondLineClassNames}></div>
                            </div>
                        </button>
                    </div>
                    <Link href="/">
                        <a className="z-30">
                            {isOpen ? (
                                <div className="relative top-[1px]">
                                    <Image
                                        src={'/assets/images/omaze-logo.svg'}
                                        alt="Omaze"
                                        height={30}
                                        width={30}
                                        data-testid={
                                            HeaderTestIds.HEADER_LOGO_SIMPLE
                                        }
                                    />
                                </div>
                            ) : (
                                <OzLogo
                                    data-testid={HeaderTestIds.HEADER_LOGO_FULL}
                                />
                            )}
                        </a>
                    </Link>
                </div>
                <div className="flex items-center">
                    <div className="pr-3">
                        <AccountMenu />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => router.push('/cart')}
                            type="button"
                            aria-label="Cart"
                            data-testid={HeaderTestIds.HEADER_CART_BUTTON}
                        >
                            <Image
                                src="/assets/images/cart-icon-white.svg"
                                layout="fixed"
                                width={32}
                                height={32}
                                alt={t('header.cartIcon')}
                            />
                        </button>
                        {totalItemsInCart ? (
                            <div className="avatar aspect-square rounded-full bg-yellow-800 w-[17px] h-[17px] absolute top-0 right-0 flex justify-center items-center">
                                <div
                                    className="text-xs font-bold"
                                    data-testid={
                                        HeaderTestIds.CART_ITEMS_AMOUNT
                                    }
                                >
                                    {totalItemsInCart}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </header>
            <Menu
                closeMenu={toggleMenu}
                isOpen={isOpen}
                headerElement={headerRef?.current}
            />
        </>
    );
}
