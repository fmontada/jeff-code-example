/* eslint-disable no-unused-vars */
'use strict';

const preUserRegistration = require('../../src/pre_user_registration.js');
const errorLogSpy = jest.spyOn(console, 'error');

describe('pre_user_registration', () => {
    afterEach(() => {
        errorLogSpy.mockClear();
    });

    it('successfully validate email', (done) => {
        // Given
        let user = {
            id: 'abc123',
            email: 'test@example.com',
        };

        // When
        preUserRegistration(user, 'context', (err, u) => {
            // Then
            expect(err).toBeNull();
            done();
        });
    });

    it('stop user signup if the email contains a + character', (done) => {
        // Given
        let user = {
            id: 'abc123',
            email: 'test+@example.com',
        };

        // When
        preUserRegistration(user, 'context', (err, u) => {
            // Then
            expect(err).toEqual(new Error('not a valid email format'));
            expect(u).toBeUndefined();
            done();
        });
    });
});
