const sailthru = require('sailthru-client');

/**
* Handler that will be called during the execution of a PostUserRegistration flow.
*
* @param {Event} event - Details about the context and user that has registered.
*/
exports.onExecutePostUserRegistration = async (event) => {

    const apiKey = event.secrets.sailthruApiKey;
    const apiSecret = event.secrets.sailthruApiSecret;

    if (
        !apiKey || !apiSecret
    ) {
        throw new Error('Missing required secrets.');
    }

    const sailthruClient = sailthru.createSailthruClient(apiKey, apiSecret);

    let acceptsMarketing = (event.user.user_metadata &&
        event.user.user_metadata.optIn === 'true');

    let data = {
        lists: { 'Master List': 1 },
    };

    if (acceptsMarketing) {
        sailthruClient.saveUserByKey(event.user.email, 'email', data, function (err, response) {
            if (err) {
                throw new Error(err);
            }

            console.log(response);
        });
    }
};
