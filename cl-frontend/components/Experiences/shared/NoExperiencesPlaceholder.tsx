import { BUTTON_SIZE, BUTTON_STYLE, OzButton } from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { COMMON_TRANSLATIONS } from '@/constants/translations';

export enum INoExperiencePlaceholderTestIds {
    NO_EXPERIENCE_PLACEHOLDER = 'No__experience__placeholder',
    NO_EXPERIENCE_TITLE = 'No__experience__title',
    NO_EXPERIENCE_DESCRIPTION = 'No__experience__description',
    NO_EXPERIENCE_CTA = 'No__experience__cta',
}

export function NoExperiencesPlaceholder() {
    const router = useRouter();
    const { t } = useTranslation(COMMON_TRANSLATIONS);

    return (
        <div
            data-testid={
                INoExperiencePlaceholderTestIds.NO_EXPERIENCE_PLACEHOLDER
            }
            className="mt-2 p-3 max-w-sm bg-navy-50 text-center"
        >
            <div className="pb-2">
                <div
                    data-testid={
                        INoExperiencePlaceholderTestIds.NO_EXPERIENCE_TITLE
                    }
                    className="font-bold text-lg mb-2"
                >
                    {t('experiences.nothingToSee')}
                </div>
                <p
                    data-testid={
                        INoExperiencePlaceholderTestIds.NO_EXPERIENCE_DESCRIPTION
                    }
                    className="text-gray-700 text-base"
                >
                    {t('experiences.dontMissContext')}
                </p>
            </div>
            <OzButton
                data-testid={INoExperiencePlaceholderTestIds.NO_EXPERIENCE_CTA}
                className="h-auto py-2 px-12 cursor-pointer border-0"
                size={BUTTON_SIZE.MEDIUM}
                style={BUTTON_STYLE.PRIMARY}
                onClick={() => {
                    router.push('/sweepstakes');
                }}
            >
                {t('general.enterNowButton')}
            </OzButton>
        </div>
    );
}
