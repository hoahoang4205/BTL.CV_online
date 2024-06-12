import { Router } from "express";
import {
  createCandidates,
  deleteCandidate,
  editCandidate,
  renderCandidates,
  updateCandidate,
  checkLogin,
} from "../controllers/customerController.js";
const router = Router();

router.get("/", renderCandidates);
router.post("/add", createCandidates);
router.post('/checkLogin', checkLogin);
router.get("/update/:id", editCandidate);
router.post("/update/:id", updateCandidate);
router.get("/delete/:id", deleteCandidate);

export default router;
