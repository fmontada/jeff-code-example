/* eslint-disable no-unused-vars */
/** 
 * This script will be executed when the user changes their password to test 
 * if the user exists.
*/

function getTokenHelper (user, context, callback) { 
    
    const axios = require('axios');
    // https://community.auth0.com/t/managementclient-is-not-a-constructor/40242
    const ManagementClient = require('auth0@2.27.1').ManagementClient;
    const moment = require('moment-timezone');

    global.helpers = { obtainClientCredentialAccessToken: async () => {
            
        if (
            !configuration.CLIENT_ID ||
                !configuration.CLIENT_SECRET ||
                !configuration.AUTH0_TENANT_URL ||
                !configuration.RULES_CLIENT_ID ||
                !configuration.RULES_CLIENT_SECRET ||
                !configuration.AUTH0_DOMAIN ||
                !configuration.IDENTIFIER
        ) {
            throw new Error('Missing required configuration.');
        }
            
        // get existing cached token info from rules config
        const ruleConfigKey = 'ACCESS_TOKEN';
        let tokenInfo = configuration[ruleConfigKey];
        if (tokenInfo) {
            const token = JSON.parse(tokenInfo);
            if (moment(token.exp).isAfter(moment().utc())){
                console.log('Access token retrieved from config');
                return token;
            }
        }

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
            
        // cache new token info in rules config
        const managementClient = new ManagementClient({
            domain: configuration.AUTH0_DOMAIN,
            clientId: configuration. RULES_CLIENT_ID,
            clientSecret: configuration. RULES_CLIENT_SECRET
        });

        await managementClient.setRulesConfig({ key: ruleConfigKey }, { value: JSON.stringify(token) });
        console.log('New Access token generated and stored in config');
        return token;
    }};

    callback(null, user, context);
}
