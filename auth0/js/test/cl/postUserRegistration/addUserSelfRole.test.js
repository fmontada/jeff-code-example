const mockManagementClient = require('../utils/mockManagementClient');
const addUserSelfRole = require('../../../src/cl/postUserRegistration/addUserSelfRole');

jest.mock('auth0', () => ({
    ManagementClient: mockManagementClient,
}));

describe('Tests for Post User Registration Action: Add User Self Role', () => {
    it('Successfully saves role to user', async () => {
        // Given
        const mockEvent = {
            secrets: {
                clientId: 'mockId',
                clientSecret: 'mockSecret',
                domain: 'mockDomain',
                roleId: 'mockRoleId',
            },
            user: {
                user_id: '123',
            }
        };
        const savedUserRoles = {};
        mockManagementClient.prototype.assignRolestoUser = jest.fn().mockImplementationOnce((params, data) => {
            savedUserRoles[params.id] = data.roles;
        });

        // When
        await addUserSelfRole.onExecutePostUserRegistration(mockEvent);

        // Then
        expect(savedUserRoles[mockEvent.user.user_id][0]).toEqual(mockEvent.secrets.roleId);
    });

    it('Recieve log of user role not being saved properly', async () => {
        // Given
        const mockEvent = {
            secrets: {
                clientId: 'mockId',
                clientSecret: 'mockSecret',
                domain: 'mockDomain',
                roleId: 'mockRoleId',
            },
            user: {
                user_id: '123',
            }
        };
        
        let loggedMessage = '';
        console.log = jest.fn().mockImplementationOnce((...messages) => {
            for (let message of messages) {
                loggedMessage += message;
            }
        });

        mockManagementClient.prototype.assignRolestoUser = jest.fn().mockImplementationOnce(() => {
            throw 'user does not have permissions';
        });

        // When
        await addUserSelfRole.onExecutePostUserRegistration(mockEvent);

        // Then
        expect(loggedMessage).toBe('error adding role to user: user does not have permissions');
    });

    it('Recieve log of event secrets not being set', async () => {
        // Given
        const mockEvent = {
            secrets: {},
            user: {
                user_id: '123',
            }
        };
        
        let loggedMessage = '';
        console.log = jest.fn().mockImplementationOnce((...messages) => {
            for (let message of messages) {
                loggedMessage += message;
            }
        });

        // When
        await addUserSelfRole.onExecutePostUserRegistration(mockEvent);

        // Then
        expect(loggedMessage).toBe('error adding role to user: Error: Missing required secrets.');
    });
});
