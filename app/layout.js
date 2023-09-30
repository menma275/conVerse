import { Inter as FontSans } from "next/font/google";
import "@/styles/globals.css";
import { SocketProvider } from "@/context/SocketContext";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const meta = {
  title: "Next.js Realtime chat with socket.IO",
  description: "Brought to you by NextJs, SocketIO and Me",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export const metadata = {
  title: meta.title,
  description: meta.description,
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <main className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]">
          <SocketProvider>{children}</SocketProvider>
        </main>
      </body>
    </html>
  );
}
