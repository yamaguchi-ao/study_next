import ToastProvider from "@/lib/react-toastify";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { cookies } from "next/headers";

export default async function RootLayout({
  children }: Readonly<{
    children: React.ReactNode;
  }>) {

  const isLogin = await hasToken().then();

  return (
    <html lang="ja">
      <body className="h-screen">
        <ToastProvider>
          {isLogin ? <Header></Header> : ""}
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

async function hasToken() {
  const cookie = await cookies();
  const token = cookie.has("auth_token");
  return token;
}