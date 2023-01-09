/* eslint-disable no-unused-vars */
/*
*/
function multipass(user, context, callback) {
    const axios = require('axios');

    if (
        !configuration.IDENTIFIER ||
        !configuration.USER_SERVICE_URL ||
        !configuration.MULTIPASS_TOKEN_NAMESPACE
    ) {
        return callback(new Error('Missing required configuration.'));
    }

    const getMultipassToken = async (apiAccessToken) => {

        try {
            const omazeApiUrl = configuration.USER_SERVICE_URL + '/generate_multipass';

            let options = {
                headers: {
                    ContentType: 'application/json',
                    Authorization: 'Bearer ' + apiAccessToken
                },
            };

            let payload = {
                email: user.email,
                first_name: user.given_name,
                last_name: user.family_name
            };

            if (context.request &&
                context.request.query &&
                context.request.query.return_to) {
                payload.return_to = context.request.query.return_to;
            }

            const { data } = await axios.post(omazeApiUrl, payload, options);

            return data;

        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const main = async () => {
        try {
            const { jwt: apiAccessToken } = await global.helpers.obtainClientCredentialAccessToken();
            const { multipass_token: token } = await getMultipassToken(apiAccessToken);
            context.idToken[configuration.MULTIPASS_TOKEN_NAMESPACE + '/multipass'] = token;
            callback(null, user, context);
        } catch (err) {
            console.error(err);
            callback(new Error('Failed to get a multipass token'));
        }
    };
    return main();
}
