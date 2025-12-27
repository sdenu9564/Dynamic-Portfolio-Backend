"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const constants_1 = __importDefault(require("./config/constants"));
const app_1 = __importDefault(require("./app"));
const httpServer = (0, http_1.createServer)(app_1.default);
httpServer.listen(constants_1.default.PORT, () => {
    console.log(`API server listening on port: ${constants_1.default.PORT}`);
});
httpServer.on('error', async (err) => {
    console.error('Cannot run server:', err);
});
//# sourceMappingURL=index.js.map