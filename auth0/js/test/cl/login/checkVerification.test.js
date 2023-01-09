const checkVerification = require('../../../src/cl/login/checkVerification');
const mockAccess = require('../utils/mockAccess');

describe('Tests for Post Login Action: Check Verification', () => {
    let mockAPI;
    beforeEach(()=> {
        mockAPI = {
            access: new mockAccess(),
        };
    });

    it('Logs message with invalid user with email not verified', async () => {
        // Given
        const mockEvent = {
            user: {
                email_verified: false,
                email: 'hello@world.com',
            },
        };

        // When
        await checkVerification.onExecutePostLogin(mockEvent, mockAPI);

        // Then
        expect(mockAPI.access.reason).toEqual('Please verify your email before logging in. email: ' + mockEvent.user.email);
    });

    it('Does not log any message with valid user', async () => {
        // Given
        const mockEvent = {
            user: {
                email_verified: true,
                email: 'hello@world.com',
            },
        };
        
        // When
        await checkVerification.onExecutePostLogin(mockEvent, mockAPI);

        // Then
        expect(mockAPI.access.reason).toEqual('');
    });
});
