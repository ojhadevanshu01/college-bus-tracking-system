import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import publicRoutes from "./routes/publicRoutes.js";
import driverRoutes from "./routes/driverRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { setupLocationSocket } from "./socket/locationSocket.js";

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must be configured with at least 32 characters.");
  process.exit(1);
}

const app = express();
const server = http.createServer(app);
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",").map(v => v.trim()).filter(Boolean);

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin not allowed by CORS"));
  },
  credentials: true
}));
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "50kb" }));

app.get("/api/health", (req, res) => res.json({
  status: "ok",
  service: "college-bus-api",
  timestamp: new Date().toISOString()
}));

app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => res.status(404).json({ message: "API route not found" }));
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.message === "Origin not allowed by CORS" ? 403 : 500;
  res.status(status).json({ message: status === 500 ? "Internal server error" : err.message });
});

const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ["GET", "POST"], credentials: true }
});
setupLocationSocket(io);

const PORT = Number(process.env.PORT) || 5000;

connectDB().then(() => {
  server.listen(PORT, () => console.log(`College Bus API listening on port ${PORT}`));
}).catch(error => {
  console.error("Database connection failed:", error);
  process.exit(1);
});
