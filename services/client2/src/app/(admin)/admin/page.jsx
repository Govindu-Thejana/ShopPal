"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FaShoppingCart, FaDollarSign, FaUsers } from "react-icons/fa";
import { toast } from "react-toastify";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { ProductContext } from "../../../context/ProductContext";

const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY || "";

const salesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 4780 },
  { name: "May", sales: 5890 },
  { name: "Jun", sales: 4390 },
];
export default function AdminDashboard() {
  const router = useRouter();
  const { products, addProduct } = useContext(ProductContext);

  const [form, setForm] = useState({
    name: "",
    category: "men",
    price: "",
    image: "",
    description: "",
  });

  // 🔹 State for backend data
  const [summary, setSummary] = useState({
    totalPayments: 0,
    totalOrders: 0,
    totalEmails: 0,
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentEmails, setRecentEmails] = useState([]);

  // Fetch backend data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, paymentsRes, ordersRes, emailsRes] = await Promise.all([
          fetch(`${API_GATEWAY}/api/analytics/dashboard/summary`),
          fetch(`${API_GATEWAY}/api/analytics/dashboard/recent-payments`),
          fetch(`${API_GATEWAY}/api/analytics/dashboard/recent-orders`),
          fetch(`${API_GATEWAY}/api/analytics/dashboard/recent-emails`),
        ]);

        setSummary(await summaryRes.json());
        setRecentPayments(await paymentsRes.json());
        setRecentOrders(await ordersRes.json());
        setRecentEmails(await emailsRes.json());
      } catch (err) {
        console.error("Error fetching analytics:", err);
      }
    };

    fetchData();

    // Optional: Refresh every 5s
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login"); // Redirect to login page
  };

  const handleAddProduct = (e) => {
    e.preventDefault();

    if (!form.name || !form.category || !form.price || !form.description) {
      toast.error("Please fill all required product fields.");
      return;
    }

    const parsedPrice = Number(form.price);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error("Product price must be greater than 0.");
      return;
    }

    const product = addProduct({ ...form, price: parsedPrice });
    toast.success(`${product.name} added successfully.`);
    setForm({
      name: "",
      category: "men",
      price: "",
      image: "",
      description: "",
    });
  };

  return (
    <div className="flex flex-col justify-center p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">📊 Admin Dashboard</h1>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md cursor-pointer">
          Logout
        </button>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Orders" value={summary.totalOrders} icon={<FaShoppingCart className="text-blue-500 text-3xl" />} />
        <StatCard title="Payments" value={summary.totalPayments} icon={<FaDollarSign className="text-green-500 text-3xl" />} />
        <StatCard title="Emails" value={summary.totalEmails} icon={<FaUsers className="text-purple-500 text-3xl" />} />
        {/* <StatCard
          title="Products"
          value="320" // If you add Kafka for products later, replace here
          icon={<FaBoxOpen className="text-orange-500 text-3xl" />}
        /> */}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <RecentList
          title="Recent Orders"
          data={recentOrders}
          renderItem={(o) => (
            <li key={o.userId + o.orderId}>
              📦 User {o.userId} placed order {o.orderId}
            </li>
          )}
        />
        <RecentList
          title="Recent Payments"
          data={recentPayments}
          renderItem={(p) => (
            <li key={p.userId + p.total}>
              💳 User {p.userId} paid ${p.total}
            </li>
          )}
        />
        <RecentList title="Recent Emails" data={recentEmails} renderItem={(e) => <li key={e.userId + e.emailId}>✉️ Email sent to user {e.userId}</li>} />
      </div>

      {/* Sales Chart - (static for now, you can map to payments later) */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Add Product</h2>
          <form onSubmit={handleAddProduct} className="space-y-3">
            <input
              type="text"
              placeholder="Product name"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full rounded border border-gray-300 px-3 py-2"
              >
                <option value="men">men</option>
                <option value="women">women</option>
                <option value="kids">kids</option>
                <option value="accessories">accessories</option>
              </select>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                value={form.price}
                onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <input
              type="text"
              placeholder="Image path (optional), e.g. /product11.jpg"
              value={form.image}
              onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
            <textarea
              rows={3}
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer">
              Add Product
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current Products ({products.length})</h2>
          <ul className="max-h-80 space-y-2 overflow-y-auto text-sm text-gray-700">
            {products.map((item) => (
              <li key={item.id} className="rounded border border-gray-200 px-3 py-2">
                <div className="font-semibold">{item.name}</div>
                <div className="text-xs text-gray-500">
                  {item.category} | ${Number(item.price).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
      {icon}
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
    </div>
  );
}

function RecentList({ title, data, renderItem }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <ul className="space-y-2 text-gray-700 text-sm">{data.length > 0 ? data.map(renderItem) : <li>No records yet</li>}</ul>
    </div>
  );
}
