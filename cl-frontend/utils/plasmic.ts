import { QUERY_FILTER } from '@/constants/strapi';

export function getStrapiFilter(slug: string) {
    return `filters[slug]=${slug}&populate[0]=${QUERY_FILTER}`;
}
