import axios from 'axios';

import { Experience } from '@/api/orders';
import { Sweepstakes } from '@/api/sweepstakes';
import { useUserStore } from '@/store/useUserStore';
import { IExperienceWithSweepstakeData } from '@/types/api';
import { IStrapiSweepstake } from '@/types/strapi';
import { getExperiencesApi, getSweepstakesApi } from '@/utils/api';

export async function getUserExperiencesQuery(): Promise<
    IExperienceWithSweepstakeData[]
> {
    try {
        const experiencesApi = getExperiencesApi();
        const authorizationToken = useUserStore?.getState()?.authorizationToken;
        const {
            data: { experiences },
        } = await experiencesApi.getV1ExperiencesSelf(authorizationToken);

        const sweepstakesData = await getSweepstakesFromExperiences(
            experiences,
        );
        const strapiDataList = await getStrapiDataBySweepstakesSlugs(
            sweepstakesData,
        );

        const response: (IExperienceWithSweepstakeData | null)[] =
            experiences.map((experience) => {
                const sweepstakeData = sweepstakesData.find(
                    (sweepstakeResponse) =>
                        sweepstakeResponse.id === experience.sweepstakes_id,
                );

                if (!sweepstakeData) {
                    return null;
                }

                const strapiData = strapiDataList.find(
                    (strapiResponse) =>
                        strapiResponse?.attributes?.slug ===
                        sweepstakeData.slug,
                );

                if (!strapiData) {
                    return null;
                }

                return {
                    sweepstake_id: experience.sweepstakes_id,
                    image: strapiData.attributes.heroImage.data[0].attributes
                        .url,
                    charity:
                        strapiData.attributes.charityInfo.charityDetailsTitle,
                    description: strapiData.attributes.prizeDetailsTitle,
                    entries: experience.total_entries,
                    closeDate: sweepstakeData.grand_prize.close_date,
                    status: sweepstakeData.status,
                };
            });

        return response.filter((experience) => Boolean(experience));
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function getStrapiDataBySweepstakesSlugs(
    sweepstakesData: Sweepstakes[],
): Promise<IStrapiSweepstake[]> {
    const slugsArray = Array.from(
        new Set(sweepstakesData.map((sweepstakeData) => sweepstakeData.slug)),
    ).filter((slug) => Boolean(slug));

    const filtersQueryParams = slugsArray.map(
        (slug) => `filters[slug][$eq]=${slug}`,
    );

    const { data: strapiDataList } = await axios.get(
        `${
            process.env.NEXT_PUBLIC_STRAPI_HOST
        }/api/sweepstakes/?populate=*&${filtersQueryParams.join('&')}`,
        {
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_PUBLIC_TOKEN}`,
            },
        },
    );

    return strapiDataList.data;
}

async function getSweepstakesFromExperiences(
    experiences: Experience[],
): Promise<Sweepstakes[]> {
    const sweepstakesApi = getSweepstakesApi();

    const uniquesweepstakesListFromExperiences = Array.from(
        new Set(experiences.map((experience) => experience.sweepstakes_id)),
    );

    const { data: sweepstakesDataFromAxios } =
        await sweepstakesApi.getSweepstakes(
            undefined,
            undefined,
            uniquesweepstakesListFromExperiences.join(','),
        );

    const sweepstakesData = sweepstakesDataFromAxios.sweepstakes.filter(
        (sweepstake) => Boolean(sweepstake),
    );

    return sweepstakesData;
}
