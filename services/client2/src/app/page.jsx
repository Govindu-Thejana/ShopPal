"use client";

import Image from "next/image";
import Link from "next/link";

import HeroImg from "../../public/girl.png"; // Replace with model/fashion banner
import { Plus, Section } from "lucide-react";
import { ProductContext } from "../context/ProductContext";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function LandingPage() {
  const { products } = useContext(ProductContext);
  const { addToCart } = useContext(CartContext);

  return (
    <div className="flex flex-col min-h-screen mx-auto max-w-[1920px]">
      {/* Navbar */}
      <header className="w-full flex justify-between items-center px-6 md:px-20 py-4 bg-white shadow-md fixed top-0 z-50   mx-auto max-w-[1920px]">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gray-800">ShopPal</span>
        </div>
        <nav className="hidden md:flex gap-8 font-medium text-gray-700">
          <Link href="/shop" className="hover:text-pink-600">
            Shop
          </Link>
          <Link href="/shop/men" className="hover:text-pink-600">
            Men
          </Link>
          <Link href="/shop/women" className="hover:text-pink-600">
            Women
          </Link>
          <Link href="/shop/kids" className="hover:text-pink-600">
            Kids
          </Link>
        </nav>
        <div className="flex gap-4 ">
          <Link
            href="/login"
            className="px-4 py-2 border border-gray-800 rounded-md hover:bg-gray-800 hover:text-white transition"
          >
            Sign In
          </Link>
          <Link
            href="/shop"
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-500 transition"
          >
            Shop Now
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="h-screen flex flex-col md:flex-row items-center justify-between px-6 md:px-20 pt-24 bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 text-white">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Fashion That <span className="text-yellow-300">Defines You</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-lg">
            Discover the latest trends, premium collections, and timeless
            styles. Elevate your wardrobe with ShopPal today.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <Link
              href="/shop"
              className="px-6 py-3 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition duration-300"
            >
              Explore Collection
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition duration-300"
            >
              Join Us
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <Image
            src={HeroImg}
            alt="Fashion Hero"
            width={900}
            height={900}
            priority
            className="rounded-xl "
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-6 md:px-20 bg-gray-50 text-gray-800">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Men", img: "/men.jpg" },
            { name: "Women", img: "/wom.jpg" },
            { name: "Kids", img: "/kid.jpg" },
            { name: "Accessories", img: "/access.jpg" },
          ].map((cat, i) => (
            <Link
              key={i}
              href={`/shop/${cat.name.toLowerCase()}`}
              className="relative group rounded-xl overflow-hidden shadow-lg"
            >
              <Image
                src={cat.img}
                alt={cat.name}
                width={300}
                height={300}
                className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-2xl opacity-0 group-hover:opacity-100 transition">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Section className="w-12 h-12 text-gray-300 mx-auto mt-10 animate-bounce" />

      {/* All Products */}
      <div className="py-20 px-6 md:px-20">
        <h2 className="text-2xl font-bold mb-6">New Arrivals</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10">
          {products.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={300}
                height={200}
                className="rounded-lg object-cover"
              />
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">
                    ${item.price.toFixed(2)}
                  </h2>
                  <button
                    className="flex items-center gap-1 bg-green-100 hover:bg-green-200 rounded-md px-2 py-1 cursor-pointer"
                    onClick={() => addToCart(item)}
                  >
                    <Plus className="w-4 h-4 text-green-600 font-bold" />
                    <span className="text-sm text-green-600 font-bold">
                      Add to cart
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-20 bg-white text-gray-800">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose ShopPal?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-gray-100 p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">🚚 Fast Delivery</h3>
            <p>
              Get your outfits delivered quickly and safely to your doorstep.
            </p>
          </div>
          <div className="bg-gray-100 p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">✨ Trendy Styles</h3>
            <p>Stay ahead of the curve with our latest fashion collections.</p>
          </div>
          <div className="bg-gray-100 p-8 rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">🔄 Easy Returns</h3>
            <p>Shop stress-free with our flexible return & exchange policy.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-20 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Upgrade Your Wardrobe Today
        </h2>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of fashion-forward customers. Get exclusive offers and
          shop the best deals on premium clothing now.
        </p>
        <Link
          href="/shop"
          className="px-8 py-4 bg-yellow-400 text-black rounded-xl font-bold text-lg hover:bg-yellow-300 transition duration-300"
        >
          Start Shopping
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-6 md:px-20">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} ShopPal. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white">
              Facebook
            </Link>
            <Link href="#" className="hover:text-white">
              Instagram
            </Link>
            <Link href="#" className="hover:text-white">
              Twitter
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
