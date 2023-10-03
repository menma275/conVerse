//socketへの送信
export const sendApiSocketChat = async (msg) => {
  try {
    const response = await fetch("/api/socket/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msg),
    });

    if (!response.ok) {
      const errorData = await response.json(); // サーバーからのエラーレスポンスを取得
      throw new Error(errorData.message || "APIへのリクエストが失敗しました。");
    } else {
      console.log("sendApiSocketChat", msg);
    }
  } catch (error) {
    console.error("エラーが発生しました:", error); // ロギング
    alert("エラーが発生しました。しばらくしてから再試行してください。"); // ユーザーへの通知
  }
};

//カードの保存
export const saveCard = async (msg, landId) => {
  const apiUrl = landId ? `/api/message/${landId}` : `/api/message`;

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
