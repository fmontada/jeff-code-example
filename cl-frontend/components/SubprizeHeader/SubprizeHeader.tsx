import { useTranslation } from 'next-i18next';

import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { useGetClosestSubprize } from '@/hooks/useGetClosestSubprize';
import { formatDateToLocalString } from '@/utils/formatDateToLocalString';

import { SubprizeHeaderTestIds } from './SubprizeHeaderTestIds';

export function SubprizeHeader() {
    const openSubPrize = useGetClosestSubprize();
    const { t } = useTranslation(COMMON_TRANSLATIONS);

    if (!openSubPrize) {
        return null;
    }

    return (
        <>
            <div
                className="bg-pink-500 w-full py-1 px-3 text-gray-900 leading-9 flex items-center justify-center text-center text-sm font-bold fixed z-40 h-8"
                data-testid={SubprizeHeaderTestIds.SUBPRIZE_HEADER}
                data-test-subprize={openSubPrize.id}
            >
                {t('donationVariant.subprize', {
                    endDate: formatDateToLocalString(openSubPrize.close_date, {
                        year: undefined,
                    }),
                    prize: openSubPrize.title,
                })}
            </div>
            <div className="mt-8" />
        </>
    );
}
