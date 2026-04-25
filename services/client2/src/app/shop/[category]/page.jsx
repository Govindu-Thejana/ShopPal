"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

import { CartContext } from "../../../context/CartContext";
import { ProductContext } from "../../../context/ProductContext";

export default function CategoryPage({ params }) {
  const category = params?.category?.toLowerCase();
  const { addToCart } = useContext(CartContext);
  const { products } = useContext(ProductContext);

  const filteredProducts = products.filter(
    (item) => item.category?.toLowerCase() === category
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-4xl font-bold capitalize text-gray-900">
        {category} Collection
      </h1>
      <p className="mt-3 text-gray-600">
        Browse and add products directly to your cart.
      </p>

      {filteredProducts.length === 0 ? (
        <p className="mt-8 text-gray-600">
          No products found in this category.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-gray-200 p-4 shadow-sm transition hover:shadow-md"
            >
              <Image
                src={item.image}
                alt={item.name}
                width={300}
                height={220}
                className="h-52 w-full rounded-md object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold">{item.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{item.description}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold">
                  ${Number(item.price).toFixed(2)}
                </span>
                <button
                  className="flex items-center gap-1 rounded-md bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 hover:bg-green-200"
                  onClick={() => addToCart(item)}
                >
                  <Plus className="h-4 w-4" /> Add to cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link
        href="/shop"
        className="mt-8 inline-block rounded-md bg-pink-600 px-5 py-3 text-white transition hover:bg-pink-500"
      >
        Back to all categories
      </Link>
    </main>
  );
}
