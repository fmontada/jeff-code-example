const auth0 = require('auth0');
const axios = require('axios');

/**
* Handler that will be called during the execution of a PostUserRegistration flow.
*
* @param {Event} event - Details about the context and user that has registered.
*/
exports.onExecutePostUserRegistration = async (event) => {
    if (
        !event.secrets.clientId ||
        !event.secrets.clientSecret ||
        !event.secrets.domain ||
        !event.secrets.audience ||
        !event.secrets.userApiEndpoint
    ) {
        throw new Error('Missing required secrets.');
    }


    try {
        //get a new token or use one from cache
        const token = await getToken(event);
        // add a user in our system of record
        const userId = await addUser(event, token);
        //update user metadata
        await updateAuth0User(event, userId);
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log('error adding user to omaze cl-user-api: ', err);
    }
};

const getToken = async (event) => {

    if (event.secrets.cachedToken != '' && event.secrets.tokenExpiration != '' && new Date() <= new Date(event.secrets.tokenExpiration)) {
        return event.secrets.cachedToken;
    }

    // get a new auth token for our endpoint
    const authPayload = {
        client_id: event.secrets.clientId,
        client_secret: event.secrets.clientSecret,
        audience: event.secrets.audience,
        grant_type: 'client_credentials',
    };

    const { data: { expires_in, access_token } } = await axios.post(`https://${event.secrets.issuer}/oauth/token`, authPayload);

    const expiresInMilis = (expires_in - 10) * 1000; // add a 10 second buffer here so we don't break when the token's already expired
    const tokenExpiration = new Date(new Date().getTime() + expiresInMilis).toISOString();
    // cache that token for usage in the future
    cacheToken(event, tokenExpiration, access_token);

    return access_token;

};


const cacheToken = async (event, expiration, token) => {


    const { ManagementClient } = auth0;

    const management = new ManagementClient({
        domain: event.secrets.domain,
        clientId: event.secrets.clientId,
        clientSecret: event.secrets.clientSecret,
    });

    // if we don't have an action id set (terraform was just run etc), get it now
    if (event.secrets.actionId == '') {
        const { actions } = await management.actions.get({ actionName: 'Create Omaze User' });
        if (actions.length === 0) {
            throw new Error('action not found');
        }
        event.secrets.actionId = actions[0].id;
    }

    //update token and expiry in secrets obj
    event.secrets.cachedToken = token;
    event.secrets.tokenExpiration = expiration;

    const secrets = Object.keys(event.secrets).map((k) => {
        return {
            name: k,
            value: event.secrets[k]
        };
    });

    const params = { id: event.secrets.actionId };
    const data = { secrets };
    await management.actions.update(params, data, function (err) {
        if (err) {
            // eslint-disable-next-line no-console
            console.log('error updating action: ', err);
        }
    });
    await management.actions.deploy(params, data, function (err) {
        if (err) {
            // eslint-disable-next-line no-console
            console.log('error deploying action: ', err);
        }
    });

};

const addUser = async (event, token) => {
    // add this new user to our system of record
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };

    const payload = {
        email: event.user.email,
        source_id: event.user.user_id,
        source_name: 'AUTH0'
    };

    if (event.user.given_name === '' || event.user.given_name) {
        payload.first_name = event.user.given_name;
    }
    if (event.user.family_name === '' || event.user.family_name) {
        payload.last_name = event.user.family_name;
    }

    const { data: { id: userId } } = await axios.post(event.secrets.userApiEndpoint, payload, config);

    return userId;
};


const updateAuth0User = async (event, userId) => {
    const { ManagementClient } = auth0;

    const management = new ManagementClient({
        domain: event.secrets.domain,
        clientId: event.secrets.clientId,
        clientSecret: event.secrets.clientSecret,
    });

    const params = { id: event.user.user_id };
    const metadata = {
        omazeId: userId,
    };
    await management.updateUserMetadata(params, metadata);
};
