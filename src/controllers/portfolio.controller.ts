import { Request, Response } from "express";
import puppeteer, { Browser } from "puppeteer";
import { loadExcel, StockXLS } from "../services/xlsx.service";
import { getCMP } from "../services/yahoo.service";
import { getGoogleData, GoogleData } from "../services/google.service";
import { sendHttpResponse } from "../utils/sendHttpResponse";
import { GOOGLE_SYMBOL_MAP } from "../utils/googleSymbolMap";

interface StockWithLive extends StockXLS {
  cmp: number | null;
  presentValue: number | null;
  gainLoss: number | null;
  gainLossPercent: number | null;
  peRatio: number | null;
  latestEarnings: number | null;
  source: "google" | "yahoo-fallback" | "excel";
}

export const getPortfolio = async (req: Request, res: Response) => {
  let browser: Browser | null = null; 

  try {
    const portfolio = loadExcel();
    if (!portfolio.length) {
      return sendHttpResponse(res, "No portfolio data found", {}, 404, false);
    }

    browser = await puppeteer.launch({ headless: true });

    const stocksWithLive: StockWithLive[] = await Promise.all(
      portfolio.map(async (stock) => {
        const googleSymbol =
          GOOGLE_SYMBOL_MAP[stock.particulars]
          ? `${GOOGLE_SYMBOL_MAP[stock.particulars]}:NSE`
          : `${stock.particulars.replace(/\s/g, "")}:NSE`;

        const yahooSymbol = googleSymbol
          .replace(":NSE", ".NS")
          .replace(":BSE", ".BO");

        const [googleData, yahooCMP] = await Promise.all([
          getGoogleData(googleSymbol, browser!), 
          getCMP(yahooSymbol),
        ]);

        let cmp = googleData.cmp;
        let source: StockWithLive["source"] = "google";

        if (cmp === null) {
          cmp = yahooCMP;
          source = yahooCMP !== null ? "yahoo-fallback" : "excel";
        }

        const presentValue = cmp !== null ? cmp * stock.qty : null;
        const gainLoss =
          presentValue !== null ? presentValue - stock.investment : null;
        const gainLossPercent =
          gainLoss !== null && stock.investment > 0
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
      })
    );

    return sendHttpResponse(res, "Portfolio fetched successfully", {
      stocks: stocksWithLive,
    });
  } catch (error: any) {
    return sendHttpResponse(
      res,
      "Failed to fetch portfolio",
      { error: error.message },
      500,
      false
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
