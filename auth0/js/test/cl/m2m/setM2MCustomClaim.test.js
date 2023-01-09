const setM2MCustomClaim = require('../../../src/cl/m2m/setM2MCustomClaim');
const mockAccessToken = require('../utils/mockAccessToken');

describe('Tests for M2M Action: Set M2M Custom Claim', () => {
    let mockAPI;
    beforeEach(()=> {
        mockAPI = {
            accessToken: new mockAccessToken(),
        };
    });

    it('Successfully saves custom claims', async () => {
        // Given
        const mockEvent = {
            secrets: {
                audience: 'mockAudience',
            },
            client: {
                client_id: '123',
            }
        };
        const expected = { 
            'mockAudience/email': mockEvent.client.client_id,
        };

        // When
        await setM2MCustomClaim.onExecuteCredentialsExchange(mockEvent, mockAPI);

        // Then
        expect(mockAPI.accessToken.customClaim).toMatchObject(expected);
    });
});
