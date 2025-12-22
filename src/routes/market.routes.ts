import { Router } from "express";
import { fetchCMP, fetchBulkCMP, fetchMarketData} from "../controllers/market.controller";

const router = Router();

router.get("/cmp", fetchCMP);          
router.post("/cmp/bulk", fetchBulkCMP); 
router.get("/market", fetchMarketData);


export default router;
