const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.Server(app);
const io = socketIo(server);

const serverIP = "192.168.10.47";
const PORT = 8080;

var users = [];

app.use(express.static("docs"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.listen(PORT, serverIP);
// server.listen(PORT, () => {
//   console.log(`listening on port ${PORT}`);
// });

io.on("connection", (socket) => {
  const userId = socket.id;
  // users.push(userId);
  // console.log("a user connected");
  // userId.forEach((element) => {
  //   if (element == userId) {
  //     console.log("user already exists");
  //   } else {
  //     console.log("user id: " + userId);
  //     socket.emit("user-id", userId);
  //   }
  // });

  // ランダムないろを生成
  const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
  socket.emit("user-id", userId + "," + color);

  socket.on("sendMessage", (msg) => {
    console.log("message: " + msg);
    io.emit("receiveMessage", msg);
  });
});
