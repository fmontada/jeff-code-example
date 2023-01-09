module.exports = class mockAccess {
    constructor() {
        this.reason = '';
        this.userMessage = '';
    }

    async deny(reason, message) {
        this.reason = reason;
        this.userMessage = message;
    }
};
