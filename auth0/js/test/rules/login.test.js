/* eslint-disable no-unused-vars */
'use strict';

const loadRule = require('../utils/load-rule');
const axios = require('axios');
const moment = require('moment-timezone');
const MockAdapter = require('axios-mock-adapter');
const mockAxios = new MockAdapter(axios);

const ruleName = 'login';

describe(ruleName, () => {
    let rule;
    let globals;

    beforeEach(() => {
        globals = {
            WrongUsernameOrPasswordError: function (err) { console.log('err', err); },
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
    });

    it('can validate the user credentials', (done) => {
        // Given
        const email = 'email';
        const password = 'password';

        mockAxios.onPost(/(\/login)/i).reply((config) => {
            return [200, { user_id: '1', email: 'email' }];
        });

        // When
        rule(email, password, (err, u, c) => {
            expect(err).toBeNull();
            expect(u.email).toEqual('email');
            expect(u.user_id).toEqual('1');
            expect(u.app_metadata).toEqual({ lazy_migration: true});
            done();
        });
    });

    it('user no found', (done) => {
        // Given
        const email = 'email';
        const password = 'password';

        mockAxios.onPost(/(\/login)/i).reply((config) => {
            return [404, { 'message': 'no user found with email' }];
        });

        // When
        rule(email, password, (err, u, c) => {
            expect(err).toEqual(expect.anything());
            done();
        });
    });

    it('invalid user response', (done) => {
        // Given
        const email = 'email';
        const password = 'password';

        mockAxios.onPost(/(\/login)/i).reply((config) => {
            return [200, {}];
        });

        // When
        rule(email, password, (err, u, c) => {
            expect(err).toBeNull();
            expect(u.email).toBeUndefined();
            expect(u.user_id).toBeUndefined();
            done();
        });
    });

    it('can generate the jwt token', (done) => {
        // Given
        const email = 'email';
        const password = 'password';

        globals.configuration.ACCESS_TOKEN = null;

        mockAxios.onPost(/(\/token)/i).reply((config) => {
            return [200, { expires_in: 100, access_token: 'token' }];
        });

        mockAxios.onPost(/(\/login)/i).reply((config) => {
            return [200, {}];
        });

        // When
        rule(email, password, (err, u, c) => {
            expect(err).toBeNull();
            expect(globals.configuration.ACCESS_TOKEN).toEqual('awesome-token');
            done();
        });
    });
});
