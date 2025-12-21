"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiredError = exports.APIError = exports.ExtendableError = void 0;
const http_status_1 = __importDefault(require("http-status"));
/**
 * Base class extending Error to add status and visibility control.
 */
class ExtendableError extends Error {
    status;
    isPublic;
    isOperational;
    constructor(message, status, isPublic) {
        super(message);
        this.name = new.target.name;
        this.status = status;
        this.isPublic = isPublic;
        this.isOperational = true;
        Error.captureStackTrace(this, new.target);
    }
}
exports.ExtendableError = ExtendableError;
/**
 * Class representing an API error.
 */
class APIError extends ExtendableError {
    constructor(message, status = http_status_1.default.INTERNAL_SERVER_ERROR, isPublic = false) {
        super(message, status, isPublic);
    }
}
exports.APIError = APIError;
/**
 * Class for formatting required/validation errors.
 */
class RequiredError {
    /**
     * Transform Joi-like error arrays into a readable key-value object.
     */
    static makePretty(errors) {
        return errors.reduce((obj, error) => {
            return {
                ...obj,
                [error.field]: error.messages[0].replace(/"/g, ''),
            };
        }, {});
    }
    /**
     * Merge multiple validation error objects into one.
     */
    static makeValidationsPretty(errors) {
        return errors.reduce((obj, error) => ({ ...obj, ...error }), {});
    }
}
exports.RequiredError = RequiredError;
exports.default = APIError;
//# sourceMappingURL=error.service.js.map