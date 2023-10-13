import connectDB from "../../../middlewares/mongodb";
import mongoose from "mongoose";

const handler = async (req, res) => {
  try {
    await connectDB();
    const spaceSchema = new mongoose.Schema({
      info: String,
      spaceId: Number,
      timestamp: Date,
    });
    const Space = mongoose.models.Space || mongoose.model("Space", spaceSchema);

    const { spaceId } = req.query;
    const spaceData = await Space.findOne({ spaceId: parseInt(spaceId) });
    if (spaceData) {
      res.status(200).json(spaceData);
    } else {
      res.status(404).json({ message: "Space not found" });
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
