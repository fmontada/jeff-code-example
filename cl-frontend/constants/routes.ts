export const PAYMENT_CONFIRMED_ROUTE = '/checkout/thank-you';
export const SWEEPSTAKES_ROUTE = '/sweepstakes';
export const TERMS_OF_USE_ROUTE = '/terms';
export const PRIVACY_POLICY_ROUTE = '/privacy';

export function getSweepstakeRoute(sweepstakeSlug: string) {
    return `${SWEEPSTAKES_ROUTE}/${sweepstakeSlug}`;
}

export function getAccountRoute(suffix?: string) {
    return `/account${suffix ? `/${suffix}` : ''}`;
}
