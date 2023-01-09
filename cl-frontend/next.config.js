/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require('./next-i18next.config');

module.exports = {
    i18n,
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/',
                destination: '/sweepstakes',
            },
        ];
    },
    async redirects() {
        const redirects = [];
        const inMaintenanceMode =
            process.env.NEXT_PUBLIC_MAINTENANCE_ENABLED === '1';

        // HERE I TRIED TO REDIRECT OUR PAGES AS WELL, BUT IT ENDED UP IN A LOOP
        if (inMaintenanceMode) {
            redirects.push({
                source: '/api/:path*',
                destination: '/',
                permanent: false,
            });
        }

        return redirects;
    },
    images: {
        domains: process.env.IMAGE_DOMAINS_LIST?.split(',') || [],
    },
};
