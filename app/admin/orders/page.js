"use client";

import { useEffect, useState } from "react";
import { Loader2, Trash2, Eye } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // 🔄 LIVE REFRESH EVERY 1 SEC
  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 1000);
    return () => clearInterval(interval);
  }, []);

  async function loadOrders() {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.log("Fetch error:", err);
    }
    setLoading(false);
  }

  async function deleteOrder(id) {
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    setOrders((prev) => prev.filter((o) => o._id !== id));
    setDeleteConfirm(null);
  }

  async function markSeen(id) {
    await fetch(`/api/orders/seen/${id}`, { method: "PUT" });
  }

  // GROUPING ORDERS
  function groupOrders(list) {
    const today = [];
    const yesterday = [];
    const older = [];

    const now = new Date();
    const d = now.getDate();
    const m = now.getMonth();
    const y = now.getFullYear();

    list.forEach((o) => {
      const dt = new Date(o.createdAt);
      const dd = dt.getDate();
      const mm = dt.getMonth();
      const yy = dt.getFullYear();

      if (dd === d && mm === m && yy === y) today.push(o);
      else if (dd === d - 1 && mm === m && yy === y) yesterday.push(o);
      else older.push(o);
    });

    return { today, yesterday, older };
  }

  const { today, yesterday, older } = groupOrders(orders);

  // 🔥 ORDER CARD — PREMIUM DARK GOLD
  function OrderCard({ o }) {
    const isNew = !o.seenByAdmin;

    return (
      <div
        className="group bg-[#111] border border-[#2a2a2a] rounded-xl p-5 shadow-lg 
        hover:border-[#d7b46a] hover:shadow-[0_0_14px_rgba(215,180,106,0.25)] 
        transition cursor-pointer relative"
        onClick={() => {
          setSelectedOrder(o);
          if (isNew) markSeen(o._id);
        }}
      >
        {isNew && (
          <span className="absolute top-3 right-4 bg-[#d7b46a] text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            NEW
          </span>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setDeleteConfirm(o);
          }}
          className="absolute right-3 bottom-3 text-red-400 hover:text-red-200 transition"
        >
          <Trash2 size={18} />
        </button>

        <p className="text-gray-400 text-sm mb-2">
          {new Date(o.createdAt).toLocaleString()}
        </p>

        <h2 className="text-2xl font-bold text-[#d7b46a] mb-1">
          Table {o.table}
        </h2>

        <p className="text-gray-300">{o.totalQty} items</p>
        <p className="text-xl font-semibold text-white mt-1">
          ₹{o.totalPrice}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white animate-fadeInSlow">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#d7b46a]">Orders</h1>
        <p className="text-gray-400 text-sm mt-1">Realtime restaurant orders</p>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex items-center gap-3 py-10 text-gray-400 justify-center">
          <Loader2 className="animate-spin" size={22} />
          Loading orders…
        </div>
      )}

      {/* EMPTY */}
      {!loading && orders.length === 0 && (
        <div className="text-center py-12 text-gray-500 text-lg">
          No orders yet 😶
        </div>
      )}

      {/* TODAY */}
      {today.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-[#d7b46a] mt-6 mb-3">Today</h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {today.map((o) => (
              <OrderCard key={o._id} o={o} />
            ))}
          </div>
        </>
      )}

      {/* YESTERDAY */}
      {yesterday.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-[#d7b46a] mt-10 mb-3">
            Yesterday
          </h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {yesterday.map((o) => (
              <OrderCard key={o._id} o={o} />
            ))}
          </div>
        </>
      )}

      {/* OLDER */}
      {older.length > 0 && (
        <>
          <h2 className="text-xl font-semibold text-[#d7b46a] mt-10 mb-3">
            Older
          </h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {older.map((o) => (
              <OrderCard key={o._id} o={o} />
            ))}
          </div>
        </>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-[#111] w-[90%] max-w-lg rounded-xl border border-[#2a2a2a] shadow-xl p-6 relative">

            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute right-4 top-3 text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>

            <h2 className="text-2xl font-bold text-[#d7b46a]">
              Table {selectedOrder.table}
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scroll">
              {selectedOrder.items.map((it) => (
                <div key={it._id} className="flex justify-between border-b border-gray-800 pb-2">
                  <div>
                    <p className="font-semibold">{it.name}</p>
                    <p className="text-gray-400 text-sm">
                      {it.qty} × ₹{it.price}
                    </p>
                  </div>
                  <p className="text-[#d7b46a] font-bold">
                    ₹{it.qty * it.price}
                  </p>
                </div>
              ))}
            </div>

            {selectedOrder.note && (
              <p className="mt-4 p-3 bg-[#1a1a1a] rounded-lg text-gray-300">
                <span className="font-bold text-white">Note: </span>
                {selectedOrder.note}
              </p>
            )}

            <div className="flex justify-between text-lg font-bold mt-4">
              <p>Total</p>
              <p>₹{selectedOrder.totalPrice}</p>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-6 bg-[#d7b46a] py-3 rounded-xl text-black font-semibold hover:brightness-110 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50">
          <div className="bg-[#111] w-[90%] max-w-sm rounded-xl border border-[#2a2a2a] p-6 shadow-lg">
            <h2 className="text-xl font-bold text-red-400 mb-4">
              Delete this order?
            </h2>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete order for 
              <b className="text-white"> Table {deleteConfirm.table}</b>?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => deleteOrder(deleteConfirm._id)}
                className="flex-1 bg-red-600 py-2 rounded-lg text-white font-semibold"
              >
                Yes, delete
              </button>

              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-700 py-2 rounded-lg text-white font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
