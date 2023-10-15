// カードのアップデート
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
// カードのアップデート
export const updateCardDb = async (msg, spaceId) => {
  // APIのURLを設定。spaceIdが指定されている場合はそのIDを使用し、指定されていない場合はデフォルトのURLを使用。
  const apiUrl = `${baseUrl}/api/message/${spaceId}`;

  console.log("msg", JSON.stringify(msg));
  console.log("apiUrl", apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: "PUT", // HTTPメソッドをPUTに変更
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(msg),
    });
    if (!response.ok) {
      const responseData = await response.json();
      throw new Error(`カードのアップデートに失敗しました。Reason: ${responseData.message || "Unknown"}`);
    }
    return response.json(); // 追加: APIからのレスポンスを返す
  } catch (error) {
    console.error("エラーが発生しました:", error);
    throw error; // 追加: エラーをthrowして呼び出し元でキャッチできるようにする
  }
};
