import { useEffect, useState, memo } from "react";
import Card from "@/components/card";
import LoadingDots from "@/components/loading-dots";

const Boad = () => {
  const [datalist, setDatalist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    setDatalist((prevdata) => [...prevdata, ...newdata]);
    setIsLoading(false);
  };

  /*
  useEffect(() => {
    console.log(isLoading);
    console.log(datalist);
  }, [isLoading]);
*/
  useEffect(() => {
    fetch("/api/message")
      .then((res) => res.json())
      .then((data) => {
        createCards(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);
  return (
    <>
      (isLoading ? <LoadingDots /> : <Card datalist={datalist} />)
    </>
  );
};
export default memo(Boad);