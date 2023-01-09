import { extractEmail } from './extractEmail';

describe('extractEmail', (): void => {
    it('extract email from the auth0 email varification error message', (): void => {
        expect(
            extractEmail(
                'Please verify your email before logging in: test@test.com',
            ),
        ).toBe('test@test.com');
    });
});
