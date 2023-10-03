import React, { memo } from "react";
import Land from "@/components/land";

const getLands = async () => {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  try {
    const res = await fetch(`${baseUrl}/api/land`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const posts = await createLands(data);
      return posts;
    } else {
      console.error("Failed to fetch land data:", res.status, res.statusText);
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
};

const createLands = async (data) => {
  let newdata = [];

  data.map((value) => {
    let json = "";
    if (value.info) {
      //console.log(value.info);
      json = JSON.parse(value.info);
      json.landId = value.landId;
      newdata.push(json);
    } else {
      json = "NULL";
    }
  });

  return newdata;
};

const LandLoop = async (Props) => {
  const landList = await getLands();

  return (
    <>
      {landList &&
        landList.map((data, index) => (
          <Land
            landInfo={data}
            key={data.landId}
            landkey={data.landId}
            style={{
              left: `${index * 50 + 50}px`, // 左に10pxずつずらす
              top: `${index * 50 + 50}px`, // 上に10pxずつずらす
            }}
          />
        ))}
    </>
  );
};
export default memo(LandLoop);
