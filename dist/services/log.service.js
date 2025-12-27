"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = logErrorService;
const pretty_error_1 = __importDefault(require("pretty-error"));
const http_status_1 = __importDefault(require("http-status"));
const error_service_1 = __importStar(require("./error.service"));
const constants_1 = __importDefault(require("../config/constants"));
const isDev = constants_1.default.NODE_ENV === 'development';
/**
 * Centralized Error Logging & Response Middleware
 * Logs errors in dev mode and returns clean error responses.
 */
function logErrorService(err, req, res, _next) {
    if (!err) {
        const fallbackError = new error_service_1.default('Error with the server!', http_status_1.default.INTERNAL_SERVER_ERROR, true);
        return res
            .status(fallbackError.status)
            .json({ message: fallbackError.message });
    }
    if (isDev) {
        const pe = new pretty_error_1.default();
        pe.skipNodeFiles();
        pe.skipPackage('express');
        console.error(pe.render(err));
    }
    const errorResponse = {
        message: err.message || 'Internal Server Error.',
    };
    if (err.details) {
        const { details } = err;
        errorResponse.errors = {};
        if (Array.isArray(details)) {
            errorResponse.errors = error_service_1.RequiredError.makeValidationsPretty(details);
        }
        else {
            for (const key of Object.keys(details)) {
                errorResponse.errors[key] = details[key];
            }
        }
    }
    return res
        .status(err.status || http_status_1.default.INTERNAL_SERVER_ERROR)
        .json(errorResponse);
}
//# sourceMappingURL=log.service.js.map