import LandLoop from "@/components/land-loop";
import React from "react";
import { Suspense } from "react";
import LoadingSpinner from "@/components/loading/loading-spinner";

const getLands = async () => {
  //BaseURLを設定
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
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

const GetLandsDbAs = async () => {
  const landList = await getLands();
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <LandLoop landList={landList} />
      </Suspense>
    </>
  );
};
export default GetLandsDbAs;
