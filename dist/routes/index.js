"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const http_status_1 = __importDefault(require("http-status"));
const error_service_1 = __importDefault(require("../services/error.service"));
const log_service_1 = __importDefault(require("../services/log.service"));
const portfolio_routes_1 = __importDefault(require("./portfolio.routes"));
const market_routes_1 = __importDefault(require("./market.routes"));
const routes = (0, express_1.Router)();
routes.use('/portfolio', portfolio_routes_1.default);
routes.use('/market', market_routes_1.default);
routes.all('', (req, res, next) => next(new error_service_1.default('Route Not Found!', http_status_1.default.NOT_FOUND, true)));
routes.use(log_service_1.default);
exports.default = routes;
//# sourceMappingURL=index.js.map