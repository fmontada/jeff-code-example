import {
    calculateTimeLeft,
    formatTimeLeftToText,
    isLessThan7DaysAway,
} from './time';

const inTwoDays = new Date();
inTwoDays.setDate(inTwoDays.getDate() + 2);

describe('calculateTimeLeft', (): void => {
    it('gets the time left', (): void => {
        expect(calculateTimeLeft(inTwoDays)).toStrictEqual({
            days: 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
        });
    });
});

describe('formatTimeLeftToText', (): void => {
    it('formats time in the expected format', (): void => {
        expect(formatTimeLeftToText(inTwoDays)).toBe('01d 23h 59m 59s');
    });
});

describe('isLessThan7DaysAway', (): void => {
    it('returns true with less than 7 days', (): void => {
        expect(isLessThan7DaysAway(inTwoDays)).toBeTruthy();
    });

    it('returns false with more than 7 days', (): void => {
        const in11Days = new Date();
        in11Days.setDate(in11Days.getDate() + 11);

        expect(isLessThan7DaysAway(in11Days)).toBeFalsy();
    });
});
