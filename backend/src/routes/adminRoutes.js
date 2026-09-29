import express from "express";

import {
  getDrivers,
  approveDriver,
  createBus,
  getBuses,
  assignBus,
  deactivateBus
} from "../controllers/adminController.js";

import {protect} from "../middleware/authMiddleware.js";

const router =express.Router();

router.use(protect("admin"));

router.get(
  "/drivers",
  getDrivers
);

router.patch(
  "/drivers/:id/approve",
  approveDriver
);

router.get(
  "/buses",
  getBuses
);

router.post(
  "/buses",
  createBus
);

router.patch(
  "/buses/:id/assign",
  assignBus
);

router.patch(
  "/buses/:id/deactivate",
  deactivateBus
);

export default router;