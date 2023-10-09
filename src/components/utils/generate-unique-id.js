"use client";
import { useContext, useEffect } from "react";
import { UserIdContext } from "@/context/userid-context";
import { v4 as uuidv4 } from "uuid";

const GenerateUniqueId = () => {
  const { setUserId } = useContext(UserIdContext);

  useEffect(() => {
    // ページが読み込まれたときに一意のIDを生成
    const uniqueId = uuidv4();

    // 生成したIDをContextに設定
    setUserId(uniqueId);
  }, [setUserId]);

  // 一意のIDを生成するためのコンポーネントは何も表示しない
  return null;
};

export default GenerateUniqueId;
