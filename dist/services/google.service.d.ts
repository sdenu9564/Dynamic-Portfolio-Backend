import { Browser } from "puppeteer-core";
export interface GoogleData {
    peRatio: number | null;
    latestEarnings: number | null;
    cmp: number | null;
}
export declare const getGoogleData: (symbol: string, browser?: Browser) => Promise<GoogleData>;
//# sourceMappingURL=google.service.d.ts.map