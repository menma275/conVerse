import { Inter as FontSans } from "next/font/google";
import "@/styles/globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const meta = {
  title: "Next.js Realtime chat with socket.IO",
  description: "Brought to you by NextJs, SocketIO and Me",
};

export const metadata = {
  title: meta.title,
  description: meta.description,
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <main className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]">{children}</main>
      </body>
    </html>
  );
}
