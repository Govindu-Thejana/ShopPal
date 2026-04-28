"use client";

import Link from "next/link";
import { useContext, useMemo } from "react";

import { ProductContext } from "../../context/ProductContext";

export default function ShopPage() {
  const { products } = useContext(ProductContext);

  const categories = useMemo(() => {
    const values = products.map((p) => p.category?.toLowerCase()).filter(Boolean);
    return [...new Set(values)];
  }, [products]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-4xl font-bold text-gray-900">Shop Categories</h1>
      <p className="mt-3 text-gray-600">Choose a category to browse products.</p>

      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/shop/${category}`}
            className="rounded-lg border border-gray-200 bg-white p-5 text-center capitalize shadow-sm transition hover:border-pink-300 hover:text-pink-600"
          >
            {category}
            <p className="mt-1 text-xs text-gray-500">{products.filter((p) => p.category?.toLowerCase() === category).length} products</p>
          </Link>
        ))}
      </div>

      {categories.length === 0 && <p className="mt-8 text-gray-600">No categories yet. Add products from admin.</p>}
    </main>
  );
}
