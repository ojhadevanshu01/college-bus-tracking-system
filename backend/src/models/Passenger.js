import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    studentId: { type: String, required: true, trim: true, uppercase: true, unique: true, index: true, maxlength: 40 },
    college: { type: String, trim: true, maxlength: 120, default: "" },
    password: { type: String, required: true, select: false },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Passenger = mongoose.model("Passenger", passengerSchema);
export default Passenger;
