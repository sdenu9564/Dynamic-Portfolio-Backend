"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleData = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const cache = new node_cache_1.default({ stdTTL: 300 });
const getGoogleData = async (symbol, browser) => {
    let localBrowser = null;
    try {
        if (!symbol.trim())
            return { cmp: null, peRatio: null, latestEarnings: null };
        const cached = cache.get(`google_${symbol}`);
        if (cached)
            return cached;
        if (!browser) {
            localBrowser = await puppeteer_1.default.launch({ headless: true });
            browser = localBrowser;
        }
        const page = await browser.newPage();
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/116 Safari/537.36");
        const url = `https://www.google.com/finance/quote/${symbol}`;
        await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
        const data = await page.evaluate(() => {
            const safeNumber = (val) => {
                if (!val)
                    return null;
                const n = Number(val.replace(/,/g, "").trim());
                return isNaN(n) ? null : n;
            };
            const textContent = document.body.innerText;
            let peRatio = null;
            const peMatch = textContent.match(/P\/E\s*ratio\s*([0-9.,]+)/i);
            if (peMatch && peMatch[1])
                peRatio = safeNumber(peMatch[1]);
            let latestEarnings = null;
            const epsMatch = textContent.match(/Earnings\s*per\s*share\s*([0-9.,]+)/i);
            if (epsMatch && epsMatch[1])
                latestEarnings = safeNumber(epsMatch[1]);
            const cmpText = document.querySelector('[data-qa="pricedata"] div[jsname]')?.textContent ?? null;
            const cmp = safeNumber(cmpText);
            return { cmp, peRatio, latestEarnings };
        });
        await page.close();
        cache.set(`google_${symbol}`, data);
        return data;
    }
    catch (error) {
        console.error("Google Puppeteer error:", error);
        return { cmp: null, peRatio: null, latestEarnings: null };
    }
    finally {
        if (localBrowser)
            await localBrowser.close();
    }
};
exports.getGoogleData = getGoogleData;
//# sourceMappingURL=google.service.js.map