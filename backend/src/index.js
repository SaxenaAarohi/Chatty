import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config()

const PORT  = process.env.PORT


app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:3001", // frontend origin
  credentials: true,               // <== VERY IMPORTANT
}));

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);


server.listen(PORT, () => {
    connectDB();
} );