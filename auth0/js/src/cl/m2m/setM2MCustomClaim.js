/**
* Handler that will be called during the execution of a Client Credentials exchange.
*
* @param {Event} event - Details about client credentials grant request.
* @param {CredentialsExchangeAPI} api - Interface whose methods can be used to change the behavior of client credentials grant.
*/
exports.onExecuteCredentialsExchange = async (event, api) => {
    if (!event.secrets.audience) {
        throw new Error('Missing required secrets.');
    }
    
    api.accessToken.setCustomClaim(`${event.secrets.audience}/email`, event.client.client_id);
  
};
