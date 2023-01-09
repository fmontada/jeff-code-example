import type { NextApiRequest, NextApiResponse } from 'next';

import { privateStripeClient } from '@/utils/stripe';

export default async function GetStripeOrderHandler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        const response = await privateStripeClient.orders.retrieve(
            req.query.cartId as string,
        );
        res.status(200).json(response.client_secret);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
