export const getSpaces = async (max_spaces) => {
  //BaseURLを設定
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/space`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      // データを逆順に並べ替え
      const reversedData = data.reverse();
      const posts = await createSpaces(reversedData, max_spaces);
      return posts;
    } else {
      console.error("Failed to fetch space data:", res.status, res.statusText);
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
};

const createSpaces = async (data, max_spaces) => {
  let newdata = [];

  data.forEach((value, index) => {
    if (index < max_spaces && value.info) {
      const json = JSON.parse(value.info);
      json.spaceId = value.spaceId;
      newdata.push(json);
    }
  });

  return newdata;
};
