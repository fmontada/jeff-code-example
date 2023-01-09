/* eslint-disable no-unused-vars */
'use strict';

const loadRule = require('../utils/load-rule');
const axios = require('axios');
const moment = require('moment-timezone');
const MockAdapter = require('axios-mock-adapter');
const mockAxios = new MockAdapter(axios);
const ContextBuilder = require('../utils/contextBuilder');

const ruleName = 'get_access_token';

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
        mockAxios.reset();
    });

    it('successfully generates new token when config does not exist', async (done) => {
        // Given
        const globals = {
            configuration: {
                CLIENT_ID: 'client_id',
                CLIENT_SECRET: 'client_secret',
                IDENTIFIER: 'identifier',
                AUTH0_TENANT_URL: 'https://test.auth0.com',
                RULES_CLIENT_ID: 'rule_client_id',
                RULES_CLIENT_SECRET: 'rule_client_secret',
                AUTH0_DOMAIN: 'auth0_domain'
            },
            global: {}
        };

        mockAxios.onPost('https://test.auth0.com/oauth/token').reply((config) => {
            return [200, { access_token: 'generated-awesomeness', expires_in: 200 }];
        });
    
        rule = loadRule(ruleName, globals, {
            'auth0@2.27.1' : {
                ManagementClient : class {
                    setRulesConfig(){
                        return jest.fn();
                    }
                }
            }
        });

        // When
        rule(user, context, (err, u, c) => {
            expect(globals.global.helpers.obtainClientCredentialAccessToken).not.toBeUndefined();
        });
        const myToken = await globals.global.helpers.obtainClientCredentialAccessToken();

        // Then
        expect(myToken.jwt).toEqual('generated-awesomeness');
        done();
    });

    it('successfully generates new token when token is expired', async (done) => {
        // Given
        const mockToken = {
            jwt: 'old-token',
            exp: moment().utc().add(-1000, 'seconds')
        };
        const globals = {
            configuration: {
                CLIENT_ID: 'client_id',
                CLIENT_SECRET: 'client_secret',
                IDENTIFIER: 'identifier',
                AUTH0_TENANT_URL: 'https://test.auth0.com',
                RULES_CLIENT_ID: 'rule_client_id',
                RULES_CLIENT_SECRET: 'rule_client_secret',
                AUTH0_DOMAIN: 'auth0_domain',
                'ACCESS_TOKEN:identifier': JSON.stringify(mockToken)
            },
            global: {}
        };

        mockAxios.onPost('https://test.auth0.com/oauth/token').reply((config) => {
            return [200, { access_token: 'new-generated-awesomeness', expires_in: 200 }];
        });
    
        rule = loadRule(ruleName, globals, {
            'auth0@2.27.1' : {
                ManagementClient : class {
                    setRulesConfig(){
                        return jest.fn();
                    }
                }
            }
        });

        // When
        rule(user, context, (err, u, c) => {
            expect(globals.global.helpers.obtainClientCredentialAccessToken).not.toBeUndefined();
        });
        const myToken = await globals.global.helpers.obtainClientCredentialAccessToken();

        // Then
        expect(myToken.jwt).toEqual('new-generated-awesomeness');
        done();
    });

    it('successfully returns token from rule_config', async (done) => {
        // Given
        const mockToken = {
            jwt: 'token',
            exp: moment().utc().add(1000, 'seconds')
        };

        const globals = {
            configuration: {
                CLIENT_ID: 'client_id',
                CLIENT_SECRET: 'client_secret',
                IDENTIFIER: 'identifier',
                AUTH0_TENANT_URL: 'https://test.auth0.com',
                RULES_CLIENT_ID: 'rule_client_id',
                RULES_CLIENT_SECRET: 'rule_client_secret',
                AUTH0_DOMAIN: 'auth0_domain',
                'ACCESS_TOKEN': JSON.stringify(mockToken)
            },
            global: {}
        };
    
        rule = loadRule(ruleName, globals, {
            'auth0@2.27.1' : {
                ManagementClient : class {
                    setRulesConfig(){
                        return jest.fn();
                    }
                }
            }
        });

        // When
        rule(user, context, (err, u, c) => {
            expect(globals.global.helpers.obtainClientCredentialAccessToken).not.toBeUndefined();
        });
        const myToken = await globals.global.helpers.obtainClientCredentialAccessToken();

        // Then
        expect(myToken.jwt).toEqual('token');
        done();
    });
    it('throws an error for missing configuration', async (done) => {
        // Given
        const globals = {
            configuration: {
                CLIENT_ID: 'client_id',
                CLIENT_SECRET: 'client_secret',
                IDENTIFIER: 'identifier',
                AUTH0_TENANT_URL: 'https://test.auth0.com',
            },
            global: {}
        };
    
        rule = loadRule(ruleName, globals, {
            'auth0@2.27.1' : {
                ManagementClient : class {
                    setRulesConfig(){
                        return jest.fn();
                    }
                }
            }
        });

        // When
        rule(user, context, (err, u, c) => {
            expect(globals.global.helpers.obtainClientCredentialAccessToken).not.toBeUndefined();
        });

        const err = await globals.global.helpers.obtainClientCredentialAccessToken().catch((e) => e);

        // Then
        expect(err).toEqual(new Error('Missing required configuration.'));
        done();
    });
});
