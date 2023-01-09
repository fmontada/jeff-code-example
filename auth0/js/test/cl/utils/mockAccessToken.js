module.exports = class mockAccessToken {
    constructor() {
        this.customClaim = {};
    }

    async setCustomClaim(key, value) {
        this.customClaim[key] = value;
    }
};
