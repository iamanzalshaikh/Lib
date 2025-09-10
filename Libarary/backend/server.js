import dotenv from "dotenv";
dotenv.config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);

import express from 'express';
import connectDB from './config/db.js';
import userRouter from './routes/userRoute.js';
import authRouter from './routes/authRoute.js';
import cookieParser from "cookie-parser";
import adminRouter from './routes/adminRoute.js';
import memberRouter from './routes/memberRoute.js';
import reviewRouter from './routes/reviewRoute.js';
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';  // Import to get current file path

connectDB(); // connect to MongoDB

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS configuration
app.use(cors({
  origin: "https://officemanagment.netlify.app",  // ✅ correct frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(cookieParser()); 

// Routes
app.use("/api/auth", userRouter);
app.use("/api/user", authRouter);
app.use("/api/admin", adminRouter);
app.use("/api/member", memberRouter);
app.use("/api/review", reviewRouter);

// Get the directory name equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public' folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
