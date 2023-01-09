/* eslint-disable no-unused-vars */
'use strict';

const postUserRegistration = require('../../src/post_user_registration.js');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const mockAxios = new MockAdapter(axios);
const errorLogSpy = jest.spyOn(console, 'error');

describe('post_user_registration', () => {
    afterEach(() => {
        errorLogSpy.mockClear();
        mockAxios.reset();
    });

    it('notifies user service on post user registration', (done) => {
        // Given
        let user = {
            id: 'abc123',
            username: 'John1',
            given_name: 'John',
            family_name: 'Doe',
            email: 'test@example.com',
            emailVerified: true
        };

        mockAxios.onPost('${AUTH0_TENANT_URL}/oauth/token').reply((config) => {
            return [200, { access_token: 'generated-awesomeness', expires_in: 200 }];
        });

        mockAxios.onPost('${USER_SERVICE_URL}/user_signed_up', {
            user_id: user.id,
            username: user.username,
            first_name: user.given_name,
            last_name: user.family_name,
            email: user.email,
            email_verified: user.emailVerified,
            accepts_marketing: false
        }).reply((config) => {
            return [200, {
                message: 'OK',
            }];
        });

        // When
        postUserRegistration(user, 'context', (err, u) => {
            // Then
            expect(err).toBeNull();
            expect(errorLogSpy).not.toHaveBeenCalled();
            done();
        });
    });
});
