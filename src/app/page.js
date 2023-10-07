import Header from "@/components/parts/header";
import CreateButton from "@/components/parts/create-button";
import GetLandsDbAs from "@/components/get-lands-db-as";
import React from "react";
/**
 * Indexコンポーネントはアプリケーションのメインページをレンダリングします。
 * ヘッダー、部屋の開閉、及び作成ボタンの3つの主要なコンポーネントで構成されています。
 */
const Index = () => {
  return (
    <>
      {/* ヘッダーコンポーネント */}
      <Header />

      {/* ランドコンテナー: 主要なコンテンツ領域 */}
      <div className="land-container min-h-[calc(100vh-50px)] md:min-h[calc(100vh-50px)]">
        <GetLandsDbAs />
        {/* 部屋の作成ボタンコンポーネント */}
        <CreateButton />
      </div>
    </>
  );
};

// Indexコンポーネントをエクスポート
export default Index;
