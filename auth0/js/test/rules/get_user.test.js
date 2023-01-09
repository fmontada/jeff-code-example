/* eslint-disable no-unused-vars */
'use strict';

const loadRule = require('../utils/load-rule');
const axios = require('axios');
const moment = require('moment-timezone');
const MockAdapter = require('axios-mock-adapter');
const mockAxios = new MockAdapter(axios);
const axiosGetSpy = jest.spyOn(axios, 'get');
const errorLogSpy = jest.spyOn(console, 'error');

const ruleName = 'get_user';

describe(ruleName, () => {
    let rule;
    const email = 'harry@example.com';

    afterEach(() => {
        axiosGetSpy.mockClear();
        errorLogSpy.mockClear();
        mockAxios.reset();
    });

    it('successfully returns a user for get_user', (done) => {
        // Given
        const globals = {
            configuration: {
                CLIENT_ID: 'client_id',
                CLIENT_SECRET: 'client_secret',
                IDENTIFIER: 'identifier',
                USER_SERVICE_URL: 'https://test.omaze.com',
                AUTH0_TENANT_URL: 'https://test.auth0.com',
                RULES_CLIENT_ID: 'test-client-id',
                RULES_CLIENT_SECRET: 'test-client-secret',
                AUTH0_DOMAIN: 'test-auth0',
                ACCESS_TOKEN: JSON.stringify( {jwt: 'awesome-token', exp: moment().utc().add(20, 'second')})
            },
            global: {}
        };

        rule = loadRule(ruleName, globals, {
            'auth0@2.27.1' : {
                ManagementClient : class {
                    getConnections(){
                        return jest.fn();
                    }
                    updateConnection(){
                        return jest.fn();
                    }
                }
            }
        });

        mockAxios.onGet('https://test.omaze.com/get_user', {
            params: {
                email
            }
        }).reply((config) => {
            return [200, {
                given_name: 'Harry',
                family_name: 'Example',
                user_id: 1,
                email: 'harry@example.com'
            }];
        });

        // When
        rule(email, (err, u) => {

            //Then
            expect(err).toBeNull();
            expect(u).toEqual({
                given_name: 'Harry',
                family_name: 'Example',
                user_id: 1,
                email: 'harry@example.com',
                app_metadata: {
                    lazy_migration: true
                }
            });

            expect(axiosGetSpy).toHaveBeenCalledWith(
                'https://test.omaze.com/get_user',
                {
                    headers: {
                        ContentType: 'application/json',
                        Authorization: 'Bearer awesome-token'
                    },
                    params: {
                        email
                    }
                });
            expect(errorLogSpy).not.toHaveBeenCalled();
            done();
        });
    });

    it('returns successful response with no accesstoken', (done) => {
        // Given
        const globals = {
            configuration: {
                CLIENT_ID: 'client_id',
                CLIENT_SECRET: 'client_secret',
                IDENTIFIER: 'identifier',
                USER_SERVICE_URL: 'https://test.omaze.com',
                AUTH0_TENANT_URL: 'https://test.auth0.com',
                RULES_CLIENT_ID: 'test-client-id',
                RULES_CLIENT_SECRET: 'test-client-secret',
                AUTH0_DOMAIN: 'test-auth0'
            },
            global: {}
        };

        rule = loadRule(ruleName, globals, {
            'auth0@2.27.1' : {
                ManagementClient : class {
                    getConnections(){
                        return new Promise((resolve) => {
                            resolve([{
                                id: 'test-id',
                                name: 'Omaze-Users',
                                options: {
                                    configuration: {}
                                }
                            }]);
                        });
                    }
                    updateConnection(){
                        return new Promise((resolve) => {
                            globals.configuration.ACCESS_TOKEN = 'awesome-token';
                            resolve({
                                id: 'test-id',
                                name: 'Omaze-Users',
                                options: {
                                    configuration: {
                                        ACCESS_TOKEN: 'awesome-token'
                                    }
                                }
                            });
                        });
                    }
                }
            }
        });

        mockAxios.onPost('https://test.auth0.com/oauth/token').reply((config) => {
            return [200, { access_token: 'awesome-token', expires_in: 200 }];
        });

        mockAxios.onGet('https://test.omaze.com/get_user', {
            params: {
                email
            }
        }).reply((config) => {
            return [200, {
                email: 'harry@example.com',
                given_name: 'Harry',
                family_name: 'Test',
                user_id: 1,
                email_verified: false 
            }];
        });

        // When
        rule(email, (err, u) => {

            //Then
            expect(err).toBeNull();
            expect(u).toEqual({
                email: 'harry@example.com',
                given_name: 'Harry',
                family_name: 'Test',
                user_id: 1,
                email_verified: false,
                app_metadata: {
                    lazy_migration: true
                }
            });

            expect(axiosGetSpy).toHaveBeenCalledWith(
                'https://test.omaze.com/get_user',
                {
                    headers: {
                        ContentType: 'application/json',
                        Authorization: 'Bearer awesome-token'
                    },
                    params: {
                        email
                    }
                });
            expect(globals.configuration.ACCESS_TOKEN).toEqual('awesome-token');
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
                // AUTH0_TENANT_URL: 'https://test.auth0.com',
            },
            global: {
            }
        };

        rule = loadRule(ruleName, globals, {
            'auth0@2.27.1': {
                ManagementClient: class {
                    getConnections(){
                        return jest.fn();
                    }
                    updateConnection(){
                        return jest.fn();
                    }
                }
            }
        });

        // When
        rule(email, (err, u) => {

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
                RULES_CLIENT_ID: 'test-client-id',
                RULES_CLIENT_SECRET: 'test-client-secret',
                AUTH0_DOMAIN: 'test-auth0'
            },
            global: {}
        };

        rule = loadRule(ruleName, globals, {
            'auth0@2.27.1': {
                ManagementClient: class {
                    getConnections(){
                        return jest.fn();
                    }
                    updateConnection(){
                        return jest.fn();
                    }
                }
            }
        });

        mockAxios.onPost('https://test.auth0.com/oauth/token').reply((config) => {
            return [500, {}];
        });

        // When
        rule(email, (err, u) => {

            //Then
            expect(err).toEqual(new Error('there was a problem getting user'));
            expect(errorLogSpy).toHaveBeenCalledWith(
                'Unable to retrieve API Access token. Please check that your credentials (CLIENT_ID and CLIENT_SECRET) are correct.'
            );
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
                RULES_CLIENT_ID: 'test-client-id',
                RULES_CLIENT_SECRET: 'test-client-secret',
                AUTH0_DOMAIN: 'test-auth0',
                ACCESS_TOKEN: JSON.stringify( {jwt: 'awesome-token', exp: moment().utc().add(20, 'second')})
            },
            global: {}
        };

        rule = loadRule(ruleName, globals, {
            'auth0@2.27.1' : {
                ManagementClient : class {
                    getConnections(){
                        return jest.fn();
                    }
                    updateConnection(){
                        return jest.fn();
                    }
                }
            }
        });

        mockAxios.onGet('https://test.omaze.com/get_user', {
            params: {
                email
            }
        }).reply((config) => {
            return [500, {}];
        });

        // When
        rule(email, (err, u) => {

            //Then
            expect(err).toEqual(new Error('there was a problem getting user'));
            expect(errorLogSpy).toHaveBeenCalledWith(
                new Error('Request failed with status code 500')
            );
            done();
        });
    });

    it('returns error due to no user found', (done) => {
        // Given
        const globals = {
            configuration: {
                CLIENT_ID: 'client_id',
                CLIENT_SECRET: 'client_secret',
                IDENTIFIER: 'identifier',
                USER_SERVICE_URL: 'https://test.omaze.com',
                AUTH0_TENANT_URL: 'https://test.auth0.com',
                RULES_CLIENT_ID: 'test-client-id',
                RULES_CLIENT_SECRET: 'test-client-secret',
                AUTH0_DOMAIN: 'test-auth0',
                ACCESS_TOKEN: JSON.stringify( {jwt: 'awesome-token', exp: moment().utc().add(20, 'second')})
            },
            global: {}
        };

        rule = loadRule(ruleName, globals, {
            'auth0@2.27.1' : {
                ManagementClient : class {
                    getConnections(){
                        return jest.fn();
                    }
                    updateConnection(){
                        return jest.fn();
                    }
                }
            }
        });

        mockAxios.onGet('https://test.omaze.com/get_user', {
            params: {
                email
            }
        }).reply((config) => {
            return [404, { message: 'no user found with email' }];
        });

        // When
        rule(email, (err, u) => {

            //Then
            expect(err).toBeNull();
            expect(u).toBeNull();
            done();
        });
    });

    it('returns error due to getting connections from Auth0', (done) => {
        // Given
        const globals = {
            configuration: {
                CLIENT_ID: 'client_id',
                CLIENT_SECRET: 'client_secret',
                IDENTIFIER: 'identifier',
                USER_SERVICE_URL: 'https://test.omaze.com',
                AUTH0_TENANT_URL: 'https://test.auth0.com',
                RULES_CLIENT_ID: 'test-client-id',
                RULES_CLIENT_SECRET: 'test-client-secret',
                AUTH0_DOMAIN: 'test-auth0'
            },
            global: {}
        };

        rule = loadRule(ruleName, globals, {
            'auth0@2.27.1' : {
                ManagementClient : class {
                    getConnections(){
                        return Promise.reject(new Error('Problem getting connections'));
                    }
                    updateConnection(){
                        return jest.fn();
                    }
                }
            }
        });

        mockAxios.onPost('https://test.auth0.com/oauth/token').reply((config) => {
            return [200, { access_token: 'awesome-token', expires_in: 200 }];
        });

        // When
        rule(email, (err, u) => {

            //Then
            expect(err).toEqual(new Error('there was a problem getting user'));
            expect(errorLogSpy).toHaveBeenCalledWith(
                new Error('Problem getting connections')
            );
            expect(u).toBeUndefined();
            done();
        });
    });

    it('returns error due to updating connection with token', (done) => {
        // Given
        const globals = {
            configuration: {
                CLIENT_ID: 'client_id',
                CLIENT_SECRET: 'client_secret',
                IDENTIFIER: 'identifier',
                USER_SERVICE_URL: 'https://test.omaze.com',
                AUTH0_TENANT_URL: 'https://test.auth0.com',
                RULES_CLIENT_ID: 'test-client-id',
                RULES_CLIENT_SECRET: 'test-client-secret',
                AUTH0_DOMAIN: 'test-auth0'
            },
            global: {}
        };

        rule = loadRule(ruleName, globals, {
            'auth0@2.27.1' : {
                ManagementClient : class {
                    getConnections(){
                        return new Promise((resolve) => {
                            resolve([{
                                id: 'test-id',
                                name: 'Omaze-Users',
                                options: {
                                    configuration: {}
                                }
                            }]);
                        });
                    }
                    updateConnection(){
                        return Promise.reject(new Error('Problem updating connection'));
                    }
                }
            }
        });

        mockAxios.onPost('https://test.auth0.com/oauth/token').reply((config) => {
            return [200, { access_token: 'awesome-token', expires_in: 200 }];
        });

        // When
        rule(email, (err, u) => {

            //Then
            expect(err).toEqual(new Error('there was a problem getting user'));
            expect(errorLogSpy).toHaveBeenCalledWith(
                new Error('Problem updating connection')
            );
            expect(u).toBeUndefined();
            done();
        });
    });

});
