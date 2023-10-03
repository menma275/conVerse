import { Server as ServerIO } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

const io = async (req, res) => {
  if (!res.socket.server.io) {
    const path = "/api/socket/io";
    console.log(`New Socket.io server... to ${path}`);
    const httpServer = res.socket.server;
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log(`User connected with socket ID: ${socket.id}`);

      socket.on("joinLand", (data) => {
        try {
          socket.join(data.landId);
          console.log(`User ${socket.id} joined Land ${data.landId}`);
        } catch (error) {
          console.error("Error joining land:", error);
        }
      });

      socket.on("leaveLand", ({ landId }) => {
        try {
          socket.leave(landId);
          console.log(`User ${socket.id} left Land ${landId}`);
        } catch (error) {
          console.error("Error leaving land:", error);
        }
      });

      socket.on("leaveAllLands", () => {
        try {
          const lands = Object.keys(socket.rooms);
          lands.forEach((land) => {
            if (land !== socket.id) {
              socket.leave(land);
              console.log(`User ${socket.id} left Land ${land}`);
            }
          });
        } catch (error) {
          console.error("Error leaving all lands:", error);
        }
      });

      socket.on("disconnect", () => {
        console.log(`User disconnected with socket ID: ${socket.id}`);
      });
    });
  }
  res.end();
};

export default io;
