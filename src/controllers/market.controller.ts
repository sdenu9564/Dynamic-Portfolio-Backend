import { Request, Response } from "express";
import { getCMP, getBulkCMP } from "../services/yahoo.service";
import { getGoogleData } from "../services/google.service";
import { sendHttpResponse } from "../utils/sendHttpResponse";

export const fetchCMP = async (req: Request, res: Response) => {
  try {
    const symbol = typeof req.query.symbol === "string" ? req.query.symbol : "";
    if (!symbol) {
      return sendHttpResponse(res, "Symbol is required", {}, 400, false);
    }

    const cmp = await getCMP(symbol);
    return sendHttpResponse(res, "CMP fetched successfully", { symbol, cmp });
  } catch (error: any) {
    return sendHttpResponse(res, "Failed to fetch CMP", { error: error.message }, 500, false);
  }
};

export const fetchBulkCMP = async (req: Request, res: Response) => {
  try {
    const symbols = req.body.symbols as string[];
    if (!Array.isArray(symbols) || symbols.length === 0) {
      return sendHttpResponse(res, "Symbols array is required", {}, 400, false);
    }

    const results = await getBulkCMP(symbols);
    return sendHttpResponse(res, "Bulk CMP fetched successfully", { results });
  } catch (error: any) {
    return sendHttpResponse(res, "Failed to fetch bulk CMP", { error: error.message }, 500, false);
  }
};

export const fetchGoogleData = async (req: Request, res: Response) => {
  try {
    const symbol = typeof req.query.symbol === "string" ? req.query.symbol : "";
    if (!symbol) {
      return sendHttpResponse(res, "Symbol is required", {}, 400, false);
    }

    const googleData = await getGoogleData(symbol);

    const yahooSymbol = symbol
      .replace(":NSE", ".NS")
      .replace(":BSE", ".BO");

    let finalCMP = googleData.cmp;
    let source = "google";

    if (finalCMP === null) {
      const yahooCMP = await getCMP(yahooSymbol);
      finalCMP = yahooCMP;
      source = "yahoo-fallback";
    }

    return sendHttpResponse(res, "Google Finance data fetched successfully", {
      symbol,
      peRatio: googleData.peRatio,
      latestEarnings: googleData.latestEarnings,
      cmp: finalCMP,
      source,
    });
  } catch (error: any) {
    return sendHttpResponse(
      res,
      "Failed to fetch Google Finance data",
      { error: error.message },
      500,
      false
    );
  }
};
