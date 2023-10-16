import Pusher from "pusher";
import { saveCardDb } from "@/components/utils/save-card-db";

// Pusherの初期化
const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.NEXT_PUBLIC_PUSHER_APP_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

const sendPusherMessage = async (req, res) => {
  console.log("sendMessage function called");
  if (req.method === "POST") {
    try {
      const messageType = req.body.message.type || "new-message";

      if (messageType === "new-message") {
        //dbに保存
        saveCardDb(req.body.message, req.body.spaceId);
      }

      // Pusherを使用してメッセージをブロードキャスト
      console.log("Triggering on channel:", `room-${req.body.spaceId}`);
      pusher.trigger(`room-${req.body.spaceId}`, "new-message", {
        message: req.body.message,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
};

export default sendPusherMessage;
