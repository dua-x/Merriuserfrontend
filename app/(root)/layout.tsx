import type { Metadata } from "next";
import "../globals.css";
import Navbar from '@/components/Navbar';
import ContactUs from '@/components/ContactUs';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: {
    default: "MEERI Store",
    template: "%s | MEERI Store"
  },
  description: "Découvrez nos collections exclusives de vêtements qui allient confort, style et modernité.",
  metadataBase: new URL('https://meeristore.store'),
  keywords: ["vêtements", "mode", "fashion", "MEERI", "Algeria", "boutique", "women clothing","robe","chemise" ],
  authors: [{ name: "MEERI Store" }],
  creator: "MEERI Store",
  publisher: "MEERI Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://meeristore.store",
    siteName: "MEERI Store",
    title: "MEERI Store - Élégance et Qualité",
    description: "Élégance et Qualité pour Chaque Femme - Parce que chaque femme mérite de se sentir belle et confiante.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "MEERI Store Logo",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "MEERI Store - Élégance et Qualité",
    description: "Découvrez nos collections exclusives de vêtements",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification here
    // google: "your-verification-code",
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'icon',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  manifest: '/site.webmanifest', // If you have a web manifest
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr"> {/* Changed to French since your content is in French */}
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "MEERI Store",
              "description": "Boutique de vêtements pour femmes en Algérie",
              "url": "https://meeristore.store",
              "telephone": "+213-770-090-610",
              "email": "meeriproject@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "Algeria"
              }
            })
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <ContactUs />
      
        {/* Vercel Analytics and Speed Insights */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}