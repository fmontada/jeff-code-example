import { useSelector } from '@plasmicapp/host';
import React from 'react';

import { IStrapiSweepstake } from '@/types/strapi';

import { PrizeDetails } from './PrizeDetails';
import { IPrizeDetailsCard } from './PrizeDetailsCard';

export function WrapperPrizeDetails() {
    const item: IStrapiSweepstake = useSelector('strapiItem');

    const cards: IPrizeDetailsCard[] = (
        item.attributes?.prizeDetails || []
    ).map((item: any) => {
        return {
            captionDescription: item?.prizeDetailsBody || '',
            captionTitle: item?.prizeDetailsSubtitle || '',
            imageAlt: item?.prizeDetailsBody || '',
            imageHeight: item?.prizeDetailsImage?.data?.attributes?.height,
            imageSrc: item?.prizeDetailsImage?.data?.attributes?.url,
            imageWidth: item?.prizeDetailsImage?.data?.attributes?.width,
            youtubeVideo: item?.prizeDetailsYoutubeLink || '',
        };
    });

    return (
        <PrizeDetails
            cards={cards}
            title={item.attributes?.prizeDetailsTitle}
        />
    );
}
