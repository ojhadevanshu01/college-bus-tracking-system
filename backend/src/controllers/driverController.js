import Bus from "../models/Bus.js";
import Driver from "../models/Driver.js";
import Trip from "../models/Trip.js";

export const getDriverDashboard =
  async (req, res) => {
    try {
      const driver =
        await Driver.findById(
          req.user.id
        ).select("-password");

      const bus =
        await Bus.findOne({
          assignedDriver: req.user.id,
          active: true
        }).lean();

      let trip = null;

      if (bus) {
        trip =
          await Trip.findOne({
            bus: bus._id,
            driver: req.user.id,
            status: "RUNNING"
          }).lean();
      }

      res.json({
        driver,
        bus,
        trip
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };


export const startTrip =
  async (req, res) => {
    try {
      const {
        busId
      } = req.body;

      const bus =
        await Bus.findOne({
          _id: busId,
          assignedDriver: req.user.id,
          active: true
        });

      if (!bus) {
        return res.status(403).json({
          message:
            "This bus is not assigned to you"
        });
      }

      const existingTrip =
        await Trip.findOne({
          driver: req.user.id,
          status: "RUNNING"
        });

      if (existingTrip) {
        return res.status(409).json({
          message:
            "You already have a running trip"
        });
      }

      const trip =
        await Trip.create({
          bus: bus._id,
          driver: req.user.id,
          status: "RUNNING"
        });

      res.status(201).json(trip);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };


export const stopTrip =
  async (req, res) => {
    try {
      const trip =
        await Trip.findOne({
          _id: req.params.id,
          driver: req.user.id,
          status: "RUNNING"
        });

      if (!trip) {
        return res.status(404).json({
          message:
            "Running trip not found"
        });
      }

      trip.status = "COMPLETED";
      trip.endedAt = new Date();

      await trip.save();

      res.json({
        message: "Trip stopped",
        trip
      });
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };