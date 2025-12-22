import YahooFinance from "yahoo-finance2";
import NodeCache from "node-cache";

const yahooFinance = new YahooFinance();
const cache = new NodeCache({ stdTTL: 30 });

export interface YahooMarketData {
  cmp: number | null;
  peRatio: number | null;
  latestEarnings: number | null;
}

export const getMarketData = async (
  symbol: string
): Promise<YahooMarketData> => {
  try {
    if (!symbol || !symbol.trim()) {
      return { cmp: null, peRatio: null, latestEarnings: null };
    }

    const cacheKey = `market_${symbol}`;
    const cached = cache.get<YahooMarketData>(cacheKey);
    if (cached) return cached;

    const quote = await yahooFinance.quote(symbol);

    const data: YahooMarketData = {
      cmp:
        quote?.regularMarketPrice ??
        quote?.price?.regularMarketPrice ??
        quote?.regularMarketPreviousClose ??
        null,

      peRatio: quote?.trailingPE ?? null,

      latestEarnings: quote?.epsTrailingTwelveMonths ?? null,
    };

    cache.set(cacheKey, data);
    return data;
  } catch (err) {
    console.error(`Yahoo market fetch failed for ${symbol}:`, err);
    return { cmp: null, peRatio: null, latestEarnings: null };
  }
};

export const getCMP = async (symbol: string): Promise<number | null> => {
  try {
    if (!symbol || !symbol.trim()) return null;

    const cacheKey = `cmp_${symbol}`;
    const cached = cache.get<number>(cacheKey);
    if (cached !== undefined) return cached;

    const quote = await yahooFinance.quote(symbol);

    const price =
      quote?.regularMarketPrice ??
      quote?.price?.regularMarketPrice ??
      quote?.regularMarketPreviousClose ??
      null;

    if (price === null || Number.isNaN(Number(price))) return null;

    const cmp = Number(price);
    cache.set(cacheKey, cmp);
    return cmp;
  } catch (err) {
    console.error(`Yahoo CMP fetch failed for ${symbol}:`, err);
    return null;
  }
};

export const getBulkCMP = async (
  symbols: string[]
): Promise<Record<string, number | null>> => {
  const results: Record<string, number | null> = {};

  await Promise.all(
    symbols.map(async (symbol) => {
      try {
        const quote = await yahooFinance.quote(symbol);

        const price =
          quote?.regularMarketPrice ??
          quote?.price?.regularMarketPrice ??
          quote?.regularMarketPreviousClose ??
          null;

        results[symbol] =
          price === null || Number.isNaN(Number(price))
            ? null
            : Number(price);
      } catch (err) {
        console.error(`Yahoo bulk fetch failed for ${symbol}:`, err);
        results[symbol] = null;
      }
    })
  );

  return results;
};
