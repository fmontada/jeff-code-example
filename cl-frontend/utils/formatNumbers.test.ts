import {
    formatCentsForGtm,
    formatCentsWithCurrency,
    formatWithCurrency,
} from './formatNumbers';

describe('formatWithCurrency', (): void => {
    it('format with the default USD format', (): void => {
        expect(formatWithCurrency(3890.5)).toBe('$3,890.50');
    });

    it('removes trailing comma when is followed by zeros', (): void => {
        expect(formatWithCurrency(5000.0)).toBe('$5,000');
    });

    it('format using a different currency', (): void => {
        expect(formatWithCurrency(6500.5, 'EUR')).toBe('€6,500.50');
    });

    it('removes trailing comma while using a different currency', (): void => {
        expect(formatWithCurrency(4301, 'EUR')).toBe('€4,301');
    });
});

describe('formatCentsWithCurrency', (): void => {
    it('format cents with the default USD format', (): void => {
        expect(formatCentsWithCurrency(313020)).toBe('$3,130.20');
    });

    it('format using a different currency', (): void => {
        expect(formatCentsWithCurrency(879010, 'EUR')).toBe('€8,790.10');
    });

    it('removes trailing comma when is followed by zeros', (): void => {
        expect(formatCentsWithCurrency(569000, 'EUR')).toBe('€5,690');
    });
});

describe('formatCentsForGtm', (): void => {
    it('format 2 units at $1 to half the price with two cents', (): void => {
        expect(formatCentsForGtm(100, 2)).toBe('0.50');
    });

    it('formats 10 quantities with a price of 3 each', (): void => {
        expect(formatCentsForGtm(3000, 10)).toBe('3.00');
    });

    it('adds zeros if missing', (): void => {
        expect(formatCentsForGtm(100, 1)).toBe('1.00');
    });
});
