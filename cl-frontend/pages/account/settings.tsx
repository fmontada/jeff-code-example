import {
    ICON_COLOR,
    ICON_SIZE,
    ICON_TYPE,
    OzDivider,
    OzIcon,
} from '@omaze/omaze-ui';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React, { ReactElement, useState } from 'react';
import { useQuery } from 'react-query';

import { Layout } from '@/components/Layout';
import InfoProvided from '@/components/PersonalInformation/InfoProvided';
import { Tooltip } from '@/components/Tooltip/Tooltip';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { getUserQuery } from '@/queries/getUserQuery';
import { useUserStore } from '@/store/useUserStore';

export { getStaticProps } from '@/utils/serverSideProps';

export enum SettingsPageTestIds {
    USER_SETTINGS_MAIN_CONTAINER = 'UserSettings__main__container',
    USER_SETTINGS_BACK_TO_EXPERIENCE = 'UserSettings__back__to__experience',
    USER_SETTINGS_ACCOUNT_SETTINGS = 'UserSettings__account__settings',
    USER_SETTINGS_PERSONAL_INFO = 'UserSettings__personal__info',
    USER_SETTINGS_INFO_NOTE = 'UserSettings__info__note',
    USER_SETTINGS_EMAIL_CONTAINER = 'UserSettings__email__container',
    ERROR_PAGE = 'ERROR_PAGE',
    LOADING_PAGE = 'LOADING_PAGE',
}

export default function SettingsPage(): ReactElement {
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const omazeEmail = process.env.NEXT_PUBLIC_OMAZE_EMAIL;

    const fieldLabelClassNames: string = 'font-bold text-navy-900 text-base';
    const fieldValueClassNames: string =
        'text-navy-900 text-base leading-relaxed mt-1/2';

    const [open, setOpen] = useState<boolean>(false);

    const authorizationToken = useUserStore(
        (store) => store.authorizationToken,
    );

    const {
        isLoading,
        error,
        data: user,
    } = useQuery('userData', getUserQuery, {
        enabled: !!authorizationToken,
        retry: false,
    });

    if (!authorizationToken) {
        return (
            <p data-testid={SettingsPageTestIds.ERROR_PAGE}>
                {t('account.settings.notAuthenticated')}
            </p>
        );
    }

    if (isLoading) {
        return (
            <p data-testid={SettingsPageTestIds.LOADING_PAGE}>
                {t('general.loading')}
            </p>
        );
    }

    if (error || !user) {
        const errorMsg = error;
        return (
            <p data-testid={SettingsPageTestIds.ERROR_PAGE}>
                {t('account.settings.errorOccurred', { errorMsg })}
            </p>
        );
    }

    return (
        <Layout>
            <main
                className="mx-3 mt-3 text-gray-900 font-gellix"
                data-testid={SettingsPageTestIds.USER_SETTINGS_MAIN_CONTAINER}
            >
                <Link href="/">
                    <a
                        className="flex items-baseline"
                        data-testid={
                            SettingsPageTestIds.USER_SETTINGS_BACK_TO_EXPERIENCE
                        }
                    >
                        <OzIcon
                            type={ICON_TYPE.OZ_ARROW_LEFT}
                            size={ICON_SIZE.SMALL}
                            color={ICON_COLOR.DARK}
                        />
                        <span className="ml-1 text-sm font-bold underline-offset-2 underline">
                            {t('account.backToYourExperience')}
                        </span>
                    </a>
                </Link>
                <h1
                    className="my-2 text-xl font-bold"
                    data-testid={
                        SettingsPageTestIds.USER_SETTINGS_ACCOUNT_SETTINGS
                    }
                >
                    {t('account.settings.accountSettings')}
                </h1>
                <h2
                    className="mb-1/2 text-med font-bold"
                    data-testid={
                        SettingsPageTestIds.USER_SETTINGS_PERSONAL_INFO
                    }
                >
                    {t('account.settings.personalInformation.personalInfo')}
                </h2>
                <p
                    className="mb-2 text-xs italic"
                    data-testid={SettingsPageTestIds.USER_SETTINGS_INFO_NOTE}
                >
                    {t('account.settings.personalInformation.infoNote')}
                </p>
                <div
                    className="flex flex-row items-center"
                    data-testid={
                        SettingsPageTestIds.USER_SETTINGS_EMAIL_CONTAINER
                    }
                >
                    <h4 className={fieldLabelClassNames}>
                        {t('account.settings.personalInformation.email')}
                    </h4>
                    <span
                        onClick={() => setOpen(true)}
                        className="ml-1 cursor-pointer"
                    >
                        <OzIcon
                            type={ICON_TYPE.OZ_TOOLTIP}
                            size={ICON_SIZE.MEDIUM}
                            color={ICON_COLOR.DARK}
                            alt={t(
                                'account.settings.toolTipMsg.altTextHelpIcon',
                            )}
                        />
                    </span>
                    <Tooltip open={open} onClose={() => setOpen(false)}>
                        <p
                            dangerouslySetInnerHTML={{
                                __html: t('account.settings.email.tooltip', {
                                    email: `<a class="font-bold underline" href="mailto:${omazeEmail}">${omazeEmail}</a>`,
                                }),
                            }}
                        />
                    </Tooltip>
                </div>
                <div className={fieldValueClassNames}>{user.email}</div>
                <OzDivider className="mt-4 mb-2" />
                <InfoProvided userInfo={user} />
                <OzDivider className="mt-1 mb-3" />
            </main>
        </Layout>
    );
}
