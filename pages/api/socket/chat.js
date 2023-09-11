const chat = async (req, res) => {
  if (req.method === "POST") {
    // get message

    const msg = req.body;
    console.log(msg);
    //io.emit("receiveMessage", msg);

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit("receiveMessage", msg);

    //console.log(res?.socket?.server?.io);
    //res?.socket?.server?.io?.emit("user-id", userId);

    // return message
    res.status(201).json(msg);
  }
};

export default chat;
