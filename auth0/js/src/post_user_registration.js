/**
@param {object} user - The user being created
@param {string} user.id - user id
@param {string} user.tenant - Auth0 tenant name
@param {string} user.username - user name
@param {string} user.email - email
@param {boolean} user.emailVerified - is e-mail verified?
@param {string} user.phoneNumber - phone number
@param {boolean} user.phoneNumberVerified - is phone number verified?
@param {object} user.user_metadata - user metadata
@param {object} user.app_metadata - application metadata
@param {object} context - Auth0 connection and other context info
@param {string} context.requestLanguage - language of the client agent
@param {object} context.connection - information about the Auth0 connection
@param {object} context.connection.id - connection id
@param {object} context.connection.name - connection name
@param {object} context.connection.tenant - connection tenant
@param {object} context.webtask - webtask context
@param {function} cb - function (error, response) */

module.exports = function (user, context, callback) {
    const axios = require('axios');
    const moment = require('moment-timezone');

    const configuration = {
        CLIENT_ID: '${CLIENT_ID}',
        CLIENT_SECRET: '${CLIENT_SECRET}',
        IDENTIFIER: '${IDENTIFIER}',
        USER_SERVICE_URL: '${USER_SERVICE_URL}',
        AUTH0_TENANT_URL: '${AUTH0_TENANT_URL}'
    };

    if (
        !configuration.CLIENT_ID ||
        !configuration.CLIENT_SECRET ||
        !configuration.IDENTIFIER ||
        !configuration.USER_SERVICE_URL ||
        !configuration.AUTH0_TENANT_URL
    ) {
        return callback(new Error('Missing required configuration.'));
    }

    // Returns User Service API Access Token (JWT) from either the global cache or generates it an new from clientId and secret
    const getUserServiceApiAccessToken = async () => {
        const userServiceApiTokenNotValid = !global.userServiceApiToken ||
            moment(global.userServiceApiToken.exp).isBefore(moment().utc());

        if (userServiceApiTokenNotValid) {
            const auth0ApiUrl = configuration.AUTH0_TENANT_URL + '/oauth/token';

            try {
                // Exchange Credentials for Consentric Api Access token
                const { data: { expires_in, access_token } } =
                    await axios
                        .post(auth0ApiUrl, {
                            grant_type: 'client_credentials',
                            client_id: configuration.CLIENT_ID,
                            client_secret: configuration.CLIENT_SECRET,
                            audience: configuration.IDENTIFIER,
                        });


                const exp = moment().utc().add(expires_in - 10, 'seconds');
                const auth = { jwt: access_token, exp };

                // Persist API Access token in global properties
                global.userServiceApiToken = auth;

            } catch (error) {
                console.error('Unable to retrieve API Access token. Please check that your credentials (CLIENT_ID and CLIENT_SECRET) are correct.');
                console.error(error);
                throw error;
            }
        }

        return global.userServiceApiToken;
    };

    const notifyUserService = async (apiAccessToken) => {
        try {
            const omazeApiUrl = configuration.USER_SERVICE_URL + '/user_signed_up';

            let options = {
                headers: {
                    ContentType: 'application/json',
                    Authorization: 'Bearer ' + apiAccessToken
                },
            };

            // TODO: capture consent for marketing on signup
            let acceptsMarketing = false;

            let payload = {
                user_id: user.id,
                username: user.username,
                first_name: user.given_name,
                last_name: user.family_name,
                email: user.email,
                email_verified: user.emailVerified,
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
            const { jwt: apiAccessToken } = await getUserServiceApiAccessToken();
            await notifyUserService(apiAccessToken);
            callback(null, user, context);
        } catch (err) {
            console.error(err);
            callback(new Error('Failed to notify User Service of user registration'));
        }
    };

    return main();
};
