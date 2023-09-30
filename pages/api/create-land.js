import connectDB from "../../middlewares/mongodb";
import mongoose from "mongoose";

const handler = async (req, res) => {
  try {
    const { method } = req;
    await connectDB();
    const landSchema = new mongoose.Schema({
      name: String,
      landId: Number,
      Description: String,
      genId: String,
      userId: String,
      timestamp: Date,
    });
    const Land = mongoose.models.Land || mongoose.model("Land", landSchema);

    switch (method) {
      case "GET":
        const posts = await Land.find({});
        res.status(200).json(posts);
        break;
      case "POST":
        landSchema
          .find()
          .sort({ landId: -1 }) // 登録順に降順でソート
          .limit(1) // 最新の1つだけ取得
          .exec((err, latestDocument) => {
            if (err) {
              console.error(err);
              return;
            }
            // 最新の番号を取得
            const latestOrder = latestDocument.length > 0 ? latestDocument[0].registrationOrder : 0;

            const newLand = new Land({
              name: req.body,
              landId: latestOrder + 1,
              Description: req.Description,
              genId: req.genId,
              userId: req.userId,
              timestamp: new Date(),
            });
            newLand
              .save()
              .then(() => console.log("Land saved to DB..."))
              .catch((err) => console.error("Could not save Land to DB..."));
          });
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
