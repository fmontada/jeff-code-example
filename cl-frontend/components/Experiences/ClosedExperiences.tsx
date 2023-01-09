import { OzNumberedPagination } from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import { ReactElement, useState } from 'react';

import { SweepsStatus } from '@/api/sweepstakes';
import { ExperienceCard } from '@/components/ExperienceCard';
import { NoExperiencesPlaceholder } from '@/components/Experiences/shared/NoExperiencesPlaceholder';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { IExperienceWithSweepstakeData } from '@/types/api';

const MAX_NUMBER_OF_CLOSED_EXPERIENCES_PER_PAGE = 3;

interface IClosedExperiencesProps {
    experienceData: IExperienceWithSweepstakeData[];
}

export function ClosedExperiences({
    experienceData,
}: IClosedExperiencesProps): ReactElement {
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const [currentPage, setCurrentPage] = useState(1);

    const pendingOrClosedExperiences = experienceData.filter((experience) => {
        return (
            experience.status === SweepsStatus.WinnerPending ||
            experience.status === SweepsStatus.WinnerAnnounced
        );
    });
    function onChange(page: number): void {
        setCurrentPage(page);
    }

    if (!pendingOrClosedExperiences.length) {
        return (
            <>
                <p className="font-medium pb-4 text-navy-900">
                    {t('experiences.closedContextWithNoExperiences')}
                </p>
                <NoExperiencesPlaceholder />
            </>
        );
    }

    const currentPageClosedExperiences = pendingOrClosedExperiences.filter(
        (currentPageExperience, index) => {
            return (
                index <
                    currentPage * MAX_NUMBER_OF_CLOSED_EXPERIENCES_PER_PAGE &&
                index >=
                    (currentPage - 1) *
                        MAX_NUMBER_OF_CLOSED_EXPERIENCES_PER_PAGE
            );
        },
    );

    const canDisplayPagination =
        pendingOrClosedExperiences.length /
            MAX_NUMBER_OF_CLOSED_EXPERIENCES_PER_PAGE >
        1;

    return (
        <>
            <p className="font-medium pb-4 text-navy-900 mt-2">
                {t('experiences.closedContextWithExperiences')}
            </p>
            {currentPageClosedExperiences.map((experienceObject, index) => {
                return (
                    <ExperienceCard
                        key={`${experienceObject.sweepstake_id}_${index}`}
                        experience={experienceObject}
                    />
                );
            })}
            {canDisplayPagination && (
                <OzNumberedPagination
                    className="pt-3"
                    totalPages={Math.ceil(
                        pendingOrClosedExperiences.length /
                            MAX_NUMBER_OF_CLOSED_EXPERIENCES_PER_PAGE,
                    )}
                    onChange={onChange}
                    currentPage={currentPage}
                />
            )}
        </>
    );
}
