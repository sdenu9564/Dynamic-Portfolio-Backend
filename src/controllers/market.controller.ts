import { Request, Response } from "express";
import {
  getCMP,
  getBulkCMP,
  getMarketData,
} from "../services/yahoo.service";
import { sendHttpResponse } from "../utils/sendHttpResponse";

export const fetchCMP = async (req: Request, res: Response) => {
  try {
    const symbol = typeof req.query.symbol === "string" ? req.query.symbol : "";

    if (!symbol) {
      return sendHttpResponse(res, "Symbol is required", {}, 400, false);
    }

    const cmp = await getCMP(symbol);

    return sendHttpResponse(res, "CMP fetched successfully", {
      symbol,
      cmp,
      source: "yahoo",
    });
  } catch (error: any) {
    return sendHttpResponse(
      res,
      "Failed to fetch CMP",
      { error: error.message },
      500,
      false
    );
  }
};

export const fetchBulkCMP = async (req: Request, res: Response) => {
  try {
    const symbols = req.body.symbols as string[];

    if (!Array.isArray(symbols) || symbols.length === 0) {
      return sendHttpResponse(res, "Symbols array is required", {}, 400, false);
    }

    const results = await getBulkCMP(symbols);

    return sendHttpResponse(res, "Bulk CMP fetched successfully", {
      results,
      source: "yahoo",
    });
  } catch (error: any) {
    return sendHttpResponse(
      res,
      "Failed to fetch bulk CMP",
      { error: error.message },
      500,
      false
    );
  }
};

export const fetchMarketData = async (req: Request, res: Response) => {
  try {
    const symbol = typeof req.query.symbol === "string" ? req.query.symbol : "";

    if (!symbol) {
      return sendHttpResponse(res, "Symbol is required", {}, 400, false);
    }

    const marketData = await getMarketData(symbol);

    return sendHttpResponse(res, "Market data fetched successfully", {
      symbol,
      ...marketData,
      source: "yahoo",
    });
  } catch (error: any) {
    return sendHttpResponse(
      res,
      "Failed to fetch market data",
      { error: error.message },
      500,
      false
    );
  }
};
