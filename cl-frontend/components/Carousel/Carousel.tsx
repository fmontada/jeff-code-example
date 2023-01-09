import { useTranslation } from 'next-i18next';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { IWithClassName } from 'types/components';

import Autoplay from '@/components/Embla/AutoPlay';
import useEmblaCarousel from '@/components/Embla/React';
import { COMMON_TRANSLATIONS } from '@/constants/translations';

import { CarouselTestIds } from './CarouselTestIds';

export interface ICarouselProps extends IWithClassName {
    'aria-label'?: string;
    slides: ReactNode[];
    showArrows?: boolean;
    navButtonsPosition?: string;
}

export function Carousel(props: ICarouselProps) {
    const {
        'aria-label': ariaLabel,
        className = '',
        slides,
        navButtonsPosition = '-bottom-3',
        showArrows = false,
    } = props;

    const { t } = useTranslation(COMMON_TRANSLATIONS);

    const arrowContainerClassNames =
        'hidden md:flex absolute z-1 inset-y-1/2 -translate-y-1/2 items-center justify-center w-[36px] h-[44px] bg-navy-900 touch-manipulation outline-none cursor-pointer p-0';

    function PrevButton({ enabled, onClick }) {
        return (
            <div
                className={arrowContainerClassNames}
                data-testid={CarouselTestIds.CAROUSEL_PREV_BUTTON}
            >
                <button disabled={!enabled}>
                    <img
                        src="/assets/images/left-arrow-large.svg"
                        alt={t('carousel.prevArrowAlt')}
                        onClick={onClick}
                    />
                </button>
            </div>
        );
    }

    function NextButton({ enabled, onClick }) {
        return (
            <div
                className={`${arrowContainerClassNames} right-0`}
                data-testid={CarouselTestIds.CAROUSEL_NEXT_BUTTON}
            >
                <button disabled={!enabled}>
                    <img
                        src="/assets/images/right-arrow-large.svg"
                        alt={t('carousel.nextArrowAlt')}
                        onClick={onClick}
                    />
                </button>
            </div>
        );
    }

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState([]);
    const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
    const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

    const options = {
        delay: 3000,
        stopOnMouseEnter: true,
    };
    const autoplay = Autoplay(options);
    const [viewportRef, embla] = useEmblaCarousel(
        {
            loop: true,
            slidesToScroll: 1,
        },
        [autoplay],
    );

    const scrollTo = useCallback(
        (index: number) => {
            return embla && embla.scrollTo(index);
        },
        [embla],
    );

    const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla]);
    const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla]);

    const onSelect = useCallback(() => {
        if (!embla) {
            return;
        }
        setSelectedIndex(embla.selectedScrollSnap());
        setPrevBtnEnabled(embla.canScrollPrev());
        setNextBtnEnabled(embla.canScrollNext());
    }, [embla, setSelectedIndex]);

    useEffect(() => {
        if (!embla) {
            return;
        }

        onSelect();
        setScrollSnaps(embla.scrollSnapList());
        embla.on('select', onSelect);
    }, [embla, setScrollSnaps, onSelect]);

    return (
        <>
            <div
                aria-label={ariaLabel}
                data-testid={CarouselTestIds.CAROUSEL_CONTAINER}
                className={`relative mx-auto ${className}`}
            >
                <div className="w-full overflow-hidden" ref={viewportRef}>
                    <div className="flex select-none -ml-1 md:ml-0">
                        {slides.map((slide, index) => {
                            return (
                                <div
                                    key={`carousel_slide_${index}`}
                                    data-testid={CarouselTestIds.CAROUSEL_SLIDE}
                                    className="relative min-w-full"
                                >
                                    {slide}
                                </div>
                            );
                        })}
                    </div>
                </div>
                {showArrows ? (
                    <>
                        <PrevButton
                            onClick={scrollPrev}
                            enabled={prevBtnEnabled}
                        />
                        <NextButton
                            onClick={scrollNext}
                            enabled={nextBtnEnabled}
                        />
                    </>
                ) : null}
                <div
                    className={`absolute flex justify-center w-full ${navButtonsPosition}`}
                >
                    {scrollSnaps.map((_, index) => {
                        return (
                            <button
                                className={`flex items-center relative p-0 border-0 rounded-full h-1 w-1 mx-1 ${
                                    index === selectedIndex
                                        ? 'bg-yellow-800'
                                        : 'bg-gray-500'
                                }`}
                                data-testid={
                                    CarouselTestIds.CAROUSEL_NAVIGATION_DOT
                                }
                                key={index}
                                type="button"
                                onClick={() => {
                                    return scrollTo(index);
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
}
