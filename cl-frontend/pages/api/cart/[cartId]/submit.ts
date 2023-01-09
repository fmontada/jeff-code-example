import type { NextApiRequest, NextApiResponse } from 'next';

import { StripeOrderStatus } from '@/constants/stripe';
import { privateStripeClient } from '@/utils/stripe';

export default async function SubmitStripeOrderHandler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    try {
        if (!req.body?.email) {
            throw new Error('No email specified');
        }

        const cartId = req.query.cartId as string;

        const order = await privateStripeClient.orders.retrieve(cartId);

        if (order.status === StripeOrderStatus.SUBMITTED) {
            await privateStripeClient.orders.reopen(cartId);
        } else if (
            [
                StripeOrderStatus.CANCELED,
                StripeOrderStatus.COMPLETE,
                StripeOrderStatus.PROCESSING,
            ].includes(order.status as StripeOrderStatus)
        ) {
            return res.status(500).json({ alreadyCompleted: order.status });
        }

        const { amount_total } = await privateStripeClient.orders.update(
            cartId,
            {
                billing_details: {
                    email: req.body.email,
                },
            },
        );

        await privateStripeClient.orders.submit(cartId, {
            expected_total: amount_total,
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
