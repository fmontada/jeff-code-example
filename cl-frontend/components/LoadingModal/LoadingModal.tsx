import { OzLoadingSpinner } from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';

import { COMMON_TRANSLATIONS } from '@/constants/translations';

import { LoadingModalTestIds } from './LoadingModalTestIds';

export function LoadingModal() {
    const { t } = useTranslation(COMMON_TRANSLATIONS);

    return (
        <div
            className="fixed flex items-center justify-center z-50 top-0 left-0 w-screen h-screen bg-gray-400 bg-opacity-25"
            data-testid={LoadingModalTestIds.LOADING_MODAL_CONTAINER}
        >
            <div className="bg-white-500 p-3 flex flex-col items-center rounded-xl">
                <OzLoadingSpinner />
                <p className="text-lg mt-2">{t('general.loading')}</p>
            </div>
        </div>
    );
}
