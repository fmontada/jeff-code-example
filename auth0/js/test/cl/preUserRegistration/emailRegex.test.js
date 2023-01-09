const emailRegex = require('../../../src/cl/preUserRegistration/emailRegex');
const mockAccess = require('../utils/mockAccess');

describe('Tests for Pre User Registration: Email Regex', () => {
    let mockAPI;
    beforeEach(()=> {
        mockAPI = {
            access: new mockAccess(),
        };
    });

    it('Logs message with invalid user with invalid email format', async () => {
        // Given
        const mockEvent = {
            user: {
                email: 'hello+world@world.com',
            },
        };

        // When
        await emailRegex.onExecutePreUserRegistration(mockEvent, mockAPI);

        // Then
        expect(mockAPI.access.reason).toEqual(mockEvent.user.email + 'not a valid email format');
        expect(mockAPI.access.userMessage).toEqual('not a valid email format');
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
        await emailRegex.onExecutePreUserRegistration(mockEvent, mockAPI);

        // Then
        expect(mockAPI.access.reason).toEqual('');
        expect(mockAPI.access.userMessage).toEqual('');
    });
});
