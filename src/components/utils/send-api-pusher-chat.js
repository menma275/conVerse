// socketへの送信
export const sendApiPusherChat = async (userId, msg, spaceId, messageType = "new-message") => {
  const requestBody = {
    message: { ...msg, type: messageType },
    spaceId: spaceId,
    userId: userId,
  };
  try {
    const response = await fetch("/api/pusher/sendPusherMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response status:", response.status);

    if (response.ok) {
      const result = await response.json();
      console.log("Response body:", result);
      if (result.success) {
        console.log("sendApiPusherChat", msg);
      } else {
        console.error("Failed to send the message:", result.error);
      }
    } else {
      console.error("Failed to send the message:", await response.text());
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
  return null;
};
