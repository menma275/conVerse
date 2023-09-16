import { useEffect, useState, memo } from "react";

import Card from "@/components/card";
import LoadingDots from "@/components/loading-dots";

const Boad = () => {
  const [dataList, setDatalist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  let jsonString = "";
  let loadtime = 0;

  const createCards = (data) => {
    let newdata = [];

    data.map((value) => {
      let receiveDate = new Date(
        value.timestamp.toLocaleString({ timeZone: "Asia/Tokyo" })
      );
      let date =
        receiveDate.getFullYear() +
        "-" +
        (receiveDate.getMonth() + 1) +
        "-" +
        receiveDate.getDate();
      let today = new Date(
        new Date().toLocaleString({ timeZone: "Asia/Tokyo" })
      );
      let todayDate =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
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
    setDatalist((prevdata) => [...prevdata, ...newdata]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (dataList) {
      localStorage.removeItem("dataList");
      jsonString = JSON.stringify(dataList);
      console.log(jsonString);
      localStorage.setItem("dataList", jsonString);
    }
  }, [dataList]);
  /*
  useEffect(() => {
    console.log(isLoading);
    console.log(datalist);
  }, [isLoading]);
*/
  useEffect(() => {
    if (loadtime == 0) {
      fetch("/api/message")
        .then((res) => res.json())
        .then((data) => {
          createCards(data);
        })
        .catch((error) => console.error("Error:", error));
      loadtime++;
    }
  }, []);
  return <>{isLoading ? <LoadingDots /> : <Card dataList={dataList} />}</>;
};
export default memo(Boad);
