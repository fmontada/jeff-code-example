import Stripe from 'stripe';

export const privateStripeClient = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
    apiVersion: process.env.NEXT_PUBLIC_STRIPE_API_VERSION as any,
});
