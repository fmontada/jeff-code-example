import { BUTTON_SIZE, BUTTON_STYLE, OzButton } from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

import { CartTestIds } from './CartTestIds';

export function EmptyCart() {
    const { t } = useTranslation();

    return (
        <div
            className="flex flex-col items-center justify-between flex-grow"
            data-testid={CartTestIds.CART_EMPTY_CONTAINER}
        >
            <p className="mt-3 text-base leading-9">{t('cart.emptyCart')}</p>
            <Link href="/" passHref>
                <a
                    className="block mt-auto mb-3"
                    data-testid={CartTestIds.SHOP_NOW}
                >
                    <OzButton
                        size={BUTTON_SIZE.MEDIUM}
                        style={BUTTON_STYLE.PRIMARY}
                    >
                        {t('cart.shopNow')}
                    </OzButton>
                </a>
            </Link>
        </div>
    );
}
