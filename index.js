const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.Server(app);
const io = socketIo(server);

// const serverIP = "192.168.11.50";
const PORT = 8080;

var users = [];

app.use(express.static("docs"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// server.listen(PORT, serverIP);
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

io.on("connection", (socket) => {
  const userId = socket.id;

  socket.emit("user-id", userId);

  socket.on("sendMessage", (msg) => {
    console.log("message: " + msg);
    io.emit("receiveMessage", msg);
  });
});
