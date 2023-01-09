const axios = require('axios');

const mockManagementClient = require('../utils/mockManagementClient');
const mockActionsClient = require('../utils/mockActionsClient');

const createUser = require('../../../src/cl/postUserRegistration/createUser');

jest.mock('auth0', () => ({
    ManagementClient: mockManagementClient,
    ActionsManager: mockActionsClient
}));

const mockedDate = new Date(2022, 6, 22);
const MockAdapter = require('axios-mock-adapter');
const mockAxios = new MockAdapter(axios);

describe('Tests for Post User Registration Action: Create User', () => {
    const mockEvent = {
        secrets: {
            clientId: 'mockId',
            clientSecret: 'mockSecret',
            domain: 'mockDomain',
            issuer: 'mockIssuer',
            audience: 'mockAudience',
            userApiEndpoint: 'mockEndpoint',
            cachedToken: 'mockCachedToken',
            tokenExpiration: new Date(new Date().getTime() + 86400000).toISOString(),
            actionId: 'mockActionId'
        },
        user: {
            user_id: '123',
        }
    };

    afterEach(() => {
        mockAxios.reset();
    });

    it('Successfully saves user to cl-user-api with cached token', async () => {
        // Given
        mockAxios.onPost('mockEndpoint').reply(() => {
            return [200, { id: '123' }];
        });

        const savedUserMetadata = {};
        mockManagementClient.prototype.updateUserMetadata = jest.fn().mockImplementationOnce((params, metadata) => {
            savedUserMetadata[params.id] = metadata;
        });

        // When
        await createUser.onExecutePostUserRegistration(mockEvent);

        // Then
        expect(savedUserMetadata[mockEvent.user.user_id]).toMatchObject({'omazeId': mockEvent.user.user_id});
    });

    
    it('Successfully saves user to cl-user-api without cached token', async () => {
        // Given
        jest.spyOn(global, 'Date').mockImplementation(() => {
            return mockedDate;
        });
        const newToken = 'newMockToken';
        const mockId = '234';

        const mockEventWithoutToken = {
            secrets: { clientId: 'mockId',
                clientSecret: 'mockSecret',
                domain: 'mockDomain',
                issuer: 'mockIssuer',
                audience: 'mockAudience',
                userApiEndpoint: 'mockEndpoint',
                actionId: 'mockActionId',
                cachedToken: '',
                tokenExpiration: '',
            },
            user: {
                user_id: mockId,
            }
        };


        // mock call to get token
        mockAxios.onPost('https://mockIssuer/oauth/token').reply(() => {
            return [200, {
                access_token: newToken,
                expires_in: 86400 //expires in seconds
            }];
        });

        //mock call to get user
        mockAxios.onPost('mockEndpoint').reply(() => {
            return [200, {
                id: mockId
            }];
        });

        const savedUserMetadata = {};
        const actions = {};
        mockManagementClient.prototype.updateUserMetadata = jest.fn().mockImplementationOnce((params, metadata) => {
            savedUserMetadata[params.id] = metadata;
        });
        mockActionsClient.prototype.update = jest.fn().mockImplementationOnce((params, metadata) => {
            actions[params.id] = metadata;
        });
        mockActionsClient.prototype.deploy = jest.fn().mockImplementationOnce((params) => {
            actions[params.id].deployed = true;
        });

        const expectedSecrets = Object.keys(mockEventWithoutToken.secrets).map((k) => {
            let value = mockEventWithoutToken.secrets[k];
            
            if (k === 'cachedToken') {
                value = newToken;
            } else if (k === 'tokenExpiration') {
                value = mockedDate.toISOString();
            }
            return {
                name: k,
                value,
            };
        });

        // When
        await createUser.onExecutePostUserRegistration(mockEventWithoutToken);

        // Then
        expect(savedUserMetadata[mockEventWithoutToken.user.user_id]).toMatchObject({'omazeId': mockId});
        // expect(actions[mockEventWithoutToken.secrets.actionId].secrets.length).toEqual(expectedSecrets.length);
        expect(actions[mockEventWithoutToken.secrets.actionId].secrets).toEqual(expectedSecrets);
        expect(actions[mockEventWithoutToken.secrets.actionId].deployed).toEqual(true);

    });

    it('Successfully saves user to cl-user-api with no token and no action id', async () => {
        // Given
        const mockId = '345';
        const newToken = 'anotherNewMockToken';

        const noActionIdOrToken = {
            secrets: {
                clientId: 'mockId',
                clientSecret: 'mockSecret',
                domain: 'mockDomain',
                issuer: 'mockIssuer',
                audience: 'mockAudience',
                userApiEndpoint: 'mockEndpoint',
                actionId: '',
                cachedToken: '',
                tokenExpiration: '',
            },
            user: {
                user_id: mockId,
            }
        };

        // mock call to get token
        mockAxios.onPost('https://mockIssuer/oauth/token').reply(() => {
            return [200, {
                access_token: newToken,
                expires_in: 86400 //expires in seconds
            }];
        });

        //mock call to get user
        mockAxios.onPost('mockEndpoint').reply(() => {
            return [200, {
                id: mockId
            }];
        });

        const savedUserMetadata = {};
        const actions = {};
        mockManagementClient.prototype.updateUserMetadata = jest.fn().mockImplementationOnce((params, metadata) => {
            savedUserMetadata[params.id] = metadata;
        });
        mockActionsClient.prototype.update = jest.fn().mockImplementationOnce((params, metadata) => {
            actions[params.id] = metadata;
        });
        mockActionsClient.prototype.get = jest.fn().mockImplementationOnce((params) => {
            return {actions: [{name: params.name, id: 'mockActionId'}]};
        });


        // When
        await createUser.onExecutePostUserRegistration(noActionIdOrToken);

        // Then
        expect(savedUserMetadata[noActionIdOrToken.user.user_id]).toMatchObject({'omazeId': noActionIdOrToken.user.user_id});
        expect(actions[noActionIdOrToken.secrets.actionId].secrets.length).toEqual(9);

    });

    it('Logs error from Auth0', async () => {
        // Given
        const mockEventWithoutToken = {
            secrets: { clientId: 'mockId',
                clientSecret: 'mockSecret',
                domain: 'mockDomain',
                issuer: 'mockIssuer',
                audience: 'mockAudience',
                userApiEndpoint: 'mockEndpoint',
                actionId: 'mockActionId',
                cachedToken: '',
                tokenExpiration: '',
            },
            user: {
                user_id: '123',
            }
        };

        const expectedError = 'auth0: api does not have permissions to generate token';
        mockAxios.onPost('https://mockIssuer/oauth/token').reply(() => Promise.reject(expectedError));

        let loggedMessage = '';
        console.log = jest.fn().mockImplementationOnce((...messages) => {
            for (let message of messages) {
                loggedMessage += message;
            }
        });

        // When
        await createUser.onExecutePostUserRegistration(mockEventWithoutToken);

        // Then
        expect(loggedMessage).toBe('error adding user to omaze cl-user-api: ' + expectedError);
    });

    it('Logs error from cl-user-api', async () => {
        // Given
        const expectedError = 'cl-user-api: user does not have permissions to create user';
        mockAxios.onPost('mockEndpoint').reply(() => Promise.reject(expectedError));

        let loggedMessage = '';
        console.log = jest.fn().mockImplementationOnce((...messages) => {
            for (let message of messages) {
                loggedMessage += message;
            }
        });

        // When
        await createUser.onExecutePostUserRegistration(mockEvent);

        // Then
        expect(loggedMessage).toBe('error adding user to omaze cl-user-api: ' + expectedError);
    });

    it('Logs error from management client', async () => {
        // Given
        mockAxios.onPost('https://mockIssuer/oauth/token').reply(() => {
            return [200, {
                access_token: 'mockToken',
                expires_in: 86400 //expires in seconds
            }];
        });
        mockAxios.onPost('mockEndpoint').reply(() => {
            return [200, {
                id: '123'
            }];
        });

        const expectedError = 'ManagementClient = client does not have permissions to save user meta data';
        mockManagementClient.prototype.updateUserMetadata = jest.fn().mockImplementationOnce(() => {
            throw expectedError;
        });

        let loggedMessage = '';
        console.log = jest.fn().mockImplementationOnce((...messages) => {
            for (let message of messages) {
                loggedMessage += message;
            }
        });

        // When
        await createUser.onExecutePostUserRegistration(mockEvent);

        // Then
        expect(loggedMessage).toBe('error adding user to omaze cl-user-api: ' + expectedError);
    });
});
