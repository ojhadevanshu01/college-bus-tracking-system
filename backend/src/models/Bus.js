import mongoose from "mongoose";

const pointSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    latitude: {
      type: Number,
      required: true
    },

    longitude: {
      type: Number,
      required: true
    }
  },
  {
    _id: false
  }
);

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    startPoint: {
      type: pointSchema,
      required: true
    },

    endPoint: {
      type: pointSchema,
      required: true
    },

    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Bus", busSchema);