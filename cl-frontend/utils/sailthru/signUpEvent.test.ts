import { ISailthru } from '@/store/useAppStore';

import { signUpEvent } from './signUpEvent';

const testEmail = 'test@mail.com';

describe('signUpEvent', (): void => {
    it('does nothing if email is invalid', (): void => {
        const jestMock = jest.fn();

        const sailthruMock: ISailthru = {
            integration: jestMock,
        };

        signUpEvent(sailthruMock, undefined);

        expect(jestMock).not.toHaveBeenCalled();
    });

    it('calls integration with no source and vars', (): void => {
        const jestMock = jest.fn();

        const sailthruMock: ISailthru = {
            integration: jestMock,
        };

        signUpEvent(sailthruMock, testEmail);

        expect(jestMock).toHaveBeenCalledWith('userSignUp', {
            email: testEmail,
            source: 'web',
            vars: {
                source: 'web',
            },
        });
    });

    it('calls integration with the proper source', (): void => {
        const jestMock = jest.fn();

        const sailthruMock: ISailthru = {
            integration: jestMock,
        };

        signUpEvent(sailthruMock, testEmail, 'mobile');

        expect(jestMock).toHaveBeenCalledWith('userSignUp', {
            email: testEmail,
            source: 'mobile',
            vars: {
                source: 'web',
            },
        });
    });

    it('calls integration with the proper source', (): void => {
        const jestMock = jest.fn();

        const sailthruMock: ISailthru = {
            integration: jestMock,
        };

        signUpEvent(sailthruMock, testEmail, undefined, { custom: 'true' });

        expect(jestMock).toHaveBeenCalledWith('userSignUp', {
            email: testEmail,
            source: 'web',
            vars: {
                custom: 'true',
            },
        });
    });
});
