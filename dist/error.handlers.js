"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = void 0;
var ErrorResponse = /** @class */ (function () {
    function ErrorResponse(error, res) {
        this.response = res;
        this.error = error;
        if (error.isExeptionError) {
            this.killServer();
        }
        else {
            this.endResponse();
        }
    }
    ErrorResponse.prototype.endResponse = function () {
        if (!this.response.writableEnded) {
            this.response.status(400).json(this.error);
            this.response.end();
        }
    };
    ErrorResponse.prototype.killServer = function () {
        console.log(("\n            [ERROR] Message : " + this.error.message + "\n                    Reason  : " + this.error.reason + "\n                    Error   : " + JSON.stringify(this.error) + "\n        ").red);
        process.exit();
    };
    return ErrorResponse;
}());
exports.ErrorResponse = ErrorResponse;
