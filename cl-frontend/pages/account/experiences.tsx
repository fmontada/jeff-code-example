import {
    BUTTON_SIZE,
    BUTTON_STYLE,
    OzButton,
    OzLoadingSpinner,
} from '@omaze/omaze-ui';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React, { ReactElement, useState } from 'react';
import { useQuery } from 'react-query';

import { ActiveExperiences, ClosedExperiences } from '@/components/Experiences';
import { ExperiencesHeader } from '@/components/ExperiencesHeader';
import { ExperiencesLinks } from '@/components/ExperiencesLinks';
import { Layout } from '@/components/Layout';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { getUserExperiencesQuery } from '@/queries/getUserExperiencesQuery';
import { getUserQuery } from '@/queries/getUserQuery';
import { useUserStore } from '@/store/useUserStore';

export { getStaticProps } from '@/utils/serverSideProps';

enum Tabs {
    ACTIVE = 'Active',
    CLOSED = 'Closed',
}

export default function Experiences(): ReactElement {
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const [activeTab, setActiveTab] = useState<Tabs>(Tabs.ACTIVE);

    const authorizationToken = useUserStore(
        (store) => store.authorizationToken,
    );

    const { data: user } = useQuery('userData', getUserQuery, {
        enabled: !!authorizationToken,
        retry: false,
    });

    const { data: experienceData, isLoading: isLoadingExperiences } = useQuery(
        'userExperiences',
        getUserExperiencesQuery,
        {
            enabled: !!authorizationToken,
            retry: false,
        },
    );

    function onClickActiveTabChange() {
        setActiveTab(Tabs.ACTIVE);
    }

    function onClickClosedTabChange() {
        setActiveTab(Tabs.CLOSED);
    }

    const isExperienceTabReady = !!experienceData && !isLoadingExperiences;

    function getExperiencesTabClassNames(
        tabType: Tabs,
        additionalClassName: string = '',
    ) {
        return classNames({
            'after:!h-0': true,
            'decoration-teal-800 decoration-4 underline underline-offset-4':
                activeTab === tabType,
            '!text-gray-500': activeTab !== tabType,
            [additionalClassName]: true,
        });
    }

    return (
        <Layout>
            <Head>
                <title>{t('experiences.yourExperience')}</title>
            </Head>
            {user ? (
                <ExperiencesHeader
                    name={`${user?.first_name} ${user?.last_name}`}
                />
            ) : null}
            <div className="w-full px-3 pt-4 pb-1 font-gellix">
                <div className="text-xl font-bold pb-3">
                    {t('experiences.yourExperience')}
                </div>
                <OzButton
                    onClick={onClickActiveTabChange}
                    className={getExperiencesTabClassNames(Tabs.ACTIVE, 'mr-3')}
                    style={BUTTON_STYLE.LINK}
                    size={BUTTON_SIZE.SMALL}
                >
                    {t('experiences.activeButton')}
                </OzButton>
                <OzButton
                    onClick={onClickClosedTabChange}
                    className={getExperiencesTabClassNames(Tabs.CLOSED, 'mr-3')}
                    style={BUTTON_STYLE.LINK}
                    size={BUTTON_SIZE.SMALL}
                >
                    {t('experiences.closedButton')}
                </OzButton>
                {isLoadingExperiences ? <OzLoadingSpinner /> : null}
                {activeTab === Tabs.ACTIVE && isExperienceTabReady ? (
                    <ActiveExperiences experienceData={experienceData} />
                ) : null}
                {activeTab === Tabs.CLOSED && isExperienceTabReady ? (
                    <ClosedExperiences experienceData={experienceData} />
                ) : null}
            </div>
            <ExperiencesLinks />
        </Layout>
    );
}
