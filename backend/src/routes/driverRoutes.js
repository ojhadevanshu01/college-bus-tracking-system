import express from "express";

import {
  getDriverDashboard,
  startTrip,
  stopTrip
} from "../controllers/driverController.js";

import {
  protect
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

router.use(protect("driver"));

router.get(
  "/dashboard",
  getDriverDashboard
);

router.post(
  "/trips/start",
  startTrip
);

router.post(
  "/trips/:id/stop",
  stopTrip
);

export default router;