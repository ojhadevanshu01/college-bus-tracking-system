import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Driver from "../models/Driver.js";
import Admin from "../models/Admin.js";
import Passenger from "../models/Passenger.js";

const createToken = (id, role) =>
  jwt.sign({ id: id.toString(), role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const passwordError = (password = "") =>
  password.length < 8 ? "Password must be at least 8 characters" : null;

export const registerDriver = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password)
      return res.status(400).json({ message: "All fields are required" });
    const pErr = passwordError(password);
    if (pErr) return res.status(400).json({ message: pErr });

    const normalizedEmail = normalizeEmail(email);
    if (await Driver.findOne({ email: normalizedEmail }))
      return res.status(409).json({ message: "Driver already registered" });

    const driver = await Driver.create({
      name: name.trim(), email: normalizedEmail, phone: phone.trim(),
      password: await bcrypt.hash(password, 12)
    });

    res.status(201).json({
      message: "Registration successful. Wait for admin approval.",
      driver: { id: driver._id, name: driver.name, email: driver.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;
    const driver = await Driver.findOne({ email: normalizeEmail(email) }).select("+password");
    if (!driver || !(await bcrypt.compare(password || "", driver.password)))
      return res.status(401).json({ message: "Invalid email or password" });
    if (!driver.active) return res.status(403).json({ message: "Driver account is inactive" });
    if (!driver.approved) return res.status(403).json({ message: "Your account is waiting for admin approval" });

    res.json({
      token: createToken(driver._id, "driver"),
      driver: { id: driver._id, name: driver.name, email: driver.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerPassenger = async (req, res) => {
  try {
    const { name, email, phone, studentId, college, password } = req.body;
    if (!name || !email || !phone || !studentId || !password)
      return res.status(400).json({ message: "Name, email, phone, student ID and password are required" });

    const pErr = passwordError(password);
    if (pErr) return res.status(400).json({ message: pErr });

    const normalizedEmail = normalizeEmail(email);
    const normalizedStudentId = studentId.trim().toUpperCase();

    const [emailExists, studentExists] = await Promise.all([
      Passenger.findOne({ email: normalizedEmail }),
      Passenger.findOne({ studentId: normalizedStudentId })
    ]);
    if (emailExists) return res.status(409).json({ message: "Email is already registered" });
    if (studentExists) return res.status(409).json({ message: "Student ID is already registered" });

    const passenger = await Passenger.create({
      name: name.trim(), email: normalizedEmail, phone: phone.trim(),
      studentId: normalizedStudentId, college: (college || "").trim(),
      password: await bcrypt.hash(password, 12)
    });

    res.status(201).json({
      message: "Passenger account created successfully. You can now sign in.",
      passenger: { id: passenger._id, name: passenger.name, email: passenger.email, studentId: passenger.studentId }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginPassenger = async (req, res) => {
  try {
    const { email, password } = req.body;
    const passenger = await Passenger.findOne({ email: normalizeEmail(email) }).select("+password");
    if (!passenger || !(await bcrypt.compare(password || "", passenger.password)))
      return res.status(401).json({ message: "Invalid email or password" });
    if (!passenger.active) return res.status(403).json({ message: "Passenger account is inactive" });

    res.json({
      token: createToken(passenger._id, "passenger"),
      passenger: {
        id: passenger._id, name: passenger.name, email: passenger.email,
        phone: passenger.phone, studentId: passenger.studentId, college: passenger.college
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPassengerProfile = async (req, res) => {
  const passenger = await Passenger.findById(req.user.id).lean();
  if (!passenger || !passenger.active)
    return res.status(404).json({ message: "Passenger account not found" });
  delete passenger.password;
  res.json({ passenger });
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: normalizeEmail(email) }).select("+password");
    if (!admin || !(await bcrypt.compare(password || "", admin.password)))
      return res.status(401).json({ message: "Invalid email or password" });

    res.json({
      token: createToken(admin._id, "admin"),
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
