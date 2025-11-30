"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, List, ListOrdered, UtensilsCrossed } from "lucide-react";

export default function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);

  async function loadCategories() {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  }

  async function loadItems() {
    const res = await fetch("/api/items?count=true");
    const data = await res.json();
    setItems(new Array(data.count));
  }

  async function loadOrders() {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.orders || []);
  }

  useEffect(() => {
    loadCategories();
    loadItems();
    loadOrders();
  }, []);

  return (
    <div className="animate-fadeInSlow">

      {/* HEADER */}
      <div className="flex flex-col items-center justify-center mb-10">
        <h1 className="text-4xl font-bold text-[#d7b46a]">Dashboard</h1>
        <p className="text-gray-400 mt-2 text-sm">
          Manage your restaurant system efficiently
        </p>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* CARD: Categories */}
        <Link href="/admin/categories">
          <div className="group bg-[#111] p-6 rounded-xl border border-[#2a2a2a] shadow-xl 
          hover:border-[#d7b46a] hover:shadow-[0_0_15px_rgba(215,180,106,0.3)]
          transition transform hover:-translate-y-1 cursor-pointer">

            <div className="flex items-center gap-3 mb-4">
              <List className="text-[#d7b46a] group-hover:scale-110 transition" size={28} />
              <h2 className="text-xl font-semibold text-white">Categories</h2>
            </div>

            <p className="text-5xl font-bold text-white">{categories.length}</p>
            <span className="text-gray-400 text-sm">Total categories</span>
          </div>
        </Link>

        {/* CARD: Menu Items */}
        <Link href="/admin/items">
          <div className="group bg-[#111] p-6 rounded-xl border border-[#2a2a2a] shadow-xl 
          hover:border-[#d7b46a] hover:shadow-[0_0_15px_rgba(215,180,106,0.3)]
          transition transform hover:-translate-y-1 cursor-pointer">

            <div className="flex items-center gap-3 mb-4">
              <UtensilsCrossed className="text-[#d7b46a] group-hover:scale-110 transition" size={28} />
              <h2 className="text-xl font-semibold text-white">Menu Items</h2>
            </div>

            <p className="text-5xl font-bold text-white">{items.length}</p>
            <span className="text-gray-400 text-sm">Total items</span>
          </div>
        </Link>

        {/* CARD: Orders */}
        <Link href="/admin/orders">
          <div className="group bg-[#111] p-6 rounded-xl border border-[#2a2a2a] shadow-xl 
          hover:border-[#d7b46a] hover:shadow-[0_0_15px_rgba(215,180,106,0.3)]
          transition transform hover:-translate-y-1 cursor-pointer">

            <div className="flex items-center gap-3 mb-4">
              <ListOrdered className="text-[#d7b46a] group-hover:scale-110 transition" size={28} />
              <h2 className="text-xl font-semibold text-white">Orders</h2>
            </div>

            <p className="text-5xl font-bold text-white">{orders.length}</p>
            <span className="text-gray-400 text-sm">Customer orders</span>
          </div>
        </Link>
      </div>

    </div>
  );
}
