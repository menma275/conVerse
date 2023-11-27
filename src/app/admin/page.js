import Header from "@/components/parts/header";
import Footer from "@/components/parts/footer";
import CreateButton from "@/components/parts/create-button";
import GetSpacesFromDb from "@/components/get-spaces-from-db";
import React from "react";
/**
 * Indexコンポーネントはアプリケーションのメインページをレンダリングします。
 * ヘッダー、部屋の開閉、及び作成ボタンの3つの主要なコンポーネントで構成されています。
 */
const Index = () => {
  return (
    <>
      {/* ヘッダーコンポーネント */}
      {/* <Header /> */}

      {/* ランドコンテナー: 主要なコンテンツ領域 */}
      <div className="space-container min-h-[calc(100vh-50px)] md:min-h[calc(100vh-50px)]">
        <GetSpacesFromDb max_spaces="10" />

        {/* 部屋の作成ボタンコンポーネント */}
        {/* <CreateButton /> */}
      </div>

      {/* フッターコンポーネント */}
      <Footer />
    </>
  );
};

// Indexコンポーネントをエクスポート
export default Index;
