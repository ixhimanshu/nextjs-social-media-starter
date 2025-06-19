// src/app/layout.js
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "../context/CartContext";

// Load Google Fonts with CSS variable setup
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata = {
  title: "Ecommerce NextJs App",
  description: "Buy your favorite products online.",
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
