/* eslint-disable no-unused-vars */
/** 
 * This script will be executed each time a user attempts to login.
 * The two parameters: email and password, are used to validate the authenticity of the user.
 * Login scripts are mandatory.
*/

function login(email, password, callback) {
    const axios = require('axios');
    const moment = require('moment-timezone');
    const ManagementClient = require('auth0@2.27.1').ManagementClient;

    if (
        !configuration.CLIENT_ID ||
        !configuration.CLIENT_SECRET ||
        !configuration.IDENTIFIER ||
        !configuration.USER_SERVICE_URL ||
        !configuration.AUTH0_TENANT_URL ||
        !configuration.RULES_CLIENT_ID  ||
        !configuration.RULES_CLIENT_SECRET ||
        !configuration.AUTH0_DOMAIN
    ) {
        return callback(new Error('Missing required configuration.'));
    }

    // Returns User Service API Access Token (JWT) from either the global cache or generates it an new from clientId and secret
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

        const { data: { expires_in, access_token } } =
                    await axios
                        .post(auth0ApiUrl, {
                            grant_type: 'client_credentials',
                            client_id: configuration.CLIENT_ID,
                            client_secret: configuration.CLIENT_SECRET,
                            audience: configuration.IDENTIFIER,
                        });

        const exp = moment().utc().add(expires_in - 10, 'seconds');
        const token = { jwt: access_token, exp };
         
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

    const validateUserCredentials = async (apiAccessToken) => {
        try {
            const omazeApiUrl = `$${configuration.USER_SERVICE_URL}/login`;

            let options = {
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer $${apiAccessToken}`
                },
            };

            const { data } = await axios.post(omazeApiUrl, { email, password, }, options);
            return data;
        } catch (err) {
            console.error(`Unable to validate the user's credentials, $${err}`);
            throw err;
        }
    };

    const main = async () => {
        try {
            const { jwt: apiAccessToken } = await getUserServiceApiAccessToken();
            const user = await validateUserCredentials(apiAccessToken);

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

        } catch (err) {
            callback(new WrongUsernameOrPasswordError(email));
        }
    };

    return main();
}
