import { useTranslation } from 'next-i18next';

import { CartTestIds } from './CartTestIds';

export function CartWarning() {
    const { t } = useTranslation();

    return (
        <div
            className="bg-yellow-50 p-3 w-full text-center mb-3 mt-auto"
            data-testid={CartTestIds.CART_WARNING_CONTAINER}
        >
            <h4 className="font-bold leading-9 tracking-wide">
                {t('cart.warning.title')}
            </h4>
            <p className="text-sm leading-9 text-gray-900 mt-1">
                {t('cart.warning.content')}
            </p>
        </div>
    );
}
