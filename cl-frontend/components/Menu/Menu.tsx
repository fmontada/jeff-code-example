import { User, useAuth0 } from '@auth0/auth0-react';
import {
    BUTTON_SIZE,
    BUTTON_STYLE,
    OzButton,
    OzDivider,
} from '@omaze/omaze-ui';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { SweepsStatus } from '@/api/sweepstakes';
import { getAccountRoute, getSweepstakeRoute } from '@/constants/routes';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { useSweepstakesStore } from '@/store/useSweepstakesStore';

import { MenuTestIds } from './MenuTestIds';

export interface IMenuProps {
    closeMenu: () => void;
    isOpen: boolean;
    headerElement?: HTMLElement;
}

export function Menu({ closeMenu, isOpen, headerElement }: IMenuProps) {
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0<User>();
    const sweepstakes = useSweepstakesStore((store) => store.sweepstakes);
    const [headerHeight, setHeaderHeight] = useState<number>(0);

    useEffect(() => {
        if (!headerElement) {
            return;
        }

        const headerBoundingRect = headerElement.getBoundingClientRect();
        const distanceHeaderToTop = window.pageYOffset + headerBoundingRect.top;
        setHeaderHeight(distanceHeaderToTop);
    }, [headerElement]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'visible';
        }

        return () => {
            document.body.style.overflow = 'visible';
        };
    }, [isOpen]);

    const containerClassNames = classNames({
        'fixed w-full h-full bg-navy-900 z-20 transition duration-500 ease-in-out flex flex-col text-white-500 md:hidden':
            true,
        '-translate-x-[100%] pointer-events-none': !isOpen,
    });

    const activePrizes = useMemo(() => {
        if (!sweepstakes || !Array.isArray(sweepstakes)) {
            return [];
        }

        return sweepstakes.filter(
            (sweepstake) => sweepstake.status === SweepsStatus.Open,
        );
    }, [sweepstakes]);

    const oldPrizes = useMemo(() => {
        if (!sweepstakes || !Array.isArray(sweepstakes)) {
            return [];
        }

        return sweepstakes.filter(
            (sweepstake) => sweepstake.status !== SweepsStatus.Open,
        );
    }, [sweepstakes]);

    return (
        <div
            className={containerClassNames}
            data-testid={MenuTestIds.MENU_CONTAINER}
            data-test-status={isOpen ? 'open' : 'close'}
            style={{
                marginTop: headerHeight ? `${headerHeight}px` : undefined,
            }}
        >
            <div className="mt-12 pb-6 container px-4 md:px-0 text-base leading-9 overflow-y-auto">
                {t('header.menu.prizes')}
                <ul className="mt-3" data-testid={MenuTestIds.MENU_SWEEPSTAKES}>
                    {activePrizes.map((sweepstake) => {
                        return (
                            <li
                                key={`menu_sweepstake_${sweepstake.id}`}
                                className="text-base leading-9 font-bold my-3 ml-3"
                                data-testid={
                                    MenuTestIds.MENU_SWEEPSTAKES_SINGLE
                                }
                            >
                                <Link
                                    href={getSweepstakeRoute(sweepstake.slug)}
                                >
                                    <a onClick={closeMenu}>
                                        {sweepstake.title}
                                    </a>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                {t('header.menu.pastDraws')}
                <ul
                    className="mt-3"
                    data-testid={MenuTestIds.MENU_PAST_SWEEPSTAKES}
                >
                    {oldPrizes.map((sweepstake) => {
                        return (
                            <li
                                key={`menu_sweepstake_past_${sweepstake.id}`}
                                className="text-base leading-9 font-bold my-3 ml-3"
                                data-testid={
                                    MenuTestIds.MENU_SWEEPSTAKES_PAST_SINGLE
                                }
                            >
                                <Link
                                    href={getSweepstakeRoute(sweepstake.slug)}
                                >
                                    <a onClick={closeMenu}>
                                        {sweepstake.title}
                                    </a>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                <OzDivider className="my-4" />
                {isAuthenticated ? (
                    <div
                        className="flex flex-col font-bold text-med leading-9"
                        data-testid={MenuTestIds.MENU_AUTHENTICATED}
                    >
                        <Link href={getAccountRoute()}>
                            <a
                                className="flex items-center"
                                onClick={closeMenu}
                                data-testid={MenuTestIds.MENU_MY_ACCOUNT}
                            >
                                <Image
                                    src="/assets/images/user-icon.svg"
                                    alt={t('header.menu.myAccount')}
                                    width={24}
                                    height={24}
                                />{' '}
                                <div className="ml-2">
                                    {t('header.menu.myAccount')}
                                </div>
                            </a>
                        </Link>
                        <button
                            className="mt-4 text-left font-bold"
                            onClick={() =>
                                logout({ returnTo: window.location.origin })
                            }
                            data-testid={MenuTestIds.MENU_LOGOUT}
                        >
                            {t('header.accountMenu.logout')}
                        </button>
                    </div>
                ) : (
                    <div
                        className="flex items-center justify-between w-full mt-4"
                        data-testid={MenuTestIds.MENU_GUEST}
                    >
                        <OzButton
                            style={BUTTON_STYLE.PRIMARY}
                            size={BUTTON_SIZE.MEDIUM}
                            className="w-full mr-2"
                            onClick={loginWithRedirect}
                            data-testid={MenuTestIds.MENU_LOGIN_BTN}
                        >
                            {t('header.menu.login')}
                        </OzButton>
                        <OzButton
                            style={BUTTON_STYLE.SECONDARY}
                            size={BUTTON_SIZE.MEDIUM}
                            className="w-full text-white-500 pl-2 border-white-500"
                            onClick={loginWithRedirect}
                            data-testid={MenuTestIds.MENU_SIGN_UP_BTN}
                        >
                            {t('header.menu.signUp')}
                        </OzButton>
                    </div>
                )}
            </div>
        </div>
    );
}
