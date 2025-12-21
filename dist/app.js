"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("./config/middleware"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
(0, middleware_1.default)(app);
app.use('/api', routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map