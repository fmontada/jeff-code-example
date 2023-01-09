import { Price } from '@/api/sweepstakes';

export function getOrderedPrices(prices: Price[]) {
    if (!prices) {
        return [];
    }

    const newPrices = [...prices].sort((a, b) => a.price - b.price);
    return newPrices;
}
