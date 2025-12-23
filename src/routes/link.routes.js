import express from "express";
import Link from "../models/Link.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/* Get all links */
router.get("/", auth, async (req, res) => {
	const links = await Link.find({ userId: req.userId });
	res.json(links);
});

/* Create link */
router.post("/", auth, async (req, res) => {
	const link = await Link.create({ ...req.body, userId: req.userId });
	res.status(201).json(link);
});

/* Update link */
router.put("/:id", auth, async (req, res) => {
	const link = await Link.findOneAndUpdate(
		{ _id: req.params.id, userId: req.userId },
		req.body,
		{ new: true }
	);
	res.json(link);
});

/* Delete link */
router.delete("/:id", auth, async (req, res) => {
	await Link.deleteOne({ _id: req.params.id, userId: req.userId });
	res.sendStatus(204);
});

export default router;
