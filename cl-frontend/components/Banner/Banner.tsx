import classNames from 'classnames';
import { ReactNode, useEffect, useState } from 'react';
import { IWithClassName, IWithDataTestId } from 'types/components';

import { BannerTestIds } from './BannerTestIds';
import { BannerTypes } from './BannerTypes';

export interface IBannerProps extends IWithClassName, IWithDataTestId {
    children: ReactNode;
    delayTime?: number;
    duration?: number;
    type: BannerTypes;
}

export const DEFAULT_BANNER_DELAY_TIME_IN_MS: number = 600;
export const DEFAULT_BANNER_TRANSITION_DURATION_IN_MS: number = 3000;

export function Banner(props: IBannerProps) {
    const {
        children,
        className = '',
        delayTime = DEFAULT_BANNER_DELAY_TIME_IN_MS,
        duration = DEFAULT_BANNER_TRANSITION_DURATION_IN_MS,
        type = '',
        'data-testid': dataTestId = BannerTestIds.BANNER_CONTAINER,
    } = props;

    const [showBanner, setShowBanner] = useState<boolean>(false);

    useEffect(() => {
        const showTimeout = window?.setTimeout((): void => {
            setShowBanner(true);
        }, delayTime);

        const hideTimeout = window?.setTimeout((): void => {
            setShowBanner(false);
        }, delayTime + duration);

        return (): void => {
            if (showTimeout) {
                clearTimeout(showTimeout);
            }

            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }
        };
    }, [delayTime, duration]);

    const bannerClasses = classNames(className, {
        'bg-green-500': type === BannerTypes.SUCCESS,
        'bg-yellow-500': type === BannerTypes.WARNING,
        'bg-red-500': type === BannerTypes.ERROR,
        'opacity-100 translate-y-0': showBanner,
        'opacity-00 translate-y-6 pointer-events-none': !showBanner,
    });

    return (
        <div
            data-testid={dataTestId}
            className={`bottom-0 left-0 fixed w-full py-4 px-3 text-center text-base leading-[120%] font-medium text-white-500 transition duration-600 ${bannerClasses}`}
        >
            {children}
        </div>
    );
}
