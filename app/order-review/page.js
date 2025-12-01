"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderReviewPage() {
  const { cart } = useCart();
  const router = useRouter();

  const [savedCart, setSavedCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [table, setTable] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("cart_data");
    if (stored) {
      try {
        setSavedCart(JSON.parse(stored));
      } catch {}
    }
    setTimeout(() => setLoading(false), 50);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[var(--pine-brown)]">
        Loading your order…
      </div>
    );
  }

  const finalCart = cart.length > 0 ? cart : savedCart;
  const totalQty = finalCart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = finalCart.reduce((s, i) => s + i.qty * i.price, 0);

  async function placeOrder() {
    if (!table) {
      alert("Please enter Room number!");
      return;
    }

    const orderData = {
      items: finalCart,
      totalQty,
      totalPrice,
      table,
      note,
      createdAt: new Date(),
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (data.success) {
      const finalOrder = { ...orderData, _id: data.order._id };
      localStorage.setItem("latestOrder", JSON.stringify(finalOrder));

      if (navigator.vibrate) navigator.vibrate([120, 60, 120]);

      router.replace("/order-success");
    } else {
      alert("Order failed. Try again!");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-cream)] px-4 py-6 pb-28 text-[var(--text-dark)]">

      <h1 className="text-3xl font-extrabold text-[var(--apple-green)] tracking-tight">
        Review Your Order 🍏
      </h1>

      <p className="text-[var(--pine-brown)] text-sm mt-1 mb-4">
        Kindly confirm before final submission.
      </p>

      {/* SECTION DIVIDER */}
      <h2 className="text-lg font-semibold mt-4 mb-2">Order Summary</h2>
      <div className="h-[1px] bg-[var(--apple-green)]/30 mb-4" />

      {/* ITEMS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {finalCart.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-xl shadow border border-[var(--apple-gold)]/30 p-3 flex flex-col"
          >
            <img
              src={item.image}
              className="w-full h-24 rounded-lg object-cover"
            />

            <h2 className="font-semibold text-[15px] mt-2 line-clamp-1">
              {item.name}
            </h2>

            <p className="text-[var(--pine-brown)] text-sm mt-1">
              {item.qty} × ₹{item.price}
            </p>

            <p className="font-bold text-[var(--apple-green)] text-right mt-auto">
              ₹{item.qty * item.price}
            </p>
          </div>
        ))}
      </div>

      {/* CUSTOMER DETAILS */}
      <h2 className="text-lg font-semibold mt-8 mb-2">Your Details</h2>
      <div className="h-[1px] bg-[var(--apple-green)]/30 mb-4" />

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm mb-3">
          {error}
        </div>
      )}

      {/* TABLE INPUT */}
      <div className="mb-5">
        <label className="font-semibold text-sm block mb-1">
          Room Number.? <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          placeholder="Enter Room number"
          value={table}
          onChange={(e) => {
            setError("");
            setTable(e.target.value);
          }}
          className="w-full p-3 rounded-lg border bg-white shadow-sm focus:ring-2 focus:ring-[var(--apple-green)] outline-none transition"
        />
      </div>

      {/* NOTE INPUT */}
      <label className="font-semibold text-sm block mb-1">
        Note (Optional)
      </label>
      <textarea
        placeholder="Example: Less spicy, extra cheese..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full p-3 rounded-lg border bg-white shadow-sm min-h-[90px] focus:ring-2 focus:ring-[var(--apple-green)] outline-none transition"
      />

      {/* FOOTER */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur shadow-[0_-2px_12px_rgba(0,0,0,0.15)] py-4 px-5 border-t flex justify-between items-center z-50">
        <p className="font-semibold">
          {totalQty} items • ₹{totalPrice}
        </p>

        <button
          onClick={placeOrder}
          className="bg-[var(--apple-green)] text-white px-7 py-2.5 rounded-full font-semibold shadow-lg active:scale-95 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
