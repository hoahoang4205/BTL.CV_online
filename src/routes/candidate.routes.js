import { Router } from "express";
import {
  createCandidates,
  renderCandidates,
  checkLogin,
  createCustomers,
  infoCandidates,
 
} from "../controllers/candidateController.js";
const router = Router();

router.get("/", renderCandidates);
router.post("/add", createCustomers);
router.post('/checkLogin', checkLogin);
router.post('/create', createCandidates);
router.post('/info', infoCandidates);


export default router;
