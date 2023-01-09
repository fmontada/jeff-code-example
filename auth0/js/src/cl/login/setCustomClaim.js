/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
*/
exports.onExecutePostLogin = async (event, api) => {
    if (!event.secrets.audience) {
        throw new Error('Missing required secrets.');
    }

    if (event.authorization) {
        api.accessToken.setCustomClaim(`${event.secrets.audience}/email`, event.user.email);
        api.accessToken.setCustomClaim(`${event.secrets.audience}/omazeId`, event.user.user_metadata['omazeId']);
    }

};
