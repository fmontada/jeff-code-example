/* eslint-disable no-unused-vars */
/*
*/
function notifyEmailStatus(user, context, callback) {
    const axios = require('axios');

    if (
        !configuration.USER_SERVICE_URL
    ) {
        return callback(new Error('Missing required configuration.'));
    }

    const notifyUserService = async (apiAccessToken) => {
        try {
            const omazeApiUrl = configuration.USER_SERVICE_URL + '/user_verified_email';

            let options = {
                headers: {
                    ContentType: 'application/json',
                    Authorization: 'Bearer ' + apiAccessToken
                },
            };

            let payload = {
                email: user.email,
            };

            const { data } = await axios.post(omazeApiUrl, payload, options);

            return data;

        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const main = async () => {
        try {
            user.app_metadata = user.app_metadata || {};
            if (!user.app_metadata.email_verified_notification_was_sent
                && user.email_verified) {
                const { jwt: apiAccessToken } = await global.helpers.obtainClientCredentialAccessToken();

                await notifyUserService(apiAccessToken);

                user.app_metadata.email_verified_notification_was_sent = true;
                await auth0.users.updateAppMetadata(user.user_id, user.app_metadata);
            }

            callback(null, user, context);
        } catch (err) {
            console.error(err);
            callback(new Error('Failed to notify user service'));
        }
    };
    return main();
}
