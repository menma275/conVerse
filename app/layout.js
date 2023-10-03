import { Inter as FontSans } from "next/font/google";
import "@/styles/globals.css";
import { SocketProvider } from "@/context/socketContext";
import { LandEntranceProvider } from "@/context/landEntranceContext";

// Google FontsからSans Fontを設定
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

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
          {/* ソケット機能のためにアプリをSocketProviderでラップ */}
          <SocketProvider>
            {/* LandEntranceの状態管理のためにアプリをLandEntranceProviderでラップ */}
            <LandEntranceProvider>{children}</LandEntranceProvider>
          </SocketProvider>
        </main>
      </body>
    </html>
  );
}
