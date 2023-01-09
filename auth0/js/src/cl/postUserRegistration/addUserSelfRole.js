/**
* Handler that will be called during the execution of a PostUserRegistration flow.
*
* @param {Event} event - Details about the context and user that has registered.
*/
const auth0 = require('auth0');
// add basic user role for read/update self

const addRole = async (event) => {
    if (
        !event.secrets.clientId ||
        !event.secrets.clientSecret ||
        !event.secrets.domain || 
        !event.secrets.roleId 
    ) {
        throw new Error('Missing required secrets.');
    }
    const {ManagementClient} = auth0;

    const management = new ManagementClient({
        domain: event.secrets.domain,
        clientId: event.secrets.clientId,
        clientSecret: event.secrets.clientSecret,
    });

    const params = { id: event.user.user_id };
    const data = { roles: [event.secrets.roleId] };

    await management.assignRolestoUser(params, data);
};

exports.onExecutePostUserRegistration = async (event) => {
    try {
    // assign a default role for this new user
        await addRole(event);
    } catch (err) {
    // eslint-disable-next-line no-console
        console.log('error adding role to user: ', err);
    }

};
