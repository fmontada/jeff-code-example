import {
    ICON_COLOR,
    ICON_SIZE,
    ICON_TYPE,
    OzDivider,
    OzIcon,
} from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';
import { IWithClassName, IWithDataTestId } from 'types/components';

import { getAccountRoute } from '@/constants/routes';
import { COMMON_TRANSLATIONS } from '@/constants/translations';

import { ExperiencesLinksTestIds } from './ExperiencesLinksTestIds';

export type IExperiencesLinksProps = IWithClassName & IWithDataTestId;

interface IExperiencesLinksItem {
    text: string;
    href: string;
    testId: string;
}

export function ExperiencesLinks(props: IExperiencesLinksProps) {
    const {
        className = '',
        'data-testid':
            dataTestId = ExperiencesLinksTestIds.EXPERIENCES_LINKS_CONTAINER,
    } = props;

    const { t } = useTranslation(COMMON_TRANSLATIONS);

    const experiencesLinks: IExperiencesLinksItem[] = [
        {
            text: 'account.donationHistory.title',
            href: getAccountRoute('history'),
            testId: ExperiencesLinksTestIds.EXPERIENCES_LINKS_HISTORY_LINK,
        },
        {
            text: 'account.settings.accountSettings',
            href: getAccountRoute('settings'),
            testId: ExperiencesLinksTestIds.EXPERIENCES_LINKS_SETTINGS_LINK,
        },
    ];

    return (
        <div
            data-testid={dataTestId}
            className={`flex flex-col mx-3 ${className}`}
        >
            {experiencesLinks.map((item) => {
                return (
                    <div key={item.text}>
                        <OzDivider className="mt-3 mb-3" />
                        <Link href={item.href}>
                            <a
                                className="flex justify-between items-baseline"
                                data-testid={item.testId}
                            >
                                <span className="font-medium text-gray-900 text-base">
                                    {t(item.text)}
                                </span>
                                <OzIcon
                                    type={ICON_TYPE.OZ_ARROW_RIGHT}
                                    size={ICON_SIZE.SMALL}
                                    color={ICON_COLOR.DARK}
                                />
                            </a>
                        </Link>
                    </div>
                );
            })}
            <OzDivider className="mt-3 mb-3" />
        </div>
    );
}
