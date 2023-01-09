/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
    if (!event.secrets.namespace) {
        throw new Error('Missing required secrets.');
    }

    event.user.app_metadata = event.user.app_metadata || {};
    const claimName = `${event.secrets.namespace}/first_time_login_check`;

    if (!event.user.app_metadata.first_time_login_check && event.user.email_verified) {
        api.idToken.setCustomClaim(claimName, true);
        await api.user.setAppMetadata('first_time_login_check', true);
        return;
    }

    api.idToken.setCustomClaim(claimName, false);
};
