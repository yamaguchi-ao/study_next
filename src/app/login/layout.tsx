import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "login",
  description: "login",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className=""
      >
        {children}
      </body>
    </html>
  );
}