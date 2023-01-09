const setCustomClaim = require('../../../src/cl/login/setCustomClaim');
const mockAccessToken = require('../utils/mockAccessToken');

describe('Tests for Post Login Action: Set Custom Claim', () => {
    let mockAPI;
    beforeEach(()=> {
        mockAPI = {
            accessToken: new mockAccessToken(),
        };
    });

    it('Successfully saves custom claims with valid authorization', async () => {
        // Given
        const mockEvent = {
            secrets: {
                audience: 'mockAudience',
            },
            authorization: true,
            user: {
                email: 'hello@world.com',
                user_metadata: {
                    omazeId: '123',
                }
            }
        };
        const expected = { 
            'mockAudience/email': mockEvent.user.email,
            'mockAudience/omazeId': mockEvent.user.user_metadata.omazeId,
        };

        // When
        await setCustomClaim.onExecutePostLogin(mockEvent, mockAPI);

        // Then
        expect(mockAPI.accessToken.customClaim).toMatchObject(expected);
    });

    it('Does not saves custom claims with invalid authorization', async () => {
        // Given
        const mockEvent = {
            secrets: {
                audience: 'mockAudience',
            },
            authorization: false,
            user: {
                email: 'hello@world.com',
                user_metadata: {
                    omazeId: '123',
                }
            }
        };
        const expected = {};

        // When
        await setCustomClaim.onExecutePostLogin(mockEvent, mockAPI);

        // Then
        expect(mockAPI.accessToken.customClaim).toMatchObject(expected);
    });
});
