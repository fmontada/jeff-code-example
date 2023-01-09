import {
    BUTTON_SIZE,
    BUTTON_STYLE,
    OzButton,
    OzTabNavigation,
    TAB_NAVIGATION_SIZES,
} from '@omaze/omaze-ui';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import shallow from 'zustand/shallow';

import { SecondaryHeaderTab } from '@/components/SecondaryHeader/SecondaryHeaderTab';
import { SecondaryHeaderTestIds } from '@/components/SecondaryHeader/SecondaryHeaderTestIds';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { useGetClosestSubprize } from '@/hooks/useGetClosestSubprize';
import { useSweepstakeStore } from '@/store/useSweepstakeStore';

import { onSectionScrollUpdateNavigationIndex } from './onSectionScrollUpdateNavigationIndex';

function scrollToRef(ref: HTMLDivElement) {
    if (!ref) {
        return;
    }

    ref.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
    });
}

export function SecondaryHeader() {
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const {
        prizeDetailsRef,
        heroImageRef,
        sweepstakeRulesRef,
        donationVariantsRef,
        charityDetailsRef,
    } = useSweepstakeStore((store) => {
        return {
            prizeDetailsRef: store.prizeDetailsRef,
            heroImageRef: store.heroImageRef,
            sweepstakeRulesRef: store.sweepstakeRulesRef,
            donationVariantsRef: store.donationVariantsRef,
            charityDetailsRef: store.charityDetailsRef,
        };
    }, shallow);

    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const openSubPrize = useGetClosestSubprize();

    useEffect(() => {
        if (
            !heroImageRef ||
            !prizeDetailsRef ||
            !charityDetailsRef ||
            !sweepstakeRulesRef ||
            !donationVariantsRef
        ) {
            return;
        }

        function onScrollHandler() {
            onSectionScrollUpdateNavigationIndex({
                heroImageRef,
                prizeDetailsRef,
                charityDetailsRef,
                sweepstakeRulesRef,
                donationVariantsRef,
                setActiveTabIndex,
            });
        }

        window.addEventListener('scroll', onScrollHandler);

        return () => {
            window.removeEventListener('scroll', onScrollHandler);
        };
    }, [
        heroImageRef,
        prizeDetailsRef,
        charityDetailsRef,
        sweepstakeRulesRef,
        donationVariantsRef,
    ]);

    return (
        <header
            className={classNames({
                'bg-white-500 flex items-center sticky top-0 w-full h-8 md:h-10 z-10 shadow-md':
                    true,
                'top-[64px]': openSubPrize,
            })}
            data-testid={SecondaryHeaderTestIds.SECONDARY_HEADER}
        >
            <div className="flex justify-between items-center w-full pl-3 md:px-6 overflow-x-auto">
                <OzTabNavigation
                    defaultActiveIndex={0}
                    currentActiveIndex={activeTabIndex}
                    size={TAB_NAVIGATION_SIZES.SMALL}
                >
                    <SecondaryHeaderTab
                        data-testid={
                            SecondaryHeaderTestIds.SECONDARY_HEADER_OVERVIEW
                        }
                        onClick={() => {
                            scrollToRef(heroImageRef);
                        }}
                        text={t('secondaryHeader.overview')}
                        isActive={activeTabIndex === 0}
                    />
                    <SecondaryHeaderTab
                        data-testid={
                            SecondaryHeaderTestIds.SECONDARY_HEADER_WHAT_YOU_WILL_GET
                        }
                        onClick={() => {
                            scrollToRef(prizeDetailsRef);
                        }}
                        text={t('secondaryHeader.whatYouWillGet')}
                        isActive={activeTabIndex === 1}
                    />
                    <SecondaryHeaderTab
                        data-testid={
                            SecondaryHeaderTestIds.SECONDARY_HEADER_WHO_YOU_WILL_HELP
                        }
                        onClick={() => {
                            scrollToRef(charityDetailsRef);
                        }}
                        text={t('secondaryHeader.whoYouWillHelp')}
                        isActive={activeTabIndex === 2}
                    />
                    <SecondaryHeaderTab
                        data-testid={
                            SecondaryHeaderTestIds.SECONDARY_HEADER_OFFICIAL_RULES
                        }
                        onClick={() => {
                            scrollToRef(sweepstakeRulesRef);
                        }}
                        text={t('secondaryHeader.officialRules')}
                        isActive={activeTabIndex === 3}
                    />
                </OzTabNavigation>
                <OzButton
                    size={BUTTON_SIZE.LARGE}
                    style={BUTTON_STYLE.PRIMARY}
                    className="hidden md:block"
                    data-testid={
                        SecondaryHeaderTestIds.SECONDARY_HEADER_ENTER_BUTTON
                    }
                    onClick={() => {
                        scrollToRef(donationVariantsRef);
                    }}
                >
                    {t('secondaryHeader.enterNowBtn')}{' '}
                </OzButton>
            </div>
        </header>
    );
}
