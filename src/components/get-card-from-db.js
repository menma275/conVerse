import { memo } from "react";

// 非同期コンポーネント: SpaceのIDに基づいてカード情報を取得し、表示する
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const GetCardFromDb = async (props) => {
  if (props.loadedData) {
    return null; // 既にデータがロードされているのでAPIリクエストはスキップ
  }
  // APIからカードの情報を非同期で取得する関数
  const getPosts = async (apiUrl) => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      return createCards(data);
    } catch (error) {
      console.error("エラーが発生しました:", error);
      return []; // ここで空の配列を返すようにします
    }
  };

  // 本日のカードデータのみをフィルタリングする関数
  const createCards = (data) => {
    // 今日の日付を取得
    const today = new Date();
    const todayDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

    // 今日のカードデータのみをフィルタリング
    return data
      .filter((value) => {
        const receiveDate = new Date(value.timestamp);
        const date = `${receiveDate.getFullYear()}-${receiveDate.getMonth() + 1}-${receiveDate.getDate()}`;
        return date === todayDate;
      })
      .map((value) => (value.message ? JSON.parse(value.message) : "NULL"));
  };

  const apiUrl = `${baseUrl}/api/message/${props.spaceId}`;
  console.log("loaded", props.loadedData);
  const dataList = await getPosts(apiUrl);
  if (dataList && dataList.length > 0) {
    props.onReceiveData(dataList);
  } else {
    console.warn("取得したデータが空または不正です");
  }

  return null;
};

export default memo(GetCardFromDb);
