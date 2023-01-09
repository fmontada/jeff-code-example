/**
 * Handler that will be called during the execution of a PreUserRegistration flow.
 *
 * @param {Event} event - Details about the context and user that is attempting to register.
 * @param {PreUserRegistrationAPI} api - Interface whose methods can be used to change the behavior of the signup.
 */
exports.onExecutePreUserRegistration = async (event, api) => {
    if(!event.user.email || event.user.email.includes('+')) {

        const err = 'not a valid email format';
        api.access.deny(event.user.email + err, err);

    }
};
