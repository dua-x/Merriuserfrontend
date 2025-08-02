import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "MEERI Store | Élégance et Qualité pour Chaque Femme",
  description: "Découvrez nos collections exclusives de vêtements qui allient confort, style et modernité.",
  openGraph: {
    title: "MEERI Auth",
    description: "Parce que chaque femme mérite de se sentir belle et confiante.",
    images: [{
      url: "/logo.png", // Ensure this path is correct
      alt: "MEERI Store Logo",
    }]
  }
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
