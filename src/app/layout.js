// src/app/layout.js
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "../context/CartContext";

// Load Google Fonts with CSS variable setup
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });


export const metadata = {
  title: 'Instagram Style Feed | MeshUp',
  description:
    'Explore emotional and expressive Instagram-style meme posts. Like, comment, and enjoy the fun on MeshUp.',
  openGraph: {
    title: 'Instagram Style Feed | MeshUp',
    description:
      'Engage with trending memes and hilarious content on MeshUp Instagram-style feed.',
    url: 'https://meshup.app/product',
    siteName: 'MeshUp',
    images: [
      {
        url: 'https://meshup.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MeshUp Feed',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Instagram Style Feed | MeshUp',
    description:
      'Like, comment, and discover the funniest memes on MeshUp viral content feed.',
    images: ['https://meshup.app/og-image.jpg'],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-white text-gray-900">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
