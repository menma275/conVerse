import connectDB from "../../../middlewares/mongodb";
import mongoose from "mongoose";

const handler = async (req, res) => {
  try {
    await connectDB();
    const landSchema = new mongoose.Schema({
      info: String,
      landId: Number,
      timestamp: Date,
    });
    const Land = mongoose.models.Land || mongoose.model("Land", landSchema);

    const { landId } = req.query;
    const landData = await Land.findOne({ landId: parseInt(landId) });
    if (landData) {
      res.status(200).json(landData);
    } else {
      res.status(404).json({ message: "Land not found" });
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
