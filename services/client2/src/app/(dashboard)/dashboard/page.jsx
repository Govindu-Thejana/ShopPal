"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { useContext } from "react";

import { CartContext } from "../../../context/CartContext";
import { ProductContext } from "../../../context/ProductContext";

function Page() {
  const { addToCart } = useContext(CartContext);
  const { products } = useContext(ProductContext);

  const deals = products.slice(0, 4);
  const otherProducts = products.slice(4);

  return (
    <div className="px-6 lg:px-16 mt-16">
      <div className="relative h-[400px] w-full bg-[url('/banner.jpg')] bg-cover bg-center flex items-center justify-center"></div>

      {/* Deals Section */}
      <div className="mt-12">
        <h1 className="text-2xl font-bold">🔥 Hot Deals</h1>
        <div className="flex flex-col lg:flex-row justify-between gap-16 mt-6">
          <div className="grid grid-cols-4 gap-16 w-full">
            {deals.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 border border-amber-400 rounded-[8px] items-center text-center"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={300}
                  height={200}
                  className="rounded-lg"
                  quality={100}
                />
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-lg font-bold text-gray-800 text-center">
                      ${item.price.toFixed(2)}
                    </h2>
                    <button
                      className="flex items-center gap-1 bg-green-100 hover:bg-green-200 rounded-md p-1 cursor-pointer"
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
      </div>

      {products.length === 0 && (
        <p className="mt-8 text-gray-600">
          No products found. Add products from admin.
        </p>
      )}

      {/* All Products */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">🛍️ All Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10">
          {otherProducts.map((item) => (
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
    </div>
  );
}

export default Page;
