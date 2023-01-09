import { BUTTON_SIZE, BUTTON_STYLE, OzButton } from '@omaze/omaze-ui';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { useCallback, useContext, useEffect, useState } from 'react';

import { SweepsStatus } from '@/api/sweepstakes';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { SweepstakeContext } from '@/store/context';
import { useSweepstakeStore } from '@/store/useSweepstakeStore';
import { IWithClassName, IWithDataTestId } from '@/types/components';

import { EnterNowButtonTestIds } from './EnterNowButtonTestIds';

export interface IEnterNowButtonProps extends IWithDataTestId, IWithClassName {
    isSticky?: boolean;
}

export function EnterNowButton(props: IEnterNowButtonProps) {
    const { sweepstakeData } = useContext(SweepstakeContext);
    const {
        className = '',
        'data-testid': dataTestId = EnterNowButtonTestIds.ENTER_NOW_BUTTON,
        isSticky,
    } = props;
    const [donationVariantScrolled, setDonationVariantScrolled] =
        useState<boolean>(false);
    const donationVariantsRef = useSweepstakeStore(
        (store) => store.donationVariantsRef,
    );
    const { t } = useTranslation(COMMON_TRANSLATIONS);

    const scrollToPrices = useCallback(() => {
        if (!donationVariantsRef) {
            return;
        }

        donationVariantsRef.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }, [donationVariantsRef]);

    useEffect(() => {
        function onScrollHandler() {
            if (!donationVariantsRef) {
                return;
            }

            const { top } = donationVariantsRef.getBoundingClientRect();
            const isInOrAboveScreen = top <= window.innerHeight;
            setDonationVariantScrolled(isInOrAboveScreen);
        }

        window.addEventListener('scroll', onScrollHandler);

        return () => {
            window.removeEventListener('scroll', onScrollHandler);
        };
    }, [donationVariantsRef]);

    const enterNowButtonClassName = classNames({
        'w-screen md:w-full flex items-center justify-center bottom-2 left-0 md:mt-8 md:static z-10':
            true,
        sticky: isSticky && donationVariantScrolled,
        fixed: isSticky && !donationVariantScrolled,
        'block md:hidden': isSticky,
        hidden: !isSticky,
    });

    if (!sweepstakeData || sweepstakeData.status !== SweepsStatus.Open) {
        return null;
    }

    return (
        <div
            className={enterNowButtonClassName}
            data-testid={EnterNowButtonTestIds.ENTER_NOW_BUTTON_CONTAINER}
        >
            <OzButton
                style={BUTTON_STYLE.PRIMARY}
                size={BUTTON_SIZE.MEDIUM}
                onClick={scrollToPrices}
                className={`mx-3 md:mx-0 w-full text-lg ${className}`}
                data-testid={dataTestId}
            >
                {t('general.enterNowButton')}
            </OzButton>
        </div>
    );
}
