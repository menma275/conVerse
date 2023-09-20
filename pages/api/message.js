import connectDB from "../../middlewares/mongodb";
import mongoose from "mongoose";

const handler = async (req, res) => {
  try {
    const { method } = req;
    await connectDB();
    const messageSchema = new mongoose.Schema({
      message: String,
      userId: String,
      timestamp: Date,
    });
    const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

    switch (method) {
      case "GET":
        const posts = await Message.find({});
        res.status(200).json(posts);
        break;
      case "POST":
        const newMessage = new Message({
          message: req.body,
          userId: req.userId,
          timestamp: new Date(),
        });
        newMessage
          .save()
          .then(() => console.log("Message saved to DB..."))
          .catch((err) => console.error("Could not save message to DB..."));

        break;
      default:
        res.setHeader("Allow", ["GET", "PUT"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
