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

const ruleName = 'multipass_rule';

describe(ruleName, () => {
    let rule;
    const user = {
        given_name: 'Harry',
        family_name: 'Test',
        email: 'harry@example.com'
    };

    const context = new ContextBuilder()
        .withEmail(user.email)
        .build();

    afterEach(() => {
        axiosSpy.mockClear();
        errorLogSpy.mockClear();
        mockAxios.reset();
    });

    it('successfully adds multipass token to context with a vaild accesstoken', (done) => {
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
                    obtainClientCredentialAccessToken(identifier){
                        return {
                            jwt: 'token', exp: moment().utc().add(1000, 'seconds')
                        };
                    }
                }
            }
        };

        rule = loadRule(ruleName, globals, {});

        mockAxios.onPost('https://test.omaze.com/generate_multipass').reply((config) => {
            return [200, { multipass_token: 'awesome-token-value' }];
        });

        // When
        rule(user, context, (err, u, c) => {

            //Then
            expect(err).toBeNull();
            expect(c.idToken['test-namespace/multipass']).toEqual('awesome-token-value');

            expect(axiosSpy).toHaveBeenCalledWith(
                'https://test.omaze.com/generate_multipass',
                {
                    email: 'harry@example.com',
                    first_name: 'Harry',
                    last_name: 'Test'
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

    it('returns error due to missing config values', (done) => {
        // Given
        const globals = {
            configuration: {
                CLIENT_ID: 'client_id',
                CLIENT_SECRET: 'client_secret',
                IDENTIFIER: 'identifier',
                USER_SERVICE_URL: 'https://test.omaze.com',
                AUTH0_TENANT_URL: 'https://test.auth0.com',
                // MULTIPASS_TOKEN_NAMESPACE: 'hello'
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
                    obtainClientCredentialAccessToken(identifier){
                        throw new Error('500 from server');
                    }
                }
            }
        };

        rule = loadRule(ruleName, globals, {});

        // When
        rule(user, context, (err, u, c) => {

            //Then
            expect(err).toEqual(new Error('Failed to get a multipass token'));
            expect(errorLogSpy).toHaveBeenCalledWith(new Error('500 from server'));
            done();
        });
    });

    it('returns error due to omaze-service error', (done) => {
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
                    obtainClientCredentialAccessToken(identifier){
                        return {
                            jwt: 'token', exp: moment().utc().add(1000, 'seconds')
                        };
                    }
                }
            }
        };

        rule = loadRule(ruleName, globals, {});

        mockAxios.onPost('https://test.omaze.com/generate_multipass').reply((config) => {
            return [500, {}];
        });

        // When
        rule(user, context, (err, u, c) => {

            //Then
            expect(err).toEqual(new Error('Failed to get a multipass token'));
            expect(errorLogSpy).toHaveBeenCalledWith(
                new Error('Request failed with status code 500')
            );
            done();
        });
    });
});
