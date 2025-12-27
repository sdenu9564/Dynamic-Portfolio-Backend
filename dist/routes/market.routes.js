"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const market_controller_1 = require("../controllers/market.controller");
const router = (0, express_1.Router)();
router.get("/cmp", market_controller_1.fetchCMP);
router.post("/cmp/bulk", market_controller_1.fetchBulkCMP);
router.get("/google", market_controller_1.fetchGoogleData);
exports.default = router;
//# sourceMappingURL=market.routes.js.map