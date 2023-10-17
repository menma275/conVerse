import "@/styles/globals.css";
import { OpenSpaceIdProvider } from "@/context/open-space-id-context";
import { ActiveSpaceIndexProvider } from "@/context/active-space-index-context";
import { UserIdProvider } from "@/context/userid-context";
import { CardProvider } from "@/context/card-context";
import { DraggingProvider } from "@/context/use-dragging-context";
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
          {/* SpaceEntranceの状態管理のためにアプリをSpaceEntranceProviderでラップ */}
          <UserIdProvider>
            <GenerateUniqueId />
            <OpenSpaceIdProvider>
              <ActiveSpaceIndexProvider>
                <DraggingProvider>
                  <CardProvider>{children}</CardProvider>{" "}
                </DraggingProvider>
              </ActiveSpaceIndexProvider>
            </OpenSpaceIdProvider>
          </UserIdProvider>
        </main>
      </body>
    </html>
  );
}
