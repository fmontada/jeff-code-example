/* eslint-disable no-unused-vars */
'use strict';

const loadRule = require('../utils/load-rule');
const ContextBuilder = require('../utils/contextBuilder');
const UserBuilder = require('../utils/userBuilder');

const ruleName = 'email_verified_rule';

describe(ruleName, () => {
    let rule;
    let globals;
    let context;

    beforeEach(()=> {

        globals = {
            UnauthorizedError: function () {},
        };
    
        context = new ContextBuilder().build();
    });

    it('successfully allows for login to continue when lazy migrated', async (done) => {
        // Given
        rule = loadRule(ruleName, globals);

        const user = new UserBuilder()
            .withAppMetadata({ lazy_migration: true })
            .withEmailVerified(false)
            .build();

        // When
        rule(user, context, (err, u, c) => {
            expect(err).toBeNull();
            expect(u.email_verified).toEqual(false);
            done();
        });
    });

    it('successfully allows for login to continue when email verified', async (done) => {
        // Given
        rule = loadRule(ruleName, globals);

        const user = new UserBuilder()
            .withEmailVerified(true)
            .build();

        // When
        rule(user, context, (err, u, c) => {
            expect(err).toBeNull();
            expect(u.app_metadata).toEqual({});
            done();
        });
    });

    it('errors when user is not lazy migrated and email is not verified', async (done) => {
        // Given
        const user = new UserBuilder()
            .withEmailVerified(false)
            .build();

        rule = loadRule(ruleName, globals);

        // When
        rule(user, context, (err, u, c) => {
            expect(err).toBeInstanceOf(globals.UnauthorizedError);
            expect(user.app_metadata).toEqual({});
            expect(user.email_verified).toEqual(false);
            done();
        });
    });
    
    it('errors for unauthorized if app_metadata is undefined', async (done) => {
        const user = new UserBuilder()
            .withEmailVerified(false)
            .build();

        user.app_metadata = undefined;

        rule = loadRule(ruleName, globals);

        // When
        rule(user, context, (err, u, c) => {
            expect(err).toBeInstanceOf(globals.UnauthorizedError);
            done();
        });
    });
});
