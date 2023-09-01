require("dotenv").config();
const { format } = require("date-fns");
const { utcToZonedTime } = require("date-fns-tz");

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

// mongoose
const mongoose = require("mongoose");
mongoose
  // .connect("mongodb://localhost/conVerse", {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // })
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error(err));

const messageSchema = new mongoose.Schema({
  message: String,
  userId: String,
  timestamp: Date,
});

const Message = mongoose.model("Message", messageSchema);

const app = express();
const server = http.Server(app);
const io = socketIo(server);

app.use(express.static("docs"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/messages", (req, res) => {
  Message.find()
    .then((messages) => res.send(messages))
    .catch((err) => console.error(err));
});

app.post("/reset", (req, res) => {
  Message.deleteMany({})
    .then(() => res.send("Messages deleted..."))
    .catch((err) => console.error(err));
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

io.on("connection", (socket) => {
  const userId = socket.id;

  socket.emit("user-id", userId);

  socket.on("sendMessage", (msg) => {
    const newMessage = new Message({
      message: msg,
      userId: userId,
      // 日本時間を取得
      timestamp: new Date(),
    });

    newMessage
      .save()
      .then(() => console.log("Message saved to DB..."))
      .catch((err) => console.error("Could not save message to DB..."));

    console.log("message: " + msg);
    io.emit("receiveMessage", msg);
  });
});
