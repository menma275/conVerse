import { memo } from "react";

const Card = async () => {
  let dataList = [];
  const res = await fetch("/api/message", { cache: "no-store" });
  const posts = await res.json();
  posts.map((data) => {
    let receiveDate = new Date(data.timestamp.toLocaleString({ timeZone: "Asia/Tokyo" }));
    let date = receiveDate.getFullYear() + "-" + (receiveDate.getMonth() + 1) + "-" + receiveDate.getDate();
    let today = new Date(new Date().toLocaleString({ timeZone: "Asia/Tokyo" }));
    let todayDate = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    if (date == todayDate) dataList.push(JSON.parse(data.message));
  });

  return (
    <>
      {dataList.map((card, index) => (
        <div className="card" key={index} style={{ left: card.pos.x, top: card.pos.y, boxShadow: card.color + "0px 0px 1rem 0.1rem" }}>
          {card.text}
        </div>
      ))}
    </>
  );
};
export default memo(Card);
