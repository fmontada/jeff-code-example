import { useSelector } from '@plasmicapp/loader-nextjs';
import { useTranslation } from 'next-i18next';
import { useContext } from 'react';

import { Carousel } from '../Carousel';

import { SweepsStatus } from '@/api/sweepstakes';
import { SubprizeCarouselCard } from '@/components/SubprizeCarouselCard';
import { COMMON_TRANSLATIONS } from '@/constants/translations';
import { SweepstakeContext } from '@/store/context';
import { IStrapiSweepstake } from '@/types/strapi';
import { sortSubprizesByCloseDateAsc } from '@/utils/subprizes';

import { SubprizeCarouselTestIds } from './SubprizeCarouselTestIds';

export function SubprizeCarousel() {
    const { sweepstakeData } = useContext(SweepstakeContext);
    const item: IStrapiSweepstake = useSelector('strapiItem');
    const { t } = useTranslation(COMMON_TRANSLATIONS);

    if (
        sweepstakeData?.status !== SweepsStatus.Open ||
        !item ||
        sweepstakeData.subprizes.length === 0
    ) {
        return null;
    }

    const prizeDetailsCards =
        sweepstakeData?.subprizes
            ?.sort(sortSubprizesByCloseDateAsc)
            ?.map((subprize) => {
                const subprizeCmsData = item.attributes.subprizes?.find(
                    (subprizeApi) => subprizeApi.apiId === subprize.id,
                );

                if (!subprizeCmsData) {
                    return null;
                }

                return (
                    <SubprizeCarouselCard
                        key={subprize.id}
                        captionTitle={subprizeCmsData.title}
                        closeDate={new Date(subprize.close_date)}
                        imageAlt={subprizeCmsData.imageAlt}
                        imageHeight={
                            subprizeCmsData.image.data.attributes.height
                        }
                        imageSrc={subprizeCmsData.image.data.attributes.url}
                        imageWidth={subprizeCmsData.image.data.attributes.width}
                    />
                );
            })
            ?.filter((subprize) => !!subprize) || [];

    return (
        <div
            className="flex flex-col px-3 pt-4 md:pt-8 pb-6 bg-gray-50 w-full"
            data-testid={SubprizeCarouselTestIds.SUBPRIZE_CAROUSEL_CONTAINER}
        >
            <h3
                className="text-gray-900 font-bold text-xl md:text-3xl text-center leading-9 md:leading-9 mb-3"
                data-testid={SubprizeCarouselTestIds.SUBPRIZE_CAROUSEL_TITLE}
            >
                {t('subprizes.title')}
            </h3>
            <p
                className="text-center text-base font-medium leading-9 text-gray-900"
                data-testid={SubprizeCarouselTestIds.SUBPRIZE_CAROUSEL_SUBTITLE}
            >
                {t('subprizes.subtitle')}
            </p>
            <div className="hidden md:grid grid-flow-col gap-3 xl:px-[246px]">
                {prizeDetailsCards.map((prizeDetailsCard) => {
                    return prizeDetailsCard;
                })}
            </div>
            <div className="md:hidden">
                <Carousel slides={prizeDetailsCards} />
            </div>
        </div>
    );
}
