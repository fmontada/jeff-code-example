const mockActionClient = require('./mockActionsClient');

module.exports = class MockManagementClient {
    constructor(credentials) {
        this.domain = credentials.domain;
        this.clientId = credentials.clientId;
        this.clientSecret = credentials.clientSecret;
        this.userRoles = {};
        this.userMetaData = {};
        this.savedActions = {};
        this.actions = new mockActionClient();
    }

    async assignRolestoUser(params, data) {
        this.userRoles[params.id] = data.roles;
    }

    async updateUserMetadata(params, metadata) {
        this.userMetaData[params.id] = metadata;
    }
};
