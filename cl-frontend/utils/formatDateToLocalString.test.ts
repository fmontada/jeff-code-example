import { formatDateToLocalString } from './formatDateToLocalString';

describe('formatDateToLocalString', (): void => {
    it('format using the default en-us format', (): void => {
        expect(formatDateToLocalString('1999-12-03T17:53:00.000Z')).toBe(
            'Dec 3, 1999',
        );
    });

    it('format using a different format using environment variable', (): void => {
        const previousFormatedDate = process.env.FORMAT_DATE_LOCALE;
        process.env.FORMAT_DATE_LOCALE = 'de-DE';
        expect(formatDateToLocalString('1999-12-03T17:53:00.000Z')).toBe(
            '3. Dez. 1999',
        );
        process.env.FORMAT_DATE_LOCALE = previousFormatedDate;
    });
});
