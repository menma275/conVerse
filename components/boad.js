//カードを本日分のみに
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
    let today = new Date(new Date().toLocaleString({ timeZone: "Asia/Tokyo" }));
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

  return newdata;
};

//localStorageにデータをセット
const setDetaList = (dataList) => {
  localStorage.removeItem("dataList");
  const jsonString = JSON.stringify(dataList);
  localStorage.setItem("dataList", jsonString);
};

//apiからカードの情報を取得
async function getPosts() {
  try {
    const res = await fetch("/api/message", { cache: "no-store" });
    const data = await res.json();
    const posts = await createCards(data);
    console.log("posts" + posts);
    return posts;
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

const Boad = async () => {
  const dataList = await getPosts();
  console.log(dataList);
  setDetaList(dataList);
  return (
    <>
      {dataList.map((data, index) => (
        <div
          className="card"
          key={index}
          style={{
            left: data?.pos?.x,
            top: data?.pos?.y,
            boxShadow: "0px 0px 0.25rem 0.05rem" + data?.color,
          }}
        >
          {data?.text}
        </div>
      ))}
    </>
  );
};
export default Boad;
