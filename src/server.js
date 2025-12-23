import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import linkRoutes from "./routes/link.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
);

app.use("/auth", authRoutes);
app.use("/links", linkRoutes);

app.listen(process.env.PORT, () =>
	console.log(`Server running on ${process.env.PORT}`)
);
