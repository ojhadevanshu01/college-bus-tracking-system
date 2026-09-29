import express from "express";

import {
  getAllBuses,
  getBusById
} from "../controllers/publicController.js";

const router =
  express.Router();

router.get(
  "/buses",
  getAllBuses
);

router.get(
  "/buses/:id",
  getBusById
);

export default router;