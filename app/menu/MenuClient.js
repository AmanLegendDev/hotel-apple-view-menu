"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MenuClient({ categories, items, activeCategoryId }) {
  const router = useRouter();
  const tabsRef = useRef(null);

  const { cart, addToCart, increaseQty, decreaseQty } = useCart();

  const [liveCategories] = useState(categories);
  const [liveItems, setLiveItems] = useState(items);
  const [selected, setSelected] = useState({});
  const [recentOrder, setRecentOrder] = useState(null);

  const activeCat = activeCategoryId || categories[0]?._id;

  const getCategoryCount = (catId) => {
    return cart
      .filter(
        (item) =>
          String(item.category) === String(catId) ||
          String(item.category?._id) === String(catId)
      )
      .reduce((sum, item) => sum + item.qty, 0);
  };

  useEffect(() => {
    const saved = localStorage.getItem("latestOrder");
    if (saved) setRecentOrder(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const updated = {};
    cart.forEach((item) => (updated[item._id] = item.qty));
    setSelected(updated);
  }, [cart]);

  useEffect(() => {
    setLiveItems(items);
  }, [items]);

  const totalQty = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.qty * i.price, 0);

  const visibleCategories = liveCategories.filter(
    (cat) => String(cat._id) === String(activeCat)
  );

  useEffect(() => {
    const saved = sessionStorage.getItem("tabsScroll");
    if (saved && tabsRef.current) {
      tabsRef.current.scrollLeft = Number(saved);
    }
  }, [activeCategoryId]);

  return (
    <div className="min-h-screen bg-[var(--bg-cream)] px-5 py-7 pb-32">

      {/* PAGE TITLE */}
      <h1 className="text-4xl font-extrabold text-[var(--apple-green)] mb-6 tracking-tight">
        🍏 Apple View Menu
      </h1>

      {/* CATEGORY TABS */}
      <div
        ref={tabsRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pb-4 sticky top-0 bg-[var(--bg-cream)] z-10 pt-2"
      >
        {liveCategories.map((cat) => (
          <motion.button
            key={cat._id}
            onClick={() => {
              const savedScroll = tabsRef.current?.scrollLeft || 0;
              sessionStorage.setItem("tabsScroll", savedScroll);
              router.push(`/menu/${String(cat._id)}`);
            }}
            whileTap={{ scale: 0.9 }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition border
              ${
                String(activeCat) === String(cat._id)
                  ? "bg-[var(--apple-green)] text-white border-[var(--apple-green)] shadow-md"
                  : "bg-white text-[var(--text-dark)] border-[var(--apple-green)]"
              }`}
          >
            {cat.name}{" "}
            {getCategoryCount(cat._id) > 0 &&
              `(${getCategoryCount(cat._id)})`}
          </motion.button>
        ))}
      </div>

      {/* LAST ORDER BANNER */}
      {recentOrder && (
        <div className="w-full bg-white shadow border-l-4 border-[var(--apple-green)] px-5 py-3 flex justify-between items-center mt-4 rounded-lg">
          <p className="font-semibold text-[var(--text-dark)]">
            Last order • Table {recentOrder.table}
          </p>
          <button
            onClick={() => router.push("/order-success")}
            className="bg-[var(--apple-green)] text-white px-4 py-2 rounded-full text-sm font-semibold"
          >
            View
          </button>
        </div>
      )}

      {/* CATEGORY SECTIONS */}
      <div className="mt-6 space-y-16">
        {visibleCategories.map((cat) => (
          <section key={cat._id}>

            {/* Category Title */}
            <h2 className="text-3xl font-bold text-[var(--pine-brown)] mb-4">
              {cat.name}
              {getCategoryCount(cat._id) > 0 &&
                ` (${getCategoryCount(cat._id)})`}
            </h2>

            {/* ITEMS GRID */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              {liveItems
                .filter(
                  (item) =>
                    String(item.category) === String(cat._id) ||
                    String(item.category?._id) === String(cat._id)
                )
                .map((item) => {
                  const inCart = cart.find((c) => c._id === item._id);
                  const qty = inCart?.qty ?? 0;
                  const isSelected = selected[item._id] > 0;

                  return (
                    <motion.div
                      key={item._id}
                      whileHover={{ scale: 1.04 }}
                className="bg-white rounded-xl shadow-md border border-[var(--apple-green-light)] overflow-hidden flex flex-col"
                    >
                      {/* IMAGE */}
                      <div className="h-36 w-full overflow-hidden rounded-t-xl">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={500}
                          height={300}
                          priority
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* CONTENT */}
                      <div className="p-3 flex flex-col flex-grow">
                        <h3 className="text-lg font-semibold text-[var(--text-dark)] line-clamp-2 min-h-[48px]">
                          {item.name}
                        </h3>

                        <p className="text-[var(--pine-brown)] text-sm mt-1 line-clamp-2 min-h-[40px]">
                          {item.description}
                        </p>

                        {/* QTY BUTTONS */}
                        <div className="flex items-center justify-center gap-3 mt-3">
                          <button
                            onClick={() => decreaseQty(item._id)}
                            className="bg-[var(--bg-cream)] border border-[var(--apple-green)] text-[var(--apple-green)] w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold"
                          >
                            -
                          </button>

                          <span className="text-lg font-semibold w-6 text-center">
                            {qty}
                          </span>

                          <button
                            onClick={() => {
                              qty === 0
                                ? addToCart(item)
                                : increaseQty(item._id);
                            }}
                            className="bg-[var(--apple-green)] text-white w-8 h-8 flex items-center justify-center rounded-full text-lg font-bold"
                          >
                            +
                          </button>
                        </div>

                        {/* PRICE & SELECT */}
                        <div className="flex items-center justify-between mt-4">
                          <p className="text-[var(--apple-gold)] font-bold text-lg">
                            ₹{item.price}
                          </p>

                          {isSelected ? (
                            <button className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[var(--apple-green)] text-white">
                              Selected ({selected[item._id]})
                            </button>
                          ) : (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                if (qty < 1) {
                                  alert("Please select at least 1 quantity.");
                                  return;
                                }
                                setSelected((prev) => ({
                                  ...prev,
                                  [item._id]: qty,
                                }));
                              }}
                              className={`px-4 py-1.5 rounded-full text-xs font-semibold
                                ${
                                  qty < 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-[var(--apple-green)] text-white"
                                }`}
                            >
                              Select
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </motion.div>
          </section>
        ))}
      </div>

      {/* CART FOOTER */}
      {totalQty > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t px-5 py-3 flex justify-between items-center z-50">
          <p className="font-semibold text-[var(--text-dark)]">
            {totalQty} items • ₹{totalPrice}
          </p>
          <button
            onClick={() => router.push("/order-review")}
            className="bg-[var(--apple-green)] text-white px-6 py-2 rounded-full font-semibold"
          >
            Process
          </button>
        </div>
      )}
    </div>
  );
}
