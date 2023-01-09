/* eslint-disable no-unused-vars */
'use strict';

const loadRule = require('../utils/load-rule');
const axios = require('axios');
const moment = require('moment-timezone');
const MockAdapter = require('axios-mock-adapter');
const mockAxios = new MockAdapter(axios);
const axiosSpy = jest.spyOn(axios, 'post');
const errorLogSpy = jest.spyOn(console, 'error');
const ContextBuilder = require('../utils/contextBuilder');

const ruleName = 'post_user_registration_rule';

describe(ruleName, () => {
    let rule;
    let user = {
        given_name: 'Harry',
        family_name: 'Test',
        email: 'harry@example.com',
        user_metadata: {
            optIn: 'false'
        },
        app_metadata: {
            signed_up_notification: false
        }
    };

    let context = new ContextBuilder()
        .withEmail(user.email)
        .build();

    context.stats.loginsCount = 1;

    afterEach(() => {
        axiosSpy.mockClear();
        errorLogSpy.mockClear();
        mockAxios.reset();
    });

    it('successfully notify post user registration', (done) => {
        // Given
        const globals = {
            auth0: {
                users: {
                    updateAppMetadata: jest.fn()
                }
            },
            configuration: {
                USER_SERVICE_URL: 'https://test.omaze.com',
            },
            global: {
                helpers: {
                    obtainClientCredentialAccessToken(identifier) {
                        return {
                            jwt: 'token', exp: moment().utc().add(1000, 'seconds')
                        };
                    }
                }
            }
        };

        rule = loadRule(ruleName, globals, {});

        mockAxios.onPost('https://test.omaze.com/user_signed_up').reply((config) => {
            return [200, { message: 'OK' }];
        });

        // When
        rule(user, context, (err, u, c) => {

            //Then
            expect(err).toBeNull();

            expect(axiosSpy).toHaveBeenCalledWith(
                'https://test.omaze.com/user_signed_up',
                {
                    user_id: user.id,
                    username: user.username,
                    first_name: user.given_name,
                    last_name: user.family_name,
                    email: user.email,
                    email_verified: user.email_verified,
                    accepts_marketing: false
                },
                {
                    headers: {
                        ContentType: 'application/json',
                        Authorization: 'Bearer token'
                    }
                });
            expect(errorLogSpy).not.toHaveBeenCalled();
            done();
        });
    });

    it('do not notify omaze-service if the user is already signed up', (done) => {
        // Given
        const globals = {
            configuration: {
                USER_SERVICE_URL: 'https://test.omaze.com',
            },
            global: {
                userServiceApiToken: {
                    jwt: 'token', exp: moment().utc().add(1000, 'seconds')
                }
            }
        };

        user.app_metadata.signed_up_notification = true;

        rule = loadRule(ruleName, globals, {});

        // When
        rule(user, context, (err, u, c) => {

            //Then
            expect(err).toBeNull();
            done();
        });
    });

    it('returns error due to missing config values', (done) => {
        // Given
        const globals = {
            configuration: {
            },
            global: {
                userServiceApiToken: {
                    jwt: 'token', exp: moment().utc().add(1000, 'seconds')
                }
            }
        };

        rule = loadRule(ruleName, globals, {});

        // When
        rule(user, context, (err, u, c) => {

            //Then
            expect(err).toEqual(new Error('Missing required configuration.'));
            done();
        });
    });

    it('returns error due to oauth/token server error', (done) => {
        // Given
        const globals = {
            configuration: {
                CLIENT_ID: 'client_id',
                CLIENT_SECRET: 'client_secret',
                IDENTIFIER: 'identifier',
                USER_SERVICE_URL: 'https://test.omaze.com',
                AUTH0_TENANT_URL: 'https://test.auth0.com',
                MULTIPASS_TOKEN_NAMESPACE: 'test-namespace'
            },
            global: {
                helpers: {
                    obtainClientCredentialAccessToken(identifier) {
                        throw new Error('500 from server');
                    }
                }
            }
        };

        user.app_metadata.signed_up_notification = false;

        rule = loadRule(ruleName, globals, {});

        // When
        rule(user, context, (err, u, c) => {

            //Then
            expect(err).toEqual(new Error('Failed to notify user service'));
            expect(errorLogSpy).toHaveBeenCalledWith(new Error('500 from server'));
            done();
        });
    });

    it('returns error due to omaze-service error', (done) => {
        // Given
        const globals = {
            configuration: {
                USER_SERVICE_URL: 'https://test.omaze.com',
            },
            global: {
                helpers: {
                    obtainClientCredentialAccessToken(identifier) {
                        return {
                            jwt: 'token', exp: moment().utc().add(1000, 'seconds')
                        };
                    }
                }
            }
        };

        user.app_metadata.signed_up_notification = false;

        rule = loadRule(ruleName, globals, {});

        mockAxios.onPost('https://test.omaze.com/user_signed_up').reply((config) => {
            return [500, {}];
        });

        // When
        rule(user, context, (err, u, c) => {

            //Then
            expect(err).toEqual(new Error('Failed to notify user service'));
            expect(errorLogSpy).toHaveBeenCalledWith(
                new Error('Request failed with status code 500')
            );
            done();
        });
    });
});
