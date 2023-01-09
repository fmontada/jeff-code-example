export function formatDateToLocalString(
    isoDate: string,
    formatDateOptions: Partial<Intl.DateTimeFormatOptions> = {},
): string {
    const defaultFormatDateOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };

    const compoundFormatDateOptions = Object.assign(
        {},
        defaultFormatDateOptions,
        formatDateOptions,
    );

    const DEFAULT_FORMAT_DATE_LOCALE = 'en-US';
    const formatDateLocale =
        process.env.FORMAT_DATE_LOCALE || DEFAULT_FORMAT_DATE_LOCALE;

    return new Date(isoDate).toLocaleDateString(
        formatDateLocale,
        compoundFormatDateOptions,
    );
}
