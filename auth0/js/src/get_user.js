/* eslint-disable no-unused-vars */
/** 
 * This script will be executed when the user changes their password to test 
 * if the user exists.
*/

function getByEmail(email, callback) {
    const axios = require('axios');
    const moment = require('moment-timezone');

    const ManagementClient = require('auth0@2.27.1').ManagementClient;

    if (
        !configuration.CLIENT_ID ||
        !configuration.CLIENT_SECRET ||
        !configuration.IDENTIFIER ||
        !configuration.USER_SERVICE_URL ||
        !configuration.AUTH0_TENANT_URL ||
        !configuration.RULES_CLIENT_ID ||
        !configuration.RULES_CLIENT_SECRET ||
        !configuration.AUTH0_DOMAIN
    ) {
        return callback(new Error('Missing required configuration.'));
    }

    const getUserServiceApiAccessToken = async () => {
        //check to see if token
        const configKey = 'ACCESS_TOKEN';
        let tokenInfo = configuration[configKey];
        if (tokenInfo) {
            const token = JSON.parse(tokenInfo);
            if (moment(token.exp).isAfter(moment().utc())){
                console.log('Access token retrieved from config');
                return token;
            }
        }

        // create new token
        const auth0ApiUrl = configuration.AUTH0_TENANT_URL + '/oauth/token';
        let token = {};
        try {
            const { data: { expires_in, access_token } } =
                    await axios
                        .post(auth0ApiUrl, {
                            grant_type: 'client_credentials',
                            client_id: configuration.CLIENT_ID,
                            client_secret: configuration.CLIENT_SECRET,
                            audience: configuration.IDENTIFIER,
                        });

            const exp = moment().utc().add(expires_in - 10, 'seconds');
            token = { jwt: access_token, exp };
        } catch (error) {
            console.error('Unable to retrieve API Access token. Please check that your credentials (CLIENT_ID and CLIENT_SECRET) are correct.');
            throw error;
        }
        
        const managementClient = new ManagementClient({
            domain: configuration.AUTH0_DOMAIN,
            clientId: configuration.RULES_CLIENT_ID,
            clientSecret: configuration.RULES_CLIENT_SECRET
        });

        // get full connection
        const connections = await managementClient.getConnections({});
        
        const connection = connections.find((n) => n.name === 'Omaze-Users');

        if(!connection){
            throw new Error('No connection found');
        }


        // update connection with new access token
        const { name, strategy, id, ...patchable } = connection;
        await managementClient.updateConnection({ id }, { 
            ...patchable,
            options: {
                ...patchable.options,
                configuration: {
                    ...patchable.options.configuration,
                    ACCESS_TOKEN: JSON.stringify(token)
                }
            }
        });

        return token;
    };

    const getUser = async (apiAccessToken) => {
        try {
            const omazeApiUrl = configuration.USER_SERVICE_URL + '/get_user';
            let options = {
                headers: {
                    ContentType: 'application/json',
                    Authorization: 'Bearer ' + apiAccessToken
                },
                params: {
                    email,
                }
            };

            const { data } = await axios.get(omazeApiUrl, options);

            return data;
        } catch (err) {
            console.error(err);

            if (err.response &&
                err.response.data &&
                err.response.data.message === 'no user found with email') {
                return null;
            }
            throw err;
        }
    };

    const main = async () => {
        try {
            const { jwt: apiAccessToken } = await getUserServiceApiAccessToken();
            const user = await getUser(apiAccessToken);

            // user will be null if not found for sign up check
            if(!user){
                callback(null, user);
            }
            else {
                callback(null, 
                    { 
                        user_id: user.user_id,
                        given_name: user.given_name,
                        family_name: user.family_name,
                        email: user.email,
                        email_verified: user.email_verified,
                        app_metadata: {
                            lazy_migration: true
                        }
                    }
                );
            }
        }
        catch (err) {
            console.error(err);
            callback(new Error('there was a problem getting user'));
        }
    };

    return main();
}
