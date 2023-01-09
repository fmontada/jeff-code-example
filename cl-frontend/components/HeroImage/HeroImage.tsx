import { useSelector } from '@plasmicapp/host';
import React, { useEffect, useRef } from 'react';

import { Carousel } from '@/components/Carousel';
import { useSweepstakeStore } from '@/store/useSweepstakeStore';
import { IHeroImageData, IStrapiSweepstake } from '@/types/strapi';

import { HeroImageTestIds } from './HeroImageTestIds';

interface IHeroImageCard {
    imageId: string;
    imageAltDesktop: string;
    imageSrcDesktop: string;
    imageAltMobile?: string;
    imageSrcMobile?: string;
}

export function HeroImage() {
    const heroImageRef = useRef<HTMLDivElement>(null);
    const setSweepstakeStore = useSweepstakeStore((store) => store.set);
    useEffect(() => {
        if (!heroImageRef?.current) {
            return;
        }

        setSweepstakeStore((store) => {
            store.heroImageRef = heroImageRef?.current;
        });
    }, [heroImageRef]);

    const item: IStrapiSweepstake = useSelector('strapiItem');
    if (!item) {
        return;
    }

    const heroImagesDesktop =
        item.attributes?.heroImage?.data?.map((imageItem: IHeroImageData) => {
            return {
                imageAltDesktop: imageItem.attributes.alternativeText,
                imageSrcDesktop: imageItem.attributes.url,
            };
        }) || [];

    const heroImagesMobile =
        item.attributes?.heroImageMobile?.data?.map(
            (imageItem: IHeroImageData) => {
                return {
                    imageAltMobile: imageItem?.attributes.alternativeText,
                    imageSrcMobile: imageItem?.attributes.url,
                };
            },
        ) || [];

    const heroImagesArr = [];
    heroImagesDesktop.map((desktopItem, index) => {
        const mobileItem = heroImagesMobile[index];
        const heroImageObj: IHeroImageCard = {
            imageId: `hero-${index}`,
            imageAltDesktop: desktopItem.imageAltDesktop,
            imageSrcDesktop: desktopItem.imageSrcDesktop,
            imageAltMobile:
                mobileItem?.imageAltMobile || desktopItem.imageAltDesktop,
            imageSrcMobile:
                mobileItem?.imageSrcMobile || desktopItem.imageSrcDesktop,
        };
        heroImagesArr.push(heroImageObj);
    });

    const heroImageCards = heroImagesArr.map((imageObj) => {
        return (
            <div
                key={imageObj.imageId}
                className="relative overflow-hidden w-full h-full lg:rounded-lg aspect-square md:aspect-video"
            >
                <div
                    className="absolute -top-8 md:-top-12 left-0"
                    ref={heroImageRef}
                />
                <picture>
                    <source
                        media="(min-width: 1152px)"
                        srcSet={imageObj.imageSrcDesktop}
                    />
                    <source
                        media="(max-width: 702px)"
                        srcSet={imageObj.imageSrcMobile}
                    />
                    <img
                        src={imageObj.imageSrcDesktop}
                        alt={imageObj.imageAltDesktop}
                        className="w-full h-full lg:rounded-lg"
                    />
                </picture>
            </div>
        );
    });

    return (
        <div
            className="w-full"
            data-testid={HeroImageTestIds.HERO_IMAGE_CONTAINER}
        >
            <div
                className="absolute -top-8 md:-top-12 left-0"
                ref={heroImageRef}
            />
            <Carousel
                slides={heroImageCards}
                showArrows
                navButtonsPosition="bottom-2"
            />
        </div>
    );
}
