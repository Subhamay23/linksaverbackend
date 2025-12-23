import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		title: String,
		url: String,
		tags: [String],
		isFavorite: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export default mongoose.model("Link", linkSchema);
