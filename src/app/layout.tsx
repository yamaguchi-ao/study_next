import ToastProvider from "@/lib/react-toastify";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { getCookies } from "./actions/action";
import { Suspense } from "react";
import Loading from "./loading";

export default async function RootLayout({
  children }: Readonly<{
    children: React.ReactNode;
  }>) {

  const user = await getCookies();
  const username = user?.name;

  return (
    <html lang="ja">
      <body className="h-screen">
        <ToastProvider>
            {username ? <Header username={username} /> : <></>}
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}