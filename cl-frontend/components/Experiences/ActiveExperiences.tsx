import { OzNumberedPagination } from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import { ReactElement, useState } from 'react';

import { SweepsStatus } from '@/api/sweepstakes';
import { ExperienceCard } from '@/components/ExperienceCard';
import { NoExperiencesPlaceholder } from '@/components/Experiences/shared/NoExperiencesPlaceholder';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { IExperienceWithSweepstakeData } from '@/types/api';

const MAX_NUMBER_OF_ACTIVE_EXPERIENCES_PER_PAGE = 3;

interface IActiveExperiencesProps {
    experienceData: IExperienceWithSweepstakeData[];
}

export function ActiveExperiences({
    experienceData,
}: IActiveExperiencesProps): ReactElement {
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const [currentPage, setCurrentPage] = useState(1);

    const openExperiences = experienceData.filter((experience) => {
        return experience.status === SweepsStatus.Open;
    });

    function onChange(page: number): void {
        setCurrentPage(page);
    }

    if (!openExperiences.length) {
        return <NoExperiencesPlaceholder />;
    }
    const currentPageActiveExperiences = openExperiences.filter(
        (currentPageExperience, index) => {
            return (
                index <
                    currentPage * MAX_NUMBER_OF_ACTIVE_EXPERIENCES_PER_PAGE &&
                index >=
                    (currentPage - 1) *
                        MAX_NUMBER_OF_ACTIVE_EXPERIENCES_PER_PAGE
            );
        },
    );

    const canDisplayPagination =
        openExperiences.length / MAX_NUMBER_OF_ACTIVE_EXPERIENCES_PER_PAGE > 1;

    return (
        <>
            <p className="font-medium pb-4 text-navy-900 mt-2">
                {t('experiences.activeContextWithExperiences')}
            </p>
            {currentPageActiveExperiences.map((experienceObject, index) => {
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
                        openExperiences.length /
                            MAX_NUMBER_OF_ACTIVE_EXPERIENCES_PER_PAGE,
                    )}
                    onChange={onChange}
                    currentPage={currentPage}
                />
            )}
        </>
    );
}
