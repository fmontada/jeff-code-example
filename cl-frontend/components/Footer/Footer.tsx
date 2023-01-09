import { useTranslation } from 'next-i18next';

import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { IWithClassName, IWithDataTestId } from '@/types/components';

export type IFooterProps = IWithClassName & IWithDataTestId;

export function Footer(props: IFooterProps) {
    const { className = '', 'data-testid': dataTestId } = props;

    const fullYear = new Date().getFullYear();

    const { t } = useTranslation(COMMON_TRANSLATIONS);

    return (
        <footer
            className={`bg-navy-900 w-full mt-auto ${className}`}
            data-testid={dataTestId}
        >
            <p className="italic text-white-500 text-sm text-center pt-3 w-maxContent mx-auto pb-11 max-w-[264px]">
                {t('footer.copyright', {
                    fullYear,
                })}
            </p>
        </footer>
    );
}
