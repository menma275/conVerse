import React, { memo } from "react";
import CardLoop from "@/components/cardLoop";

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

// localStorageにデータをセットする関数
const setDetaList = (dataList) => {
  localStorage.removeItem("dataList");
  const jsonString = JSON.stringify(dataList);
  localStorage.setItem("dataList", jsonString);
};

// APIからカードの情報を非同期で取得する関数
const getPosts = async (apiUrl) => {
  try {
    const res = await fetch(apiUrl, { cache: "no-store" });
    const data = await res.json();
    return createCards(data);
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
};

// 非同期コンポーネント: LandのIDに基づいてカード情報を取得し、表示する
const BoadAc = async ({ landId }) => {
  const apiUrl = landId ? `/api/message/${landId}` : "/api/message";
  const dataList = await getPosts(apiUrl);
  console.log("BoadAc", dataList);
  setDetaList(dataList); // localStorageにデータをセット

  return <CardLoop dataList={dataList} />;
};

export default memo(BoadAc);
