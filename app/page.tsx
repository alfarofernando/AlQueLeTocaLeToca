"use client";

import ProductList from "./components/ProductList";
import CartModal from "./components/CartModal";
import BestCombination from "./components/BestCombinations";
import { useCart } from "./hooks/useCart"; // <--- nuevo hook
import { Product } from "./types/Product";
import { useState } from "react";

const themes = [
  { key: "diversion", label: "Diversión" },
  { key: "beauty", label: "Belleza" },
  { key: "fiesta", label: "Fiesta" },
  { key: "romantic", label: "Romántico" },
  { key: "relax", label: "Relajado" },
];

export default function Home() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const {
    cart,
    addToCart,
    updateQuantity,
    clearCart,
    loading,
  } = useCart();

  const handleAdd = (product: Product) => {
    addToCart(product); // usa el hook
  };

  const handleUpdate = (product: Product, newQuantity: number) => {
    updateQuantity(product, newQuantity); // usa el hook
  };

  return (
    <main className="min-h-screen p-4">
      <div className="mx-auto">
        <div className="backdrop-blur-lg bg-white/30 rounded-2xl shadow-xl p-6 border border-white/40">
          <header className="flex mb-6">
            <img
              src="/LaSuerteEsLoca.png"
              alt="Logo"
              className="rounded-3xl shadow-lg max-h-36 object-cover"
            />
            <h1 className="flex-grow text-center text-4xl font-extrabold text-gray-800 drop-shadow-sm">
              Regalos Sorpresa
            </h1>
            <div className="fixed top-2 right-2 z-50">
              <CartModal
                items={cart}
                onClear={clearCart}
                onUpdate={handleUpdate}
              />
            </div>
          </header>

          <section>
            <BestCombination budget={10000} />
          </section>

          <section className="my-6 flex flex-wrap gap-2 justify-center">
            {themes.map((theme) => (
              <button
                key={theme.key}
                onClick={() => setSelectedTheme(theme.key)}
                className={`px-4 py-2 rounded-lg text-white font-medium ${selectedTheme === theme.key
                  ? "bg-pink-600"
                  : "bg-pink-400 hover:bg-pink-500"
                  }`}
              >
                {theme.label}
              </button>
            ))}
            <button
              onClick={() => setSelectedTheme(null)}
              className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium"
            >
              Ver todos
            </button>
          </section>

          <section className="my-4">
            <ProductList onAdd={handleAdd} theme={selectedTheme ?? undefined} />
          </section>
        </div>
      </div>
    </main>
  );
}
