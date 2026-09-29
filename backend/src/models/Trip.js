import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bus",
      required: true
    },

    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true
    },

    status: {
      type: String,
      enum: ["RUNNING", "COMPLETED"],
      default: "RUNNING"
    },

    startedAt: {
      type: Date,
      default: Date.now
    },

    endedAt: {
      type: Date
    },

    currentLocation: {
      latitude: Number,
      longitude: Number,
      updatedAt: Date
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Trip", tripSchema);