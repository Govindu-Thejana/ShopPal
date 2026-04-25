"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";

import { CartProvider } from "../context/CartContext";
import { ProductProvider } from "../context/ProductContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const queryClient = new QueryClient();
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-[1920px] mx-auto px-16 lg:px-0`}
        >
          <ProductProvider>
            <CartProvider>
              {children}
              {/* Toast notifications */}
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </CartProvider>
          </ProductProvider>
        </body>
      </QueryClientProvider>
    </html>
  );
}
