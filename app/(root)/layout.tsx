import type { Metadata } from "next";
import "../globals.css";
import Navbar from '@/components/Navbar';
import ContactUs from '@/components/ContactUs';

export const metadata: Metadata = {
  title: "Merri Store",
  description: "Merri Ecomerce Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <ContactUs />
      </body>
    </html>
  );
}
