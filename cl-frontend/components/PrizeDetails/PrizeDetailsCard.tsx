import Image from 'next/image';
import React from 'react';

import { YoutubeEmbed } from '@/components/YoutubeEmbed';

import { PrizeDetailsTestIds } from './PrizeDetailsTestIds';

export interface IPrizeDetailsCard {
    captionDescription: string;
    captionTitle: string;
    imageAlt: string;
    imageHeight: number;
    imageSrc: string;
    imageWidth: number;
    youtubeVideo: string;
}

export function PrizeDetailsCard({
    captionDescription,
    captionTitle,
    imageAlt,
    imageHeight,
    imageSrc,
    imageWidth,
    youtubeVideo,
}: IPrizeDetailsCard) {
    const hasImage = !!imageSrc && !!imageWidth && !!imageHeight;
    const media = youtubeVideo ? (
        <YoutubeEmbed
            captionTitle={captionTitle}
            youtubeVideoUrl={youtubeVideo}
        />
    ) : hasImage ? (
        <Image
            alt={imageAlt}
            className="block max-w-full h-auto rounded-lg"
            data-testid={PrizeDetailsTestIds.PRIZE_DETAILS_CARD_IMAGE}
            height={imageHeight}
            src={imageSrc}
            width={imageWidth}
        />
    ) : null;

    return (
        <div className="flex flex-col md:flex-row mt-6 lg:max-w-6xl font-gellix md:even:flex-row-reverse group first:md:mt-0">
            <div className="w-full h-auto contents md:block md:w-2/4 group-odd:md:mr-2 group-even:md:ml-2">
                {media}
            </div>
            <div
                className="flex flex-col mt-1 text-gray-900 md:w-2/4"
                data-testid={PrizeDetailsTestIds.PRIZE_DETAILS_CARD_CAPTION}
            >
                <p className="text-lg leading-9 md:text-xl md:leading-9 font-bold">
                    {captionTitle}
                </p>
                <p className="text-base font-medium leading-9 md:text-med md:leading-9 mt-2">
                    {captionDescription}
                </p>
            </div>
        </div>
    );
}
