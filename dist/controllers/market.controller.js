"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGoogleData = exports.fetchBulkCMP = exports.fetchCMP = void 0;
const yahoo_service_1 = require("../services/yahoo.service");
const google_service_1 = require("../services/google.service");
const sendHttpResponse_1 = require("../utils/sendHttpResponse");
const fetchCMP = async (req, res) => {
    try {
        const symbol = typeof req.query.symbol === "string" ? req.query.symbol : "";
        if (!symbol) {
            return (0, sendHttpResponse_1.sendHttpResponse)(res, "Symbol is required", {}, 400, false);
        }
        const cmp = await (0, yahoo_service_1.getCMP)(symbol);
        return (0, sendHttpResponse_1.sendHttpResponse)(res, "CMP fetched successfully", { symbol, cmp });
    }
    catch (error) {
        return (0, sendHttpResponse_1.sendHttpResponse)(res, "Failed to fetch CMP", { error: error.message }, 500, false);
    }
};
exports.fetchCMP = fetchCMP;
const fetchBulkCMP = async (req, res) => {
    try {
        const symbols = req.body.symbols;
        if (!Array.isArray(symbols) || symbols.length === 0) {
            return (0, sendHttpResponse_1.sendHttpResponse)(res, "Symbols array is required", {}, 400, false);
        }
        const results = await (0, yahoo_service_1.getBulkCMP)(symbols);
        return (0, sendHttpResponse_1.sendHttpResponse)(res, "Bulk CMP fetched successfully", { results });
    }
    catch (error) {
        return (0, sendHttpResponse_1.sendHttpResponse)(res, "Failed to fetch bulk CMP", { error: error.message }, 500, false);
    }
};
exports.fetchBulkCMP = fetchBulkCMP;
const fetchGoogleData = async (req, res) => {
    try {
        const symbol = typeof req.query.symbol === "string" ? req.query.symbol : "";
        if (!symbol) {
            return (0, sendHttpResponse_1.sendHttpResponse)(res, "Symbol is required", {}, 400, false);
        }
        const googleData = await (0, google_service_1.getGoogleData)(symbol);
        const yahooSymbol = symbol
            .replace(":NSE", ".NS")
            .replace(":BSE", ".BO");
        let finalCMP = googleData.cmp;
        let source = "google";
        if (finalCMP === null) {
            const yahooCMP = await (0, yahoo_service_1.getCMP)(yahooSymbol);
            finalCMP = yahooCMP;
            source = "yahoo-fallback";
        }
        return (0, sendHttpResponse_1.sendHttpResponse)(res, "Google Finance data fetched successfully", {
            symbol,
            peRatio: googleData.peRatio,
            latestEarnings: googleData.latestEarnings,
            cmp: finalCMP,
            source,
        });
    }
    catch (error) {
        return (0, sendHttpResponse_1.sendHttpResponse)(res, "Failed to fetch Google Finance data", { error: error.message }, 500, false);
    }
};
exports.fetchGoogleData = fetchGoogleData;
//# sourceMappingURL=market.controller.js.map