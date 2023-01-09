import { OzDivider } from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { IWithClassName, IWithDataTestId } from 'types/components';

import { COMMON_TRANSLATIONS } from '@/constants/translations';

import { ExperiencesHeaderTestIds } from './ExperiencesHeaderTestIds';

export interface IExperiencesHeaderProps
    extends IWithClassName,
        IWithDataTestId {
    name: string;
}

export function ExperiencesHeader(props: IExperiencesHeaderProps) {
    const {
        className = '',
        'data-testid':
            dataTestId = ExperiencesHeaderTestIds.EXPERIENCES_HEADER_CONTAINER,
        name,
    } = props;
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const nameArray = name.split(' ');
    const firstName = nameArray[0];
    let initials = firstName[0];
    if (nameArray.length > 1) {
        initials += nameArray[nameArray.length - 1][0];
    }

    return (
        <div data-testid={dataTestId} className={`mt-3 mx-3 ${className}`}>
            <div className="flex flex-row items-center mb-2">
                <div className="rounded-full bg-teal-500 h-9 w-9">
                    <div className="flex items-center justify-center h-9 w-9">
                        <p className="text-4xl text-center font-showtime uppercase text-navy-900">
                            {initials}
                        </p>
                    </div>
                </div>
                <div
                    className="text-3xl text-left leading-snug font-showtime uppercase text-gray-900 ml-2 break-all"
                    data-testid={
                        ExperiencesHeaderTestIds.EXPERIENCES_HEADER_WELCOME_CONTAINER
                    }
                >
                    {t('account.experience.header', { firstName })}
                </div>
            </div>
            <OzDivider className="mb-0" />
        </div>
    );
}
