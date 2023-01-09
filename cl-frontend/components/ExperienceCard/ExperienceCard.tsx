import {
    OzDivider,
    OzProductCard,
    OzTag,
    PRODUCT_CARD_VARIANTS,
    TAG_COLORS,
    TAG_SIZES,
    TAG_VARIANTS,
} from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { SweepsStatus } from '@/api/sweepstakes';
import { ExperienceCardTestIds } from '@/components/ExperienceCard/ExperienceCardTestIds';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { IExperienceWithSweepstakeData } from '@/types/api';
import { formatDateToLocalString } from '@/utils/formatDateToLocalString';
import { formatNumber } from '@/utils/formatNumbers';
import { calculateTimeLeft } from '@/utils/time';

interface IPropsExperienceCard {
    experience: IExperienceWithSweepstakeData;
}

export function ExperienceCard({ experience }: IPropsExperienceCard) {
    const { image, charity, description, entries, closeDate, status } =
        experience;

    const { t } = useTranslation(COMMON_TRANSLATIONS);

    const { days = 0 } = calculateTimeLeft(new Date(closeDate));

    const statusOfLabels = {
        [SweepsStatus.WinnerPending]: {
            tagColor: TAG_COLORS.VIOLET,
            tagText: t('experiences.statuses.winnerPending'),
        },
        [SweepsStatus.Open]: {
            tagColor: TAG_COLORS.YELLOW,
            // @TODO: Plurals are not working for some reason
            tagText: t(`experiences.statuses.open${days === 1 ? '_one' : ''}`, {
                days,
            }),
        },
        [SweepsStatus.WinnerAnnounced]: {
            tagColor: TAG_COLORS.GRAY,
            tagText: t('experiences.statuses.seeWhoWon'),
        },
    };

    return (
        <div className="w-full mb-3">
            <div className="relative">
                <div className="absolute top-3 left-2 z-20">
                    <OzTag
                        data-testid={ExperienceCardTestIds.EXPERIENCE_CARD_TAG}
                        size={TAG_SIZES.SMALL}
                        color={statusOfLabels[status].tagColor}
                        variant={TAG_VARIANTS.ROUNDED}
                    >
                        {statusOfLabels[status].tagText}
                    </OzTag>
                </div>
                <OzProductCard variant={PRODUCT_CARD_VARIANTS.CONTAINED}>
                    <OzProductCard.Hero>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            className="lazyload inset-0 object-cover absolute h-full w-full"
                            alt={t('experiences.experiencesAlt')}
                            src={image}
                            data-testid={
                                ExperienceCardTestIds.EXPERIENCE_CARD_IMAGE
                            }
                        />
                    </OzProductCard.Hero>
                    <OzProductCard.Body>
                        <OzProductCard.Title
                            data-testid={
                                ExperienceCardTestIds.EXPERIENCE_CARD_CHARITY
                            }
                        >
                            {charity}
                        </OzProductCard.Title>
                        <OzProductCard.Subtitle
                            data-testid={
                                ExperienceCardTestIds.EXPERIENCE_CARD_DESCRIPTION
                            }
                        >
                            {description}
                        </OzProductCard.Subtitle>
                        <OzDivider />
                        <div className="flex justify-between font-medium mt-2 text-xs">
                            <div className="flex flex-col justify-between font-medium  text-teal-800">
                                <div
                                    data-testid={
                                        ExperienceCardTestIds.EXPERIENCE_CARD_YOUR_ENTRIES_LABEL
                                    }
                                >
                                    {t('experiences.yourEntries')}
                                </div>
                                <div
                                    data-testid={
                                        ExperienceCardTestIds.EXPERIENCE_CARD_AMOUNT_OF_ENTRIES
                                    }
                                    className="font-bold"
                                >
                                    {formatNumber(entries)}
                                </div>
                            </div>
                            <div className="flex flex-col justify-between font-medium text-gray-600">
                                <div
                                    data-testid={
                                        ExperienceCardTestIds.EXPERIENCE_CARD_CLOSES_LABEL
                                    }
                                    className="self-end"
                                >
                                    {t('experiences.closesLabel')}
                                </div>
                                <time
                                    className="font-bold md:text-med"
                                    dateTime={closeDate}
                                >
                                    {formatDateToLocalString(closeDate)}
                                </time>
                            </div>
                        </div>
                    </OzProductCard.Body>
                </OzProductCard>
            </div>
        </div>
    );
}
