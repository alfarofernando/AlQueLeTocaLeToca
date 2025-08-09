'use client';

import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";
import { ProductType } from "../types/ProductType";

interface ProductItemProps {
    product: ProductType;
    quantity: number;
    addToCart: (id: number, quantity: number) => void;
    isInfoOpen: boolean;
    onToggleInfo: () => void;
}

export default function ProductItem({ product, quantity, addToCart, isInfoOpen, onToggleInfo }: ProductItemProps) {

    return (
        <li className="bg-pink-50 rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold text-pink-700 text-lg">
                        {quantity}x {product.name} - ${(product.price * quantity).toLocaleString()}
                    </p>
                    <p className="text-sm text-pink-400 italic mt-1">{product.theme}</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => addToCart(product.id, quantity)}
                        className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow transition"
                        aria-label={`Agregar ${quantity} ${product.name} al carrito`}
                    >
                        <FiShoppingCart />
                        Agregar{quantity > 1 ? ` (${quantity})` : ""}
                    </button>

                    <button
                        onClick={onToggleInfo}
                        className="text-pink-600 hover:text-pink-700 font-semibold text-sm px-3 py-2 rounded-lg border border-pink-600 hover:border-pink-700 transition"
                        aria-expanded={isInfoOpen}
                        aria-controls={`desc-${product.id}`}
                    >
                        +Info
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isInfoOpen && (
                    <motion.div
                        key="desc"
                        id={`desc-${product.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="text-gray-700 text-sm italic overflow-hidden"
                    >
                        {product.description || "Sin descripción disponible."}
                    </motion.div>
                )}
            </AnimatePresence>
        </li>
    );
}
