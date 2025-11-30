"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--bg-cream)] text-[var(--text-dark)] flex flex-col items-center justify-center px-6 relative">

      {/* 🍏 TOP LOGO */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-6xl mb-4 drop-shadow-sm"
      >
        🍏
      </motion.div>

      {/* TITLE */}
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-extrabold text-center text-[var(--apple-green)]"
      >
        Hotel Apple View
      </motion.h1>

      {/* SUBTEXT */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="text-center mt-3 text-lg max-w-md font-medium text-[var(--pine-brown)]"
      >
        A premium & warm dining experience from the heart of Shimla 🍃
      </motion.p>

      {/* BUTTONS */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">

        {/* CUSTOMER MENU */}
        <Link href="/menu">
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            className="px-8 py-3 rounded-full font-semibold shadow-md apple-shadow transition bg-[var(--apple-green-light)] text-white border border-[var(--apple-green)]"
          >
            View Menu 🍽️
          </motion.button>
        </Link>

        {/* ADMIN LOGIN */}
        <Link href="/admin">
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            className="px-8 py-3 rounded-full font-semibold border-2 transition bg-white text-[var(--apple-green)] border-[var(--apple-green)]"
          >
            Admin Login 🔐
          </motion.button>
        </Link>
      </div>

      {/* FOOTER */}
      <p className="mt-14 text-sm font-semibold text-[var(--pine-brown)] opacity-80">
        Crafted with ❤️ by Aman Legends
      </p>
    </div>
  );
}
