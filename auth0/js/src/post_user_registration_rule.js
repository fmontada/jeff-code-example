/* eslint-disable no-unused-vars */
/*
*/
function postUserRegistration(user, context, callback) {
    const axios = require('axios');

    if (
        !configuration.USER_SERVICE_URL
    ) {
        return callback(new Error('Missing required configuration.'));
    }

    const notifyUserService = async (apiAccessToken) => {
        try {
            const omazeApiUrl = configuration.USER_SERVICE_URL + '/user_signed_up';

            let options = {
                headers: {
                    ContentType: 'application/json',
                    Authorization: 'Bearer ' + apiAccessToken
                },
            };

            let acceptsMarketing = (user.user_metadata &&
                user.user_metadata.optIn === 'true');

            let payload = {
                user_id: user.id,
                username: user.username,
                first_name: user.given_name,
                last_name: user.family_name,
                email: user.email,
                email_verified: user.email_verified,
                accepts_marketing: acceptsMarketing
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
            if (!user.app_metadata.signed_up_notification) {
                const { jwt: apiAccessToken } = await global.helpers.obtainClientCredentialAccessToken();

                await notifyUserService(apiAccessToken);

                user.app_metadata.signed_up_notification = true;
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
