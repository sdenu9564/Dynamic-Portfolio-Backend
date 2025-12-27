"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const constants_1 = __importDefault(require("./constants"));
const logFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), // Adds color to console output
winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
}));
const logger = winston_1.default.createLogger({
    level: constants_1.default.NODE_ENV === 'production' ? 'info' : 'debug',
    format: logFormat,
    transports: [
        new winston_1.default.transports.Console({
            handleExceptions: true,
        }),
    ],
    exitOnError: false,
});
exports.default = logger;
//# sourceMappingURL=winston.js.map