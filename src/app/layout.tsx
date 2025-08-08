import type { Metadata } from "next";
import ToastProvider from "@/lib/react-toastify";
import "./globals.css";

export const metadata: Metadata = {
  title: "Study Next.js",
  description: "Study Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
