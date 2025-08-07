"use client";

import { useState } from "react";
import { FiShoppingCart, FiX, FiPlus, FiMinus } from "react-icons/fi";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Product } from "../types/Product";

type Props = {
    items: Product[];
    onClear: () => void;
    onUpdate: (product: Product, newQuantity: number) => void;
};

export default function CartModal({ items, onClear, onUpdate }: Props) {
    const [open, setOpen] = useState(false);

    // Contar cantidades manteniendo el orden de aparición
    const quantityMap = new Map<string, number>();
    items.forEach(item => {
        quantityMap.set(item.id, (quantityMap.get(item.id) ?? 0) + 1);
    });

    // Array sin duplicados, respetando orden de aparición
    const uniqueProducts: Product[] = [];
    const seen = new Set<string>();
    items.forEach(item => {
        if (!seen.has(item.id)) {
            seen.add(item.id);
            uniqueProducts.push(item);
        }
    });

    // Crear groupedItems respetando orden original y cantidades
    const groupedItems = uniqueProducts.map(product => ({
        product,
        quantity: quantityMap.get(product.id) ?? 0,
    }));

    // Cantidad total
    const totalQuantity = groupedItems.reduce((acc, item) => acc + item.quantity, 0);

    // Total sin descuento
    const total = groupedItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
    );

    // Descuento mayorista si totalQuantity >= 20
    const discountRate = totalQuantity >= 20 ? 0.20 : 0;
    const discountAmount = total * discountRate;
    const finalTotal = total - discountAmount;

    // Mensaje WhatsApp
    const message = encodeURIComponent(
        groupedItems
            .map(
                (item) =>
                    `${item.quantity}x ${item.product.name}: $${(item.product.price * item.quantity).toFixed(2)}`
            )
            .join("\n") +
        `\n\nTotal: $${total.toFixed(2)}` +
        (discountRate > 0
            ? `\nDescuento por venta mayorista: -$${discountAmount.toFixed(2)}` +
            `\nImporte final: $${finalTotal.toFixed(2)}`
            : "")
    );

    const handleQuantityChange = (product: Product, delta: number) => {
        const current = quantityMap.get(product.id) ?? 0;
        const newQuantity = current + delta;
        onUpdate(product, newQuantity);
    };

    return (
        <>
            <motion.button
                onClick={() => setOpen(true)}
                aria-label="Abrir carrito"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="fixed top-2 right-2 bg-pink-600 text-white rounded-full p-2 shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-400 transition flex items-center justify-center z-50 text-lg"
            >
                <FiShoppingCart size={24} />
                {items.length > 0 && (
                    <motion.span
                        layoutId="cart-count"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="ml-2 bg-white text-pink-600 font-bold rounded-full px-2 text-sm select-none"
                    >
                        {items.length}
                    </motion.span>
                )}
            </motion.button>

            {/* Sidebar slide-in */}
            <AnimatePresence>
                {open && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.5, ease: easeInOut }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl border-l border-white/30 z-50 p-6 "
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Botón cerrar */}
                            <button
                                onClick={() => setOpen(false)}
                                aria-label="Cerrar carrito"
                                className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 transition focus:outline-none"
                            >
                                <FiX size={24} />
                            </button>

                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                🛒 Tu pedido
                                {items.length === 0 && (
                                    <span className="text-sm font-normal text-gray-600">(vacío)</span>
                                )}
                            </h3>

                            {items.length > 0 ? (
                                <>
                                    <ul className="mb-4 space-y-2 max-h-60 overflow-y-auto pr-2">
                                        {groupedItems.map(({ product, quantity }) => (
                                            <li
                                                key={product.id}
                                                className="flex justify-between items-center border-b pb-2"
                                            >
                                                <span className="flex-1">
                                                    {quantity > 1 ? `${quantity}x ` : ""}
                                                    {product.name}
                                                </span>
                                                <span className="mr-4">${(product.price * quantity).toFixed(2)}</span>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleQuantityChange(product, -1)}
                                                        aria-label={`Disminuir cantidad de ${product.name}`}
                                                        className="p-1 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
                                                    >
                                                        <FiMinus size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleQuantityChange(product, +1)}
                                                        aria-label={`Aumentar cantidad de ${product.name}`}
                                                        className="p-1 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
                                                    >
                                                        <FiPlus size={16} />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {discountRate > 0 ? (
                                        <div className="mb-4 border-t border-gray-300 pt-2 text-red-600 font-semibold">
                                            <p>Descuento por venta mayorista: -${discountAmount.toFixed(2)}</p>
                                        </div>
                                    ) : (
                                        <div className="mb-4 border-t border-gray-300 pt-2 text-gray-400 font-semibold italic">
                                            <p>Precio mayorista +20 productos</p>
                                        </div>
                                    )}

                                    <p className="text-lg font-semibold mb-6">
                                        Total {discountRate > 0 ? "(con descuento)" : ""}: ${finalTotal.toFixed(2)}
                                    </p>

                                    <div className="flex justify-between">
                                        <button
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                                            onClick={() => {
                                                onClear();
                                                setOpen(false);
                                            }}
                                        >
                                            Vaciar
                                        </button>
                                        <a
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                                            href={`https://wa.me/549011?text=${message}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Enviar pedido ahora
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <p className="text-center text-gray-700">No hay productos en el carrito.</p>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
