import express from "express";
import {
  registerDriver, loginDriver,
  registerPassenger, loginPassenger, getPassengerProfile,
  loginAdmin
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/driver/register", registerDriver);
router.post("/driver/login", loginDriver);

router.post("/passenger/register", registerPassenger);
router.post("/passenger/login", loginPassenger);
router.get("/passenger/me", protect("passenger"), getPassengerProfile);

router.post("/admin/login", loginAdmin);

export default router;
