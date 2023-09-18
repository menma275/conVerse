//import { useEffect, useState, memo } from "react";
import Card from "@/components/card";
//import LoadingDots from "@/components/loading-dots";
let loadtime = 0;

const createCards = (data) => {
  let newdata = [];

  data.map((value) => {
    let receiveDate = new Date(value.timestamp.toLocaleString({ timeZone: "Asia/Tokyo" }));
    let date = receiveDate.getFullYear() + "-" + (receiveDate.getMonth() + 1) + "-" + receiveDate.getDate();
    let today = new Date(new Date().toLocaleString({ timeZone: "Asia/Tokyo" }));
    let todayDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    let json = "";
    if (value.message) {
      json = JSON.parse(value.message);
    } else {
      json = "NULL";
    }
    if (date == todayDate) {
      newdata.push(json);
    }
  });

  return newdata;
};

async function getPosts() {
  try {
    const res = await fetch("/api/message");
    const data = await res.json();
    const posts = await createCards(data);
    //console.log(posts);
    return posts;
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

async function setDetaList(dataList) {
  localStorage.removeItem("dataList");
  const jsonString = JSON.stringify(dataList);
  localStorage.setItem("dataList", jsonString);
}

const Boad = async () => {
  // const [dataList, setDatalist] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);

  if (loadtime == 0) {
    loadtime++;
    const dataList = await getPosts();
    console.log(dataList);
    //await setDetaList(dataList);
    if (!dataList || dataList.length === 0) {
      console.log("No contents");
    }
    return <>{<Card dataList={dataList} />}</>;
  }
};
export default Boad;
