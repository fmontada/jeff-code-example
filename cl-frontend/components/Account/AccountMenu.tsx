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
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

import { getAccountRoute } from '@/constants/routes';
import { COMMON_TRANSLATIONS } from '@/constants/translations';

import { AccountMenuTestIds } from './AccountTestIds';

interface IMenuItem {
    text: string;
    href: string;
}

export function AccountMenu() {
    const { t } = useTranslation(COMMON_TRANSLATIONS);

    const menuContainer = useRef<HTMLDivElement>(null);

    const { isAuthenticated, user, loginWithRedirect, logout } =
        useAuth0<User>();

    const [open, setOpen]: [boolean, Dispatch<SetStateAction<boolean>>] =
        useState<boolean>(false);

    const MenuOptions: IMenuItem[] = [
        {
            text: 'header.accountMenu.donationHistory',
            href: getAccountRoute('history'),
        },
        {
            text: 'header.accountMenu.accountSettings',
            href: getAccountRoute('settings'),
        },
    ];

    function handleAccountOnClick(): void {
        if (isAuthenticated) {
            setOpen(!open);
        } else {
            loginWithRedirect();
        }
    }

    useEffect(() => {
        function handleDocumentClick(event): void {
            if (!menuContainer) {
                return;
            }

            if (!menuContainer.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener('click', handleDocumentClick);

        return () => document.removeEventListener('click', handleDocumentClick);
    }, [menuContainer]);

    const accountClassName = classNames({
        'absolute right-0 w-[258px] z-20 top-4': true,
        hidden: !open,
    });

    return (
        <div ref={menuContainer} className="relative">
            <button
                onClick={handleAccountOnClick}
                type="button"
                aria-label="Account options"
                data-testid={AccountMenuTestIds.ACCOUNT_MENU_BUTTON}
            >
                <Image
                    src="/assets/images/user-icon.svg"
                    layout="fixed"
                    width={24}
                    height={24}
                    alt="account-icon"
                />
            </button>
            <div className={accountClassName}>
                <span className="right-0 absolute inline-block bg-white-500 transform rotate-45 w-3 h-3" />
                <ul className="pt-3 pb-2 mt-[10px] ml-2 -mr-[20px] bg-white-500 shadow-lg">
                    <li className="py-1 px-4 text-lg text-navy-600 font-bold">
                        {t('header.accountMenu.hi', {
                            name: user?.given_name || 'Omazer',
                        })}
                    </li>
                    {MenuOptions.map((option) => {
                        return (
                            <li className="py-1 px-4" key={option.text}>
                                <Link href={option.href} passHref>
                                    <a>
                                        <OzButton
                                            className="h-auto text-left after:!h-0"
                                            size={BUTTON_SIZE.MEDIUM}
                                            style={BUTTON_STYLE.LINK}
                                        >
                                            {t(option.text)}
                                        </OzButton>
                                    </a>
                                </Link>
                            </li>
                        );
                    })}
                    <li className="py-1 px-4">
                        <OzDivider className="my-1" />
                    </li>
                    <li className="py-1 px-4">
                        <OzButton
                            className="h-auto underline underline-offset-4 after:!h-0"
                            size={BUTTON_SIZE.SMALL}
                            style={BUTTON_STYLE.LINK}
                            data-testid={
                                AccountMenuTestIds.ACCOUNT_MENU_LOGOUT_BUTTON
                            }
                            onClick={() =>
                                logout({ returnTo: window.location.origin })
                            }
                        >
                            {t('header.accountMenu.logout')}
                        </OzButton>
                    </li>
                </ul>
            </div>
        </div>
    );
}
