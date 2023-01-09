const mockSailthruClient = require('../utils/mockSailthruClient');
const sailthruUserOptIn = require('../../../src/cl/postUserRegistration/salithruUserOptIn');

jest.mock('sailthru-client', () => mockSailthruClient);

describe('Tests for Post User Registration Action: Add User to Sailthru', () => {
    afterEach(jest.clearAllMocks);

    it('Successfully saves user to Sailthru account, when the box is checked', async () => {
        // Given
        const mockEvent = {
            secrets: {
                sailthruApiKey: 'mockApiKey',
                sailthruApiSecret: 'mockApiSecret'
            },
            user: {
                email: 'mockEmail',
                user_metadata: {
                    optIn: 'true',
                },
            }
        };
        const savedSailthruValues = {};
        jest.spyOn(global.console, 'log');

        mockSailthruClient.createSailthruClient = jest.fn().mockImplementationOnce((apiKey, apiSecret) => {
            savedSailthruValues.apiKey = apiKey;
            savedSailthruValues.apiSecret = apiSecret;
            const mockSailthruClient = {
                saveUserByKey: function (id, key, data, callback) {
                    savedSailthruValues.id = id;
                    savedSailthruValues.key = key;
                    savedSailthruValues.data = data;
                    callback(null, 'mockResponse');
                },
            };
            return mockSailthruClient;
        });

        // When
        await sailthruUserOptIn.onExecutePostUserRegistration(mockEvent);

        // Then
        expect(savedSailthruValues.apiKey).toEqual(mockEvent.secrets.sailthruApiKey);
        expect(savedSailthruValues.apiSecret).toEqual(mockEvent.secrets.sailthruApiSecret);
        expect(savedSailthruValues.id).toEqual(mockEvent.user.email);
        expect(savedSailthruValues.key).toEqual('email');
        expect(savedSailthruValues.data).toEqual({
            lists: { 'Master List': 1 },
        });
        expect(console.log).toHaveBeenCalledTimes(1);
        expect(mockSailthruClient.createSailthruClient).toHaveBeenCalledTimes(1);
    });
    it('Does not save user to Sailthru account, when the box is unchecked', async () => {
        // Given
        const mockEvent = {
            secrets: {
                sailthruApiKey: 'mockApiKey',
                sailthruApiSecret: 'mockApiSecret'
            },
            user: {
                email: 'mockEmail',
                user_metadata: {
                    optIn: 'false',
                },
            }
        };
        const savedSailthruValues = {};
        jest.spyOn(global.console, 'log');

        mockSailthruClient.createSailthruClient = jest.fn().mockImplementationOnce((apiKey, apiSecret) => {
            savedSailthruValues.apiKey = apiKey;
            savedSailthruValues.apiSecret = apiSecret;
            const mockSailthruClient = {
                saveUserByKey: function (id, key, data, callback) {
                    savedSailthruValues.id = id;
                    callback(null, 'mockResponse');
                },
            };
            return mockSailthruClient;
        });

        // When
        await sailthruUserOptIn.onExecutePostUserRegistration(mockEvent);

        // Then
        expect(savedSailthruValues.apiKey).toEqual(mockEvent.secrets.sailthruApiKey);
        expect(savedSailthruValues.apiSecret).toEqual(mockEvent.secrets.sailthruApiSecret);
        expect(savedSailthruValues.id).not.toEqual(mockEvent.user.email);
        expect(console.log).toHaveBeenCalledTimes(0);
        expect(mockSailthruClient.createSailthruClient).toHaveBeenCalledTimes(1);
    });
});
