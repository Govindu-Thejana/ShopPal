"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { House, ShoppingCart } from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Link from "next/link";

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
    <QueryClientProvider client={queryClient}>
      <div
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-[1920px] mx-auto px-16 lg:px-0`}
      >
        <nav className="flex justify-between items-center py-4 mb-8 px-5 shadow-lg">
          <div className="flex items-center gap-4">
            {/* <Image src="/logo.png" alt="logo" width={50} height={50} /> */}
            <Link href="/" className="text-2xl font-black">
              Shop Mate
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-2xl font-black">
              <House />
            </Link>
            <Link href="/cart" className="text-2xl font-black">
              <ShoppingCart />
            </Link>
            {/* <House className="w-6 h-6 cursor-pointer" href="/dashboard" />
            <ShoppingCart className="w-6 h-6 cursor-pointer" href="/cart" /> */}
            {/* <Image
              src="/avatar.png"
              alt="avatar"
              width={32}
              height={32}
              className="rounded-full border border-gray-300"
            /> */}
          </div>
        </nav>
        {children}
      </div>
    </QueryClientProvider>
  );
}
