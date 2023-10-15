import connectDB from "@/middlewares/mongodb";
import createMessageModel from "@/models/message-model";

const handler = async (req, res) => {
  console.log("Received request:", req.method, req.url);

  try {
    const { method } = req;
    await connectDB();

    const { message = "default" } = req.query;
    const messageCollectionName = `Collection_${message}`;
    const Message = createMessageModel(messageCollectionName);

    switch (method) {
      case "GET": {
        const messages = await Message.find({});
        res.status(200).json(messages);
        break;
      }
      case "POST": {
        console.log("POST request body:", req.body);

        const postId = req.body.postId;
        const newMessageData = {
          postId: postId,
          message: JSON.stringify(req.body),
          timestamp: new Date(),
        };

        try {
          // 既存のメッセージの確認と更新
          const existingMessage = await Message.findOneAndUpdate({ postId: postId }, newMessageData, { new: true, upsert: false });

          if (existingMessage) {
            console.log("Existing message updated:", existingMessage);
            res.status(200).json({ message: "Message updated successfully", existingMessage });
          } else {
            const newMessage = new Message(newMessageData);
            await newMessage.save();
            console.log("Message saved to DB...");
            res.status(201).json({ message: "Message created successfully", newMessage });
          }
        } catch (error) {
          if (error.name === "MongoError" && error.code === 11000) {
            console.error("Duplicate postId detected:", error);
            res.status(409).json({ message: "Duplicate postId detected." });
          } else {
            console.error("Error during message creation or update:", error);
            res.status(500).json({ statusCode: 500, message: "Could not save or update message to DB" });
          }
        }
        break;
      }
      case "PUT": {
        console.log("Received request body:", req.body);

        const postId = req.body.postId;

        if (!postId) {
          res.status(400).json({ message: "Error: Message ID (_id) is missing from the request body." });
          return;
        }

        const updatedMessageData = {
          postId: postId,
          message: JSON.stringify(req.body),
          timestamp: new Date(),
        };

        console.log("Updating with data:", updatedMessageData);

        try {
          const updatedMessage = await Message.findOneAndUpdate(
            { postId: postId },
            updatedMessageData,
            { new: true, upsert: false } // ここでupsertをfalseに設定
          );
          if (updatedMessage) {
            console.log("Successfully updated message:", updatedMessage);
            res.status(200).json({ message: "Message updated successfully", updatedMessage });
          } else {
            console.log("No message found with postId:", postId);
            res.status(404).json({ message: "No message found with given postId. Not creating a new one." });
            return;
          }
        } catch (error) {
          if (error.name === "MongoError" && error.code === 11000) {
            console.error("Duplicate postId detected:", error);
            res.status(409).json({ message: "Duplicate postId detected." });
          } else {
            console.error("Error during findOneAndUpdate:", error);
            res.status(500).json({ statusCode: 500, message: "Error during update." });
          }
        }
        break;
      }
      default: {
        res.setHeader("Allow", ["GET", "POST", "PUT"]);
        res.status(405).end(`Method ${method} Not Allowed`);
      }
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
