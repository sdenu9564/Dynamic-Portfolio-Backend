"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBulkCMP = exports.getCMP = void 0;
const yahoo_finance2_1 = __importDefault(require("yahoo-finance2"));
const node_cache_1 = __importDefault(require("node-cache"));
const yahooFinance = new yahoo_finance2_1.default();
const cache = new node_cache_1.default({ stdTTL: 15 });
const getCMP = async (symbol) => {
    try {
        if (!symbol || symbol.trim() === "")
            return null;
        const cached = cache.get(`cmp_${symbol}`);
        if (cached !== undefined)
            return cached;
        const quote = await yahooFinance.quote(symbol);
        const price = quote?.regularMarketPrice ??
            quote?.price?.regularMarketPrice ??
            quote?.regularMarketPreviousClose ??
            null;
        if (price == null)
            return null;
        const cmp = Number(price);
        if (Number.isNaN(cmp))
            return null;
        cache.set(`cmp_${symbol}`, cmp);
        return cmp;
    }
    catch (err) {
        console.error(`Yahoo fetch failed for ${symbol}:`, err);
        return null;
    }
};
exports.getCMP = getCMP;
const getBulkCMP = async (symbols) => {
    const results = {};
    await Promise.all(symbols.map(async (symbol) => {
        try {
            const quote = await yahooFinance.quote(symbol);
            const price = quote?.regularMarketPrice ??
                quote?.price?.regularMarketPrice ??
                quote?.regularMarketPreviousClose ??
                null;
            results[symbol] = price ? Number(price) : null;
        }
        catch (e) {
            console.error(`Yahoo fetch failed for ${symbol}:`, e);
            results[symbol] = null;
        }
    }));
    return results;
};
exports.getBulkCMP = getBulkCMP;
//# sourceMappingURL=yahoo.service.js.map