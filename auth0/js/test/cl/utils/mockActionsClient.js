module.exports = class MockActionClient {
    constructor() {
        this.savedActions = {};
    }
    async update (params, data) {
        this.savedActions[params.id] = data;
    }
    async deploy (params) {
        this.savedActions[params.id].deployed = true;
    }
    async get(params) {
        return {actions: [{name: params.name, id: 'mockActionId'}]};
    }
};
