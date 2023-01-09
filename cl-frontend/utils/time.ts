export function calculateTimeLeft(closeDate: Date): Record<string, number> {
    const difference = +closeDate - +new Date();
    let timeLeft = {};

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }

    return timeLeft;
}

export function formatTimeLeftToText(closeDate: Date): string {
    const { days, hours, minutes, seconds } = calculateTimeLeft(closeDate);
    const daysText = days < 10 ? `0${days}d` : `${days}d`;
    const hoursText = hours < 10 ? `0${hours}h` : `${hours}h`;
    const minutesText = minutes < 10 ? `0${minutes}m` : `${minutes}m`;
    const secondsText = seconds < 10 ? `0${seconds}s` : `${seconds}s`;

    return `${daysText} ${hoursText} ${minutesText} ${secondsText}`;
}

export function isLessThan7DaysAway(closeDate: Date): boolean {
    const { days } = calculateTimeLeft(closeDate);
    return days < 7;
}
