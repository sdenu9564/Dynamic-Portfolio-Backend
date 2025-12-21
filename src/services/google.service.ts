import NodeCache from "node-cache";
import puppeteer, { Browser } from "puppeteer";

export interface GoogleData {
  peRatio: number | null;
  latestEarnings: number | null;
  cmp: number | null;
}

const cache = new NodeCache({ stdTTL: 300 });


export const getGoogleData = async (
  symbol: string,
  browser?: Browser
): Promise<GoogleData> => {
  let localBrowser: Browser | null = null;

  try {
    if (!symbol.trim()) return { cmp: null, peRatio: null, latestEarnings: null };

    const cached = cache.get<GoogleData>(`google_${symbol}`);
    if (cached) return cached;

    if (!browser) {
      localBrowser = await puppeteer.launch({ headless: true });
      browser = localBrowser;
    }

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/116 Safari/537.36"
    );

    const url = `https://www.google.com/finance/quote/${symbol}`;
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    const data: GoogleData = await page.evaluate(() => {
      const safeNumber = (val: string | null): number | null => {
        if (!val) return null;
        const n = Number(val.replace(/,/g, "").trim());
        return isNaN(n) ? null : n;
      };

      const textContent = document.body.innerText;

      let peRatio: number | null = null;
      const peMatch = textContent.match(/P\/E\s*ratio\s*([0-9.,]+)/i);
      if (peMatch && peMatch[1]) peRatio = safeNumber(peMatch[1]);

      let latestEarnings: number | null = null;
      const epsMatch = textContent.match(/Earnings\s*per\s*share\s*([0-9.,]+)/i);
      if (epsMatch && epsMatch[1]) latestEarnings = safeNumber(epsMatch[1]);

      const cmpText = document.querySelector('[data-qa="pricedata"] div[jsname]')?.textContent ?? null;
      const cmp = safeNumber(cmpText);

      return { cmp, peRatio, latestEarnings };
    });

    await page.close();
    cache.set(`google_${symbol}`, data);
    return data;
  } catch (error) {
    console.error("Google Puppeteer error:", error);
    return { cmp: null, peRatio: null, latestEarnings: null };
  } finally {
    if (localBrowser) await localBrowser.close();
  }
};
