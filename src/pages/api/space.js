import connectDB from "../../middlewares/mongodb";
import mongoose from "mongoose";

// Spaceモデルを定義する関数
const defineSpaceModel = () => {
  const spaceSchema = new mongoose.Schema({
    info: String,
    spaceId: Number,
    timestamp: Date,
  });
  const spaceCollection = "Space";
  return mongoose.models[spaceCollection] || mongoose.model(spaceCollection, spaceSchema);
};

// GETリクエストを処理する関数
const handleGetRequest = async (req, res) => {
  try {
    await connectDB();
    const Space = defineSpaceModel();
    const posts = await Space.find({});
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

// POSTリクエストを処理する関数
const handlePostRequest = async (req, res) => {
  try {
    await connectDB();
    const Space = defineSpaceModel();
    console.log("Received request body:", req.body);

    const latestDocument = await Space.find().sort({ spaceId: -1 }).limit(1);
    const latestOrder = latestDocument.length > 0 ? latestDocument[0].spaceId : 0;

    const newSpace = new Space({
      info: JSON.stringify(req.body.info),
      spaceId: latestOrder + 1,
      timestamp: new Date(),
    });

    await newSpace.save();
    console.log("Space saved to DB...");

    res.status(201).json({ message: "Space created successfully", space: newSpace });
  } catch (err) {
    console.error("Could not save Space to DB...");
    console.error(err);
    res.status(500).json({ message: "An error occurred while creating the space" });
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
