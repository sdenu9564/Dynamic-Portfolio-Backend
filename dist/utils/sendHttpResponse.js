"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendHttpResponse = void 0;
const sendHttpResponse = (res, message, data = {}, statusCode = 200, success = true) => {
    return res.status(statusCode).json({
        success,
        message,
        data,
    });
};
exports.sendHttpResponse = sendHttpResponse;
//# sourceMappingURL=sendHttpResponse.js.map