"use client";

<<<<<<< HEAD
import React, { useState } from "react";
import { useContext } from "react";
=======
import React, { useContext, useState } from "react";
>>>>>>> d4b4811181c02170531d9ecc36533f5963e49416
import { FaCcVisa, FaCcPaypal, FaGooglePay } from "react-icons/fa";
import { toast } from "react-toastify";

import Pay from "../../../components/Pay";
import { CartContext } from "../../../context/CartContext";

const CheckoutPage = () => {
  const [selectedPayment, setSelectedPayment] = useState("");
<<<<<<< HEAD
  const { cart, clearCart } = useContext(CartContext);
=======
  const { cart } = useContext(CartContext);
>>>>>>> d4b4811181c02170531d9ecc36533f5963e49416

  return (
    <div className=" bg-gray-50 flex justify-center py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white shadow rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-3">Shipping address</h2>
            <div>
              <p className="font-semibold">
                Deshan Gamage <span className="ml-2 text-gray-500">+94 7896 3356</span>
              </p>
              <p className="text-gray-600">No 4, Rahula road, Colombo 10, Sri Lanka</p>
            </div>
            <button className="text-blue-600 text-sm font-medium mt-2 hover:underline">Change</button>
          </div>

          <div className="bg-white shadow rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-3">Payment Methods</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" checked={selectedPayment === "visa"} onChange={() => setSelectedPayment("visa")} className="w-4 h-4" />
                <FaCcVisa className="text-blue-600 text-xl" />
                <span className="text-gray-700">924559******1099</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" checked={selectedPayment === "newcard"} onChange={() => setSelectedPayment("newcard")} className="w-4 h-4" />
                <span className="text-gray-700">Add a new card</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" checked={selectedPayment === "gpay"} onChange={() => setSelectedPayment("gpay")} className="w-4 h-4" />
                <FaGooglePay className="text-green-600 text-xl" />
                <span className="text-gray-700">Google Pay</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="payment" checked={selectedPayment === "paypal"} onChange={() => setSelectedPayment("paypal")} className="w-4 h-4" />
                <FaCcPaypal className="text-blue-500 text-xl" />
                <span className="text-gray-700">PayPal</span>
              </label>
            </div>
          </div>

          <div className="bg-white shadow rounded-2xl p-5">
            <h2 className="text-lg font-semibold mb-3">Shipping method</h2>
            <p className="text-gray-700">
              Shipping: <span className="font-semibold">Free Shipping</span>
            </p>
            <p className="text-gray-500 text-sm">Delivery: Aug. 29 - Sep. 20</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Pay
            cart={cart}
            onPaymentSuccess={() => {
              clearCart();
              toast.success("Order placed and cart cleared.");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
