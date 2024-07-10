import { Router } from "express";
import {
  createCandidates,
  renderCandidates,
  checkLogin,
  createCustomers,
} from "../controllers/candidateController.js";
const router = Router();

router.get("/", renderCandidates);
router.post("/add", createCustomers);
router.post('/checkLogin', checkLogin);
router.post('/create', createCandidates);
export default router;
