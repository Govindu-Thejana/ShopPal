"use client";

import Image from "next/image";
import Link from "next/link";

import HeroImg from "../../public/girl.png"; // Replace with model/fashion banner
import {
  ArrowRight,
  Compass,
  Plus,
  RefreshCcw,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { ProductContext } from "../context/ProductContext";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function LandingPage() {
  const { products } = useContext(ProductContext);
  const { addToCart, cart } = useContext(CartContext);

  const categories = [
    { name: "Men", img: "/men.jpg", href: "/shop/men" },
    { name: "Women", img: "/wom.jpg", href: "/shop/women" },
    { name: "Kids", img: "/kid.jpg", href: "/shop/kids" },
    { name: "Accessories", img: "/access.jpg", href: "/shop" },
  ];

  return (
    <main className="min-h-screen bg-[#f8f6ef] text-zinc-900 [font-family:Poppins,Manrope,ui-sans-serif,sans-serif]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-[#ffd28a]/50 blur-3xl" />
        <div className="absolute right-0 top-20 h-[26rem] w-[26rem] rounded-full bg-[#8ec5b2]/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#ff9b7a]/35 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-[#f8f6ef]/85 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-5 py-4 md:px-10">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-zinc-900"
          >
            ShopPal
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-semibold text-zinc-600 md:flex">
            <Link href="/shop" className="transition hover:text-zinc-900">
              Shop
            </Link>
            <Link href="/shop/men" className="transition hover:text-zinc-900">
              Men
            </Link>
            <Link href="/shop/women" className="transition hover:text-zinc-900">
              Women
            </Link>
            <Link href="/shop/kids" className="transition hover:text-zinc-900">
              Kids
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400"
            >
              <ShoppingBag className="h-4 w-4" />
              Cart
              {cart.length > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1.5 text-xs font-bold text-white">
                  {cart.length}
                </span>
              )}
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-white"
            >
              Sign In
            </Link>
            <Link
              href="/shop"
              className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-10 px-5 pb-14 pt-14 md:grid-cols-2 md:items-center md:px-10 md:pt-16">
        <div className="space-y-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600">
            <Sparkles className="h-4 w-4 text-[#f2875b]" />
            Modern Everyday Style
          </span>
          <h1 className="text-5xl font-black leading-[0.95] tracking-tight text-zinc-900 md:text-7xl">
            Bold looks for the way you live.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-zinc-600 md:text-lg">
            Discover curated drops, premium essentials, and seasonal edits built
            for comfort and confidence. ShopPal blends trend and utility in one
            clean experience.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-zinc-700"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-bold text-zinc-700 transition hover:border-zinc-500"
            >
              Join ShopPal
            </Link>
          </div>
          <div className="grid max-w-md grid-cols-3 gap-3 pt-1 text-center">
            <div className="rounded-2xl border border-zinc-200 bg-white p-3">
              <p className="text-xl font-black">12k+</p>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Happy Buyers
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-3">
              <p className="text-xl font-black">350+</p>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                New Arrivals
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-3">
              <p className="text-xl font-black">24h</p>
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                Dispatch
              </p>
            </div>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -right-5 -top-5 h-28 w-28 rounded-3xl bg-[#8ec5b2]/70" />
          <div className="absolute -bottom-8 -left-7 h-24 w-24 rounded-full border-8 border-[#f8f6ef] bg-[#ffd28a]" />
          <div className="relative overflow-hidden rounded-[2.25rem] border border-zinc-200 bg-white p-3 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.35)]">
            <Image
              src={HeroImg}
              alt="Fashion Hero"
              width={1000}
              height={1100}
              priority
              className="h-[560px] w-full rounded-[1.8rem] object-cover"
            />
            <div className="absolute bottom-8 left-8 rounded-2xl bg-white/90 px-4 py-3 shadow-md backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">
                New Drop
              </p>
              <p className="text-lg font-black text-zinc-900">
                Spring Studio 26
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-5 py-12 md:px-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
              Shop by Category
            </p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              Find your signature fit
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden text-sm font-bold text-zinc-600 transition hover:text-zinc-900 md:inline-flex"
          >
            View all categories
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white"
            >
              <Image
                src={cat.img}
                alt={cat.name}
                width={600}
                height={740}
                className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-white/90 px-3 py-2 backdrop-blur">
                <p className="text-sm font-black text-zinc-900">{cat.name}</p>
                <ArrowRight className="h-4 w-4 text-zinc-600" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-5 py-14 md:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-500">
              New Arrivals
            </p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              Fresh picks this week
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-bold text-zinc-700 transition hover:border-zinc-500"
          >
            Browse More
            <Compass className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((item) => (
            <article
              key={item.id}
              className="group rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="overflow-hidden rounded-2xl">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={500}
                  height={600}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 p-2 pt-4">
                <h3 className="line-clamp-1 text-lg font-black text-zinc-900">
                  {item.name}
                </h3>
                <p className="line-clamp-2 text-sm text-zinc-500">
                  {item.description}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <p className="text-base font-extrabold text-zinc-900">
                    ${item.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => addToCart(item)}
                    className="inline-flex items-center gap-1 rounded-full bg-[#e9f8f1] px-3 py-1.5 text-sm font-bold text-[#1a7f55] transition hover:bg-[#d4f1e4]"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-5 pb-16 pt-4 md:px-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-zinc-200 bg-white p-7">
            <Truck className="mb-4 h-7 w-7 text-[#f2875b]" />
            <h3 className="text-xl font-black">Fast Delivery</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Same-day dispatch on most orders, with end-to-end tracking from
              checkout to doorstep.
            </p>
          </article>
          <article className="rounded-3xl border border-zinc-200 bg-white p-7">
            <Sparkles className="mb-4 h-7 w-7 text-[#f2875b]" />
            <h3 className="text-xl font-black">Curated Trends</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Handpicked edits built around fit, quality, and wearable style.
            </p>
          </article>
          <article className="rounded-3xl border border-zinc-200 bg-white p-7">
            <RefreshCcw className="mb-4 h-7 w-7 text-[#f2875b]" />
            <h3 className="text-xl font-black">Easy Returns</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Hassle-free returns and exchange support when the fit is not quite
              right.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-5 pb-14 md:px-10">
        <div className="relative overflow-hidden rounded-[2rem] bg-zinc-900 px-6 py-12 text-center text-zinc-100 md:px-12">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#ffd28a]/30 blur-2xl" />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-[#8ec5b2]/35 blur-2xl" />
          <h2 className="text-3xl font-black md:text-4xl">
            Build your next signature outfit
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300 md:text-base">
            Join a growing community of style-first shoppers and unlock early
            access to exclusive drops and member-only offers.
          </p>
          <Link
            href="/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#ffd28a] px-7 py-3 text-sm font-black text-zinc-900 transition hover:bg-[#ffc466]"
          >
            Start Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-zinc-200 px-5 py-8 md:px-10">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-4 text-sm text-zinc-600 md:flex-row">
          <p>
            Copyright {new Date().getFullYear()} ShopPal. All rights reserved.
          </p>
          <div className="flex items-center gap-5 font-semibold">
            <Link href="#" className="transition hover:text-zinc-900">
              Facebook
            </Link>
            <Link href="#" className="transition hover:text-zinc-900">
              Instagram
            </Link>
            <Link href="#" className="transition hover:text-zinc-900">
              Twitter
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
