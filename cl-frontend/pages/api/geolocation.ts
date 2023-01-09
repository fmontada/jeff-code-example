import type { NextApiRequest, NextApiResponse } from 'next';

import { IGeolocationPosition } from '@/types/user';

export default function geoLocationHandler(
    req: NextApiRequest,
    res: NextApiResponse<IGeolocationPosition>,
) {
    res.status(200).json({
        city: req.headers['x-vercel-ip-country'] as string,
        region: req.headers['x-vercel-ip-country-region'] as string,
        country: req.headers['x-vercel-ip-country'] as string,
    });
}
