"use client";

import axios, { isAxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY || "";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in username and password");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post(`${API_GATEWAY}/api/auth/signup`, {
        username,
        password,
        role,
      });

      toast.success("Signup successful! Please login.");

      // Redirect to login after signup
      router.push("/login");
    } catch (err: unknown) {
      const msg = isAxiosError(err) ? err.response?.data?.message || "Signup failed" : "Signup failed";
      toast.error(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-orange-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <div className="text-center">
          <div className="text-4xl font-bold text-black mb-2">
            <Image src="/logo.jpg" alt="ShopPal Logo" width={160} height={30} className="inline-block -mt-1" priority />
          </div>
          <p className="text-gray-500 mb-6">Create an account to start shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block mb-1 text-gray-700 font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block mb-1 text-gray-700 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block mb-1 text-gray-700 font-medium">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-500"
            >
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        <div className="mt-4 text-center text-sm text-gray-600">
          <p className="mt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-red-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
