import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { formatDateToLocalString } from '@/utils/formatDateToLocalString';
import { formatTimeLeftToText, isLessThan7DaysAway } from '@/utils/time';

import { SubprizeCarouselCardTestIds } from './SubprizeCarouselCardTestIds';
import { SUBPRIZE_CLOSE_STATUS } from './SubprizeCarouselStatuses';

export interface ISubprizeCarouselCardProps {
    captionTitle: string;
    closeDate: Date;
    imageAlt: string;
    imageHeight: number;
    imageSrc: string;
    imageWidth: number;
}

export function SubprizeCarouselCard({
    captionTitle,
    closeDate,
    imageAlt,
    imageHeight,
    imageSrc,
    imageWidth,
}: ISubprizeCarouselCardProps) {
    const { t } = useTranslation(COMMON_TRANSLATIONS);
    const [timeLeftCounter, setTimeLeftCounter] = useState<string>(() =>
        formatTimeLeftToText(closeDate),
    );

    const isClosed = closeDate < new Date();
    const isCloseDateLessThan7DaysAway = isLessThan7DaysAway(closeDate);

    useEffect(() => {
        if (!isCloseDateLessThan7DaysAway) {
            return;
        }

        const intervalId = setInterval(() => {
            const timeLeftInText = formatTimeLeftToText(closeDate);
            setTimeLeftCounter(timeLeftInText);
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [isCloseDateLessThan7DaysAway, closeDate]);

    const bannerDateAttributes = {
        closed: {
            translationKey: 'subprizes.closedOn',
            closeDateInBanner: `<span class="font-bold">${formatDateToLocalString(
                closeDate.toISOString(),
            )}</span>`,
        },
        closeNear: {
            translationKey: 'subprizes.closesIn',
            closeDateInBanner: `<span class="font-bold">${timeLeftCounter}</span>`,
        },
        closeFar: {
            translationKey: 'subprizes.closesOn',
            closeDateInBanner: `<span class="font-bold">${formatDateToLocalString(
                closeDate.toISOString(),
            )}</span>`,
        },
    };

    const closeStatus = isClosed
        ? SUBPRIZE_CLOSE_STATUS.CLOSED
        : isCloseDateLessThan7DaysAway
        ? SUBPRIZE_CLOSE_STATUS.CLOSE_NEAR
        : SUBPRIZE_CLOSE_STATUS.CLOSE_FAR;

    const bannerClassName = classNames({
        'bg-navy-500 text-white-500': isClosed,
        'bg-pink-500 text-gray-900': !isClosed,
        'p-1': true,
    });

    const shadowGradientClassName = classNames({
        'w-full h-full absolute top-0 left-0 z-10': true,
        'carousel-card-background': !isClosed,
        'carousel-card-background-closed': isClosed,
    });

    const dateClassName = classNames({
        'text-sm leading-9 text-center': true,
        'text-gray-900': !isClosed,
        'text-white-500': isClosed,
    });

    return (
        <div
            className="flex flex-col relative mt-4 lg:max-w-6xl"
            data-testid={
                SubprizeCarouselCardTestIds.SUBPRIZE_CAROUSEL_CARD_CONTAINER
            }
        >
            <div className={shadowGradientClassName} />
            <div className={bannerClassName}>
                {/* @TODO: WE CANNOT USE <Trans because it is no accepting props */}
                <p
                    className={dateClassName}
                    data-testid={
                        SubprizeCarouselCardTestIds.SUBPRIZE_CAROUSEL_CARD_BANNER
                    }
                    data-test-close-status={closeStatus}
                    dangerouslySetInnerHTML={{
                        __html: t(
                            bannerDateAttributes[closeStatus].translationKey,
                            {
                                closeDate:
                                    bannerDateAttributes[closeStatus]
                                        .closeDateInBanner,
                            },
                        ),
                    }}
                />
            </div>
            {imageSrc && imageWidth && imageHeight ? (
                <Image
                    alt={imageAlt}
                    className="block max-w-full h-auto md:mx-auto absolute top-0 left-0"
                    data-testid={
                        SubprizeCarouselCardTestIds.SUBPRIZE_CAROUSEL_CARD_IMAGE
                    }
                    height={imageHeight}
                    src={imageSrc}
                    width={imageWidth}
                />
            ) : null}
            <p
                className="text-sm md:text-xl leading-9 font-bold text-white-500 text-center absolute bottom-1 w-full z-20"
                data-testid={
                    SubprizeCarouselCardTestIds.SUBPRIZE_CAROUSEL_CARD_CAPTION
                }
            >
                {captionTitle}
            </p>
        </div>
    );
}
