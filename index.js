const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

// mongoose
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/conVerse", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

const messageSchema = new mongoose.Schema({
  message: String,
  userId: String,
  timestamp: Date,
});

const Message = mongoose.model("Message", messageSchema);

const app = express();
const server = http.Server(app);
const io = socketIo(server);

const PORT = 8080;

app.use(express.static("docs"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

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
