import type { Metadata } from "next";
import "../globals.css";
import Navbar from '@/components/Navbar';
import ContactUs from '@/components/ContactUs';

export const metadata: Metadata = {
  title: "MEERI Store | Élégance et Qualité pour Chaque Femme",
  description: "Découvrez nos collections exclusives de vêtements qui allient confort, style et modernité.",
  openGraph: {
    title: "MEERI Store",
    description: "Parce que chaque femme mérite de se sentir belle et confiante.",
    images: [{
      url: "/logo.png", // Ensure this path is correct
      alt: "MEERI Store Logo",
    }]
  }
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
