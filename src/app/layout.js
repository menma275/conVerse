import "@/styles/globals.css";
import { OpenLandIdProvider } from "@/context/open-land-id-context";
import { ActiveLandIndexProvider } from "@/context/active-land-index-context";
import { UserIdProvider } from "@/context/userid-context";
import GenerateUniqueId from "@/components/utils/generate-unique-id";
import React from "react";

// アプリのメタ情報
const META_INFO = {
  TITLE: "Gundi",
  DESCRIPTION: "decentralized chat space",
  VIEWPORT: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

// 外部での利用のためにエクスポートされたメタデータ
export const metadata = {
  title: META_INFO.TITLE,
  description: META_INFO.DESCRIPTION,
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        {/* メインコンテンツ領域 */}
        <main className="h-full">
          {/* LandEntranceの状態管理のためにアプリをLandEntranceProviderでラップ */}
          <UserIdProvider>
            <GenerateUniqueId />
            <OpenLandIdProvider>
              <ActiveLandIndexProvider>{children}</ActiveLandIndexProvider>
            </OpenLandIdProvider>
          </UserIdProvider>
        </main>
      </body>
    </html>
  );
}
