import connectDB from "../../../middlewares/mongodb";
import mongoose from "mongoose";

const handler = async (req, res) => {
  try {
    const { method } = req;
    await connectDB();

    const { message = "default" } = req.query;
    const messageCollection = `Collection_${message}`;
    const messageSchema = new mongoose.Schema(
      {
        message: String,
        timestamp: Date,
      },
      {
        collection: messageCollection,
      }
    );
    console.log("messageId:", message);
    console.log("messageCollection:", messageCollection);
    const Message = mongoose.models[messageCollection] || mongoose.model(messageCollection, messageSchema);

    switch (method) {
      case "GET":
        const messages = await Message.find({});
        res.status(200).json(messages);
        break;
      case "POST":
        try {
          const newMessage = new Message({
            message: JSON.stringify(req.body),
            timestamp: new Date(),
          });

          await newMessage.save(); // データベースへの保存を非同期で実行

          console.log("Message saved to DB...");
          res.status(201).json({ message: "Message created successfully", newMessage });
        } catch (error) {
          console.error("Could not save message to DB:", error);
          res.status(500).json({ statusCode: 500, message: "Could not save message to DB" });
        }
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
