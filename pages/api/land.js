import connectDB from "../../middlewares/mongodb";
import mongoose from "mongoose";

// Landモデルを定義する関数
const defineLandModel = () => {
  const landSchema = new mongoose.Schema({
    info: String,
    landId: Number,
    timestamp: Date,
  });
  const landCollection = "Land";
  return mongoose.models[landCollection] || mongoose.model(landCollection, landSchema);
};

// GETリクエストを処理する関数
const handleGetRequest = async (req, res) => {
  try {
    await connectDB();
    const Land = defineLandModel();
    const posts = await Land.find({});
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

// POSTリクエストを処理する関数
const handlePostRequest = async (req, res) => {
  try {
    await connectDB();
    const Land = defineLandModel();
    console.log("Received request body:", req.body);

    const latestDocument = await Land.find().sort({ landId: -1 }).limit(1);
    const latestOrder = latestDocument.length > 0 ? latestDocument[0].landId : 0;

    const newLand = new Land({
      info: JSON.stringify(req.body.info),
      landId: latestOrder + 1,
      timestamp: new Date(),
    });

    await newLand.save();
    console.log("Land saved to DB...");

    res.status(201).json({ message: "Land created successfully", land: newLand });
  } catch (err) {
    console.error("Could not save Land to DB...");
    console.error(err);
    res.status(500).json({ message: "An error occurred while creating the land" });
  }
};

const handler = async (req, res) => {
  try {
    const { method } = req;
    switch (method) {
      case "GET":
        await handleGetRequest(req, res);
        break;
      case "POST":
        await handlePostRequest(req, res);
        break;
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
