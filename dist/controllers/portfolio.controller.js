"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPortfolio = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const xlsx_service_1 = require("../services/xlsx.service");
const yahoo_service_1 = require("../services/yahoo.service");
const google_service_1 = require("../services/google.service");
const sendHttpResponse_1 = require("../utils/sendHttpResponse");
const googleSymbolMap_1 = require("../utils/googleSymbolMap");
const getPortfolio = async (req, res) => {
    let browser = null; // ✅ EXPLICIT TYPE
    try {
        const portfolio = (0, xlsx_service_1.loadExcel)();
        if (!portfolio.length) {
            return (0, sendHttpResponse_1.sendHttpResponse)(res, "No portfolio data found", {}, 404, false);
        }
        browser = await puppeteer_1.default.launch({ headless: true });
        const stocksWithLive = await Promise.all(portfolio.map(async (stock) => {
            const googleSymbol = googleSymbolMap_1.GOOGLE_SYMBOL_MAP[stock.particulars]
                ? `${googleSymbolMap_1.GOOGLE_SYMBOL_MAP[stock.particulars]}:NSE`
                : `${stock.particulars.replace(/\s/g, "")}:NSE`;
            const yahooSymbol = googleSymbol
                .replace(":NSE", ".NS")
                .replace(":BSE", ".BO");
            const [googleData, yahooCMP] = await Promise.all([
                (0, google_service_1.getGoogleData)(googleSymbol, browser), // safe here
                (0, yahoo_service_1.getCMP)(yahooSymbol),
            ]);
            let cmp = googleData.cmp;
            let source = "google";
            if (cmp === null) {
                cmp = yahooCMP;
                source = yahooCMP !== null ? "yahoo-fallback" : "excel";
            }
            const presentValue = cmp !== null ? cmp * stock.qty : null;
            const gainLoss = presentValue !== null ? presentValue - stock.investment : null;
            const gainLossPercent = gainLoss !== null && stock.investment > 0
                ? (gainLoss / stock.investment) * 100
                : null;
            return {
                ...stock,
                cmp,
                peRatio: googleData.peRatio,
                latestEarnings: googleData.latestEarnings,
                presentValue,
                gainLoss,
                gainLossPercent,
                source,
            };
        }));
        return (0, sendHttpResponse_1.sendHttpResponse)(res, "Portfolio fetched successfully", {
            stocks: stocksWithLive,
        });
    }
    catch (error) {
        return (0, sendHttpResponse_1.sendHttpResponse)(res, "Failed to fetch portfolio", { error: error.message }, 500, false);
    }
    finally {
        if (browser) {
            await browser.close(); // ✅ SAFE CLOSE
        }
    }
};
exports.getPortfolio = getPortfolio;
//# sourceMappingURL=portfolio.controller.js.map