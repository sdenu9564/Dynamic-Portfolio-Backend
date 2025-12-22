import { Request, Response } from "express";
import { loadExcel, StockXLS } from "../services/xlsx.service";
import { getMarketData } from "../services/yahoo.service";
import { sendHttpResponse } from "../utils/sendHttpResponse";

interface StockWithLive extends StockXLS {
  cmp: number | null;
  presentValue: number | null;
  gainLoss: number | null;
  gainLossPercent: number | null;
  peRatio: number | null;
  latestEarnings: number | null;
  source: "yahoo" | "excel";
}

export const getPortfolio = async (req: Request, res: Response) => {
  try {
    const portfolio = loadExcel();

    if (!portfolio.length) {
      return sendHttpResponse(res, "No portfolio data found", {}, 404, false);
    }

    const stocksWithLive: StockWithLive[] = await Promise.all(
      portfolio.map(async (stock) => {
        const yahooSymbol = `${stock.particulars.replace(/\s/g, "")}.NS`;

        const marketData = await getMarketData(yahooSymbol);

        const cmp = marketData.cmp;
        const source: StockWithLive["source"] =
          cmp !== null ? "yahoo" : "excel";

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
          peRatio: marketData.peRatio,
          latestEarnings: marketData.latestEarnings,
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
    console.error("Portfolio error:", error);

    return sendHttpResponse(
      res,
      "Failed to fetch portfolio",
      { error: error.message },
      500,
      false
    );
  }
};
