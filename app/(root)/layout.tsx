import type { Metadata } from "next";
import "../globals.css";
import Navbar from '@/components/Navbar';
import ContactUs from '@/components/ContactUs';

export const metadata: Metadata = {
  title: "MEERI Store",
  description: "Your description here",
  metadataBase: new URL('https://meeristore.store'), // Fixes warning
  icons: {
    icon: '/favicon.ico', // Tab icon
    apple: '/apple-touch-icon.png', // For iOS devices
  },
  openGraph: {
    images: '/logo.png', // Social media preview
  },
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
