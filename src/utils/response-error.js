class ResponseError extends Error {

    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = 'ResponseError';
    }
}

module.exports = ResponseError