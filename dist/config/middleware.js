"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticUploads = void 0;
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const constants_1 = __importDefault(require("./constants"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const winston_1 = __importDefault(require("./winston"));
const express_winston_1 = __importDefault(require("express-winston"));
const method_override_1 = __importDefault(require("method-override"));
const allowedDomains = [
    constants_1.default.ALLOWED_DOMAIN
].filter(Boolean);
exports.staticUploads = [
    // Allow frontend access to uploads
    (0, cors_1.default)({ origin: constants_1.default.ALLOWED_DOMAIN, credentials: true }),
    // Add security headers once
    (req, res, next) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        next();
    },
];
exports.default = (app) => {
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: '50mb' }));
    app.use(express_1.default.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        credentials: true,
        exposedHeaders: ['Authorization'],
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (!allowedDomains.includes(origin)) {
                const msg = `This site ${origin} does not have access. Only specific domains are allowed.`;
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        }
    }));
    app.use((0, cookie_parser_1.default)());
    app.use((0, method_override_1.default)());
    if (constants_1.default.isDev) {
        app.use((0, morgan_1.default)('dev'));
        express_winston_1.default.requestWhitelist.push('body');
        express_winston_1.default.responseWhitelist.push('body');
        app.use(express_winston_1.default.logger({
            winstonInstance: winston_1.default,
            meta: true,
            msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
        }));
    }
};
//# sourceMappingURL=middleware.js.map