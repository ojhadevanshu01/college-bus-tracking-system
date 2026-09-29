import Bus from "../models/Bus.js";
import Trip from "../models/Trip.js";

export const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find({
      active: true
    })
      .populate(
        "assignedDriver",
        "name"
      )
      .lean();

    const trips = await Trip.find({
      status: "RUNNING"
    }).lean();

    const tripMap = new Map();

    trips.forEach((trip) => {
      tripMap.set(
        trip.bus.toString(),
        trip
      );
    });

    const result = buses.map((bus) => {
      const trip = tripMap.get(
        bus._id.toString()
      );

      return {
        ...bus,

        status: trip
          ? "RUNNING"
          : "NOT_RUNNING",

        tripId: trip?._id || null,

        currentLocation:
          trip?.currentLocation || null
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


export const getBusById = async (req, res) => {
  try {
    const bus = await Bus.findOne({
      _id: req.params.id,
      active: true
    })
      .populate(
        "assignedDriver",
        "name"
      )
      .lean();

    if (!bus) {
      return res.status(404).json({
        message: "Bus not found"
      });
    }

    const trip = await Trip.findOne({
      bus: bus._id,
      status: "RUNNING"
    }).lean();

    res.json({
      ...bus,

      status: trip
        ? "RUNNING"
        : "NOT_RUNNING",

      tripId: trip?._id || null,

      currentLocation:
        trip?.currentLocation || null
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};