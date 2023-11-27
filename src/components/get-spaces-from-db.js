import SpaceLoop from "@/components/space-loop";
import TabManager from "@/components/parts/tab-manager";
import React from "react";
import { Suspense } from "react";
import LoadingSpinner from "@/components/loading/loading-spinner";

const GetSpacesFromDb = async ({ max_spaces }) => {
  const getSpaces = async () => {
    //BaseURLを設定
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    try {
      const res = await fetch(`${baseUrl}/api/space`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        // データを逆順に並べ替え
        const reversedData = data.reverse();
        const posts = await createSpaces(reversedData);
        return posts;
      } else {
        console.error(
          "Failed to fetch space data:",
          res.status,
          res.statusText
        );
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  const createSpaces = async (data) => {
    let newdata = [];

    data.forEach((value, index) => {
      if (index < max_spaces && value.info) {
        const json = JSON.parse(value.info);
        json.spaceId = value.spaceId;
        newdata.push(json);
      }
    });

    return newdata;
  };

  const spaceList = await getSpaces();
  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        <SpaceLoop spaceList={spaceList} />
        <TabManager spaceList={spaceList} />
      </Suspense>
    </>
  );
};
export default GetSpacesFromDb;
