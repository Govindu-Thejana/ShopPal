// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const router = useRouter();

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post("http://localhost:7000/login", {
//         username,
//         password,
//       });
//       const { token, user } = response.data;

//       // Save token in localStorage (or cookie)
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       // Redirect to main/cart page
//       router.push("/");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen gap-4">
//       <h1 className="text-2xl font-bold">Login</h1>
//       <input
//         type="text"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         className="border px-2 py-1 rounded"
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="border px-2 py-1 rounded"
//       />
//       <button
//         onClick={handleLogin}
//         className="bg-blue-600 text-white px-4 py-2 rounded"
//       >
//         Login
//       </button>
//       {error && <p className="text-red-500">{error}</p>}
//     </div>
//   );
// }

"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY || "";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${API_GATEWAY}/api/auth/login`, {
        username,
        password,
      });
      const { token, user } = response.data;

      // Save token in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      router.push("/"); // Redirect to main/cart page
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-white-400 to-white-400">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h1>
        <p className="text-center text-gray-500 mb-6">Login to access your cart and orders</p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-md hover:opacity-90 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="text-center mt-4 text-gray-400 text-sm">
          Do not have an account? <span className="text-purple-600">Sign Up</span>
        </div>
      </div>
    </div>
  );
}
