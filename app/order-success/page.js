"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function OrderSuccessPage() {
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("latestOrder");
    if (savedOrder) setOrder(JSON.parse(savedOrder));
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-[var(--pine-brown)]">
        Loading your order...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-cream)] px-6 py-10 text-[var(--text-dark)]">

      {/* SUCCESS BADGE */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "backOut" }}
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 18px rgba(14,122,63,0.5)",
          }}
          className="w-20 h-20 bg-[var(--apple-green)] text-white rounded-full flex items-center justify-center mx-auto text-4xl font-bold shadow-lg"
        >
          ✓
        </motion.div>

        <h1 className="text-3xl font-bold mt-5 text-[var(--apple-green)]">
          Order Placed Successfully!
        </h1>

        <p className="text-[var(--pine-brown)] mt-2">
          Your food is being prepared.  
          It will arrive shortly 🍽️  
        </p>
      </div>

      {/* ORDER DETAILS */}
      <div className="bg-white rounded-xl shadow p-5 mt-8 border border-[var(--apple-gold)]/40">

        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item._id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--text-dark)]">{item.name}</p>
                <p className="text-sm text-[var(--pine-brown)]">
                  {item.qty} × ₹{item.price}
                </p>
              </div>

              <p className="font-semibold text-[var(--apple-green)]">
                ₹{item.qty * item.price}
              </p>
            </div>
          ))}
        </div>

        <hr className="my-4 border-[var(--apple-green)]/20" />

        <div className="flex justify-between text-lg font-bold">
          <p>Total Bill</p>
          <p>₹{order.totalPrice}</p>
        </div>

        <div className="mt-4 bg-[var(--apple-green)]/10 p-3 rounded-lg text-center">
          <p className="font-semibold">
            Table Number:{" "}
            <span className="text-[var(--apple-green)] font-bold text-xl">
              {order.table}
            </span>
          </p>
        </div>

        <p className="text-center text-sm text-[var(--pine-brown)] mt-3">
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      {/* BACK BUTTON */}
      <div className="mt-10 text-center">
        <button
          onClick={() => {
            clearCart();
            window.location.href = "/menu";
          }}
          className="bg-[var(--apple-green)] text-white px-8 py-3 rounded-full text-lg font-semibold shadow-md active:scale-95 transition"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
}
