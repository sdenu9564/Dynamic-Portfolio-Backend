import XLSX from "xlsx";
import path from "path";

export interface StockXLS {
particulars: string;
purchasePrice: number;
qty: number;
investment: number;
portfolioPercent: number;
exchange: string;
sector: string;
}

export const loadExcel = (): StockXLS[] => {
try {
const filePath = path.resolve("predata.xlsx");
const workbook = XLSX.readFile(filePath);

if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
  throw new Error("Excel file contains no sheets.");
}

const sheetName = workbook.SheetNames[0]!;
const sheet = workbook.Sheets[sheetName];

if (!sheet) {
  throw new Error(`Sheet ${sheetName} could not be loaded.`);
}

const rawData: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

const jsonData = rawData.map((row) => {
  const normalizedRow: Record<string, any> = {};
  for (const key in row) {
    const normalizedKey = key.replace(/\u00A0/g, " ").trim(); 
    normalizedRow[normalizedKey] = row[key];
  }
  return normalizedRow;
});


const parsed: StockXLS[] = jsonData
  .map((row: any) => ({
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

} catch (error) {
console.error("Excel read error:", error);
return [];
}
};