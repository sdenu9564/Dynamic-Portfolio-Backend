import YahooFinance from "yahoo-finance2";
import NodeCache from "node-cache";

const yahooFinance = new YahooFinance();
const cache = new NodeCache({ stdTTL: 15 });

export const getCMP = async (symbol: string): Promise<number | null> => {
  try {
    if (!symbol || symbol.trim() === "") return null;

    const cached = cache.get<number>(`cmp_${symbol}`);
    if (cached !== undefined) return cached;

    const quote = await yahooFinance.quote(symbol);

    const price =
      quote?.regularMarketPrice ??
      quote?.price?.regularMarketPrice ??
      quote?.regularMarketPreviousClose ??
      null;

    if (price == null) return null;

    const cmp = Number(price);
    if (Number.isNaN(cmp)) return null;

    cache.set(`cmp_${symbol}`, cmp);
    return cmp;
  } catch (err) {
    console.error(`Yahoo fetch failed for ${symbol}:`, err);
    return null;
  }
};

export const getBulkCMP = async (symbols: string[]): Promise<Record<string, number | null>> => {
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

        results[symbol] = price ? Number(price) : null;
      } catch (e) {
        console.error(`Yahoo fetch failed for ${symbol}:`, e);
        results[symbol] = null;
      }
    })
  );

  return results;
};
