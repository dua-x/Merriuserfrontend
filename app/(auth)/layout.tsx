import type { Metadata } from "next";
import "../globals.css";


export const metadata: Metadata = {
  title: "Merri - Store Auth",
  description: "next.js 14 Merri Ecomerce store ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <div className="flex max-lg:flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
