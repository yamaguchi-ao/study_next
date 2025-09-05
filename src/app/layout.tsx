import ToastProvider from "@/lib/react-toastify";
import "./globals.css";

export default function RootLayout({
  children }: Readonly<{
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
