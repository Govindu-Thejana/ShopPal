"use client";

import Image from "next/image";
import React, { useContext } from "react";

import OrderSummary from "../../../components/OrderSummary";
import { CartContext } from "../../../context/CartContext";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const total = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);

  return (
    <div>
      {/* <CheckoutPage /> */}
      <div className="flex ">
        <div className="p-6 w-2/3 ">
          <div className="flex justify-between pb-4">
            <h1 className="text-3xl font-bold">Your Cart</h1>
            <button
              onClick={clearCart}
              className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded cursor-pointer"
            >
              Clear Cart
            </button>
          </div>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-16 w-full">
                {cart.map((item) => (
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
                      <h2 className="text-lg font-bold">{item.name}</h2>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between p-2">
                        <h2 className="text-lg font-bold text-gray-800 text-center">
                          ${item.price.toFixed(2)}
                        </h2>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="w-full lg:w-1/3 pt-20 ">
          <OrderSummary total={total} hasItems={cart.length > 0} />
        </div>
      </div>
    </div>
  );
}
