import Header from "@/components/parts/header";
import CreateButton from "@/components/parts/create-button";
import LandLoopAc from "@/components/landLoop-ac";
import { Suspense } from "react";
import LoadingSpinner from "@/components/loading/LoadingSpinner";
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
        <Suspense fallback={<LoadingSpinner />}>
          <LandLoopAc />
        </Suspense>

        {/* 部屋の作成ボタンコンポーネント */}
        <CreateButton />
      </div>
    </>
  );
};

// Indexコンポーネントをエクスポート
export default Index;
