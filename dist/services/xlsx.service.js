"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadExcel = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
const path_1 = __importDefault(require("path"));
const loadExcel = () => {
    try {
        const filePath = path_1.default.resolve("predata.xlsx");
        const workbook = xlsx_1.default.readFile(filePath);
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
            throw new Error("Excel file contains no sheets.");
        }
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) {
            throw new Error(`Sheet ${sheetName} could not be loaded.`);
        }
        const rawData = xlsx_1.default.utils.sheet_to_json(sheet, { defval: "" });
        const jsonData = rawData.map((row) => {
            const normalizedRow = {};
            for (const key in row) {
                const normalizedKey = key.replace(/\u00A0/g, " ").trim();
                normalizedRow[normalizedKey] = row[key];
            }
            return normalizedRow;
        });
        const parsed = jsonData
            .map((row) => ({
            particulars: String(row["__EMPTY_1"] ?? "").trim(),
            purchasePrice: Number(row["__EMPTY_7"] ?? 0),
            qty: Number(String(row["__EMPTY_2"] ?? "0").replace(/,/g, "")),
            investment: Number(row["__EMPTY_4"] ?? 0),
            portfolioPercent: Number(row["__EMPTY_5"] ?? 0),
            exchange: String(row["__EMPTY_6"] ?? "").trim().toUpperCase(),
            sector: String(row["__EMPTY_3"] ?? "").trim(),
        }))
            .filter((r) => r.particulars !== "" && r.exchange !== "");
        return parsed;
    }
    catch (error) {
        console.error("Excel read error:", error);
        return [];
    }
};
exports.loadExcel = loadExcel;
//# sourceMappingURL=xlsx.service.js.map