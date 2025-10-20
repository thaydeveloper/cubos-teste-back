import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import { errorHandler } from "@/middlewares/errorHandler";
import { notFoundHandler } from "@/middlewares/notFoundHandler";
import authRoutes from "@/routes/authRoutes";
import movieRoutes from "@/routes/movieRoutes";
import uploadRoutes from "@/routes/uploadRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"),
  max: parseInt(process.env.RATE_LIMIT_MAX || "100"),
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("combined"));
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api", (req, res) => {
  res.json({
    message: "Movies API is running!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      movies: "/api/movies",
      upload: "/api/upload",
    },
  });
});

app.use(notFoundHandler);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app;
