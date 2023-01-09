/* eslint-disable no-unused-vars */
/** 
  To ensure either lazy migrated and if not, email has been verified
*/
function emailVerified(user, context, callback) {
    const metadata = user.app_metadata || {};
    if (!metadata.lazy_migration && !user.email_verified) {
        return callback(
            new UnauthorizedError('Please verify your email before logging in. email: ' + user.email),
        );
    } else {
        return callback(null, user, context);
    }
}
