import { Router } from "express";
import { fetchCMP, fetchBulkCMP, fetchGoogleData } from "../controllers/market.controller";

const router = Router();

router.get("/cmp", fetchCMP);          
router.post("/cmp/bulk", fetchBulkCMP); 
router.get("/google", fetchGoogleData); 

export default router;
