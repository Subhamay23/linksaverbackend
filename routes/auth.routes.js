import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";

const router = express.Router();

/* Register */
router.post("/register", async (req, res) => {
	const { email, password } = req.body;
	const hash = await bcrypt.hash(password, 12);
	await User.create({ email, password: hash });
	res.status(201).json({ message: "User created" });
});

/* Login */
router.post("/login", async (req, res) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.sendStatus(401);

	const match = await bcrypt.compare(req.body.password, user.password);
	if (!match) return res.sendStatus(401);

	const accessToken = generateAccessToken(user._id);
	const refreshToken = generateRefreshToken(user._id);

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
	});

	res.json({ accessToken });
});

/* Refresh */
router.post("/refresh", (req, res) => {
	const token = req.cookies.refreshToken;
	if (!token) return res.sendStatus(401);

	jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
		if (err) return res.sendStatus(403);
		const accessToken = generateAccessToken(decoded.id);
		res.json({ accessToken });
	});
});

/* Logout */
router.post("/logout", (req, res) => {
	res.clearCookie("refreshToken");
	res.sendStatus(204);
});

export default router;
