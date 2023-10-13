//カードの保存

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const saveCardDb = async (msg, spaceId) => {
  const apiUrl = spaceId ? `${baseUrl}/api/message/${spaceId}` : `${baseUrl}/api/message`;

  console.log("msg", JSON.stringify(msg));
  console.log("apiUrl", apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msg),
    });
    if (!response.ok) {
      throw new Error("カードの保存に失敗しました。");
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
};
