import Header from "@/components/parts/header";
import Footer from "@/components/parts/footer";
import React from "react";

import SpaceLoop from "@/components/space-loop";
import { Suspense } from "react";
import { getSpaces } from "@/components/get-spaces-from-db";
import LoadingSpinner from "@/components/loading/loading-spinner";
import TabManager from "@/components/parts/tab-manager";
/**
 * Indexコンポーネントはアプリケーションのメインページをレンダリングします。
 * ヘッダー、部屋の開閉、及び作成ボタンの3つの主要なコンポーネントで構成されています。
 */
const Index = async () => {
  const spaceList = await getSpaces(1);
  return (
    <>
      {/* ヘッダーコンポーネント */}
      {/* <Header /> */}

      {/* ランドコンテナー: 主要なコンテンツ領域 */}
      <div className="space-container min-h-[calc(100vh-50px)] md:min-h[calc(100vh-50px)]">
        <Suspense fallback={<LoadingSpinner />}>
          <SpaceLoop spaceList={spaceList} />
        </Suspense>
      </div>

      {/* フッターコンポーネント */}
      <Footer>
        <TabManager spaceList={spaceList} />
      </Footer>
    </>
  );
};

// Indexコンポーネントをエクスポート
export default Index;
