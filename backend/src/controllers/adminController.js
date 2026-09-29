import Bus from "../models/Bus.js";
import Driver from "../models/Driver.js";

export const getDrivers =
  async (req, res) => {
    try {
      const drivers =
        await Driver.find()
          .select("-password")
          .sort({
            createdAt: -1
          });

      res.json(drivers);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };


export const approveDriver =
  async (req, res) => {
    try {
      const driver =
        await Driver.findByIdAndUpdate(
          req.params.id,
          {
            approved: true
          },
          {
            new: true
          }
        ).select("-password");

      if (!driver) {
        return res.status(404).json({
          message: "Driver not found"
        });
      }

      res.json(driver);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };


export const createBus =
  async (req, res) => {
    try {
      const {
        busNumber,
        startPoint,
        endPoint
      } = req.body;

      const bus =
        await Bus.create({
          busNumber,
          startPoint,
          endPoint
        });

      res.status(201).json(bus);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  };


export const getBuses =
  async (req, res) => {
    try {
      const buses =
        await Bus.find()
          .populate(
            "assignedDriver",
            "name email"
          );

      res.json(buses);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };


export const assignBus =
  async (req, res) => {
    try {
      const {
        driverId
      } = req.body;

      const driver =
        await Driver.findOne({
          _id: driverId,
          approved: true,
          active: true
        });

      if (!driver) {
        return res.status(400).json({
          message:
            "Driver must be approved and active"
        });
      }

      // Remove this driver from any previous bus.
      await Bus.updateMany(
        {
          assignedDriver: driverId
        },
        {
          assignedDriver: null
        }
      );

      const bus =
        await Bus.findByIdAndUpdate(
          req.params.id,
          {
            assignedDriver: driverId
          },
          {
            new: true
          }
        ).populate(
          "assignedDriver",
          "name email"
        );

      if (!bus) {
        return res.status(404).json({
          message: "Bus not found"
        });
      }

      res.json(bus);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };


export const deactivateBus =
  async (req, res) => {
    try {
      const bus =
        await Bus.findByIdAndUpdate(
          req.params.id,
          {
            active: false,
            assignedDriver: null
          },
          {
            new: true
          }
        );

      if (!bus) {
        return res.status(404).json({
          message: "Bus not found"
        });
      }

      res.json(bus);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  };