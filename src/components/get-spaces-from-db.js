import SpaceLoop from "@/components/space-loop";
import React from "react";
import { Suspense } from "react";
import LoadingSpinner from "@/components/loading/loading-spinner";

const getSpaces = async () => {
  //BaseURLを設定
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/space`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const posts = await createSpaces(data);
      return posts;
    } else {
      console.error("Failed to fetch space data:", res.status, res.statusText);
    }
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
};

const createSpaces = async (data) => {
  let newdata = [];

  data.map((value) => {
    let json = "";
    if (value.info) {
      //console.log(value.info);
      json = JSON.parse(value.info);
      json.spaceId = value.spaceId;
      newdata.push(json);
    } else {
      json = "NULL";
    }
  });

  return newdata;
};

const GetSpacesFromDb = async () => {
  const spaceList = await getSpaces();
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <SpaceLoop spaceList={spaceList} />
      </Suspense>
    </>
  );
};
export default GetSpacesFromDb;
