"use client";

import { useState, useEffect } from "react";
import { FiShoppingCart, FiX, FiPlus, FiMinus } from "react-icons/fi";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { ProductType } from "../types/ProductType";
import { useCart } from "../context/CartContext";
import AfterSendModal from "./AfterSendModal";

export default function CartModal() {
    const {
        cart: items,
        updateQuantity,
        clearCart,
    } = useCart();

    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [afterSendOpen, setAfterSendOpen] = useState(false);

    // Crear un Map para cantidad de cada producto
    const quantityMap = new Map<number, number>();
    items.forEach((item) => {
        quantityMap.set(item.id, item.quantity ?? 0);
    });

    // Productos únicos en orden
    const uniqueProducts: ProductType[] = [];
    const seen = new Set<number>();
    items.forEach((item) => {
        if (!seen.has(item.id)) {
            seen.add(item.id);
            uniqueProducts.push(item);
        }
    });

    // Agrupar con cantidades
    const groupedItems = uniqueProducts.map((product) => ({
        product,
        quantity: quantityMap.get(product.id) ?? 0,
    }));

    // Agrupar productos por temática para UI
    const groupedByThemeUI = groupedItems.reduce((acc, item) => {
        if (!acc[item.product.theme]) acc[item.product.theme] = [];
        acc[item.product.theme].push(item);
        return acc;
    }, {} as Record<string, typeof groupedItems>);

    // Agrupar productos por temática para mensaje WhatsApp
    const groupedByThemeMsg = groupedItems.reduce((acc, item) => {
        if (!acc[item.product.theme]) acc[item.product.theme] = [];
        acc[item.product.theme].push(item);
        return acc;
    }, {} as Record<string, typeof groupedItems>);

    const totalQuantity = groupedItems.reduce((acc, i) => acc + i.quantity, 0);
    const total = groupedItems.reduce(
        (acc, i) => acc + i.product.price * i.quantity,
        0
    );

    const discountRate = totalQuantity >= 20 ? 0.2 : 0;
    const discountAmount = total * discountRate;
    const finalTotal = total - discountAmount;

    // Construir mensaje con separadores por temática
    const message = encodeURIComponent(
        Object.entries(groupedByThemeMsg)
            .map(([theme, items]) => {
                const productsText = items
                    .map(
                        (item) =>
                            `${item.quantity}x ${item.product.name}: $${(
                                item.product.price * item.quantity
                            ).toFixed(2)}`
                    )
                    .join("\n");
                return `${theme.toUpperCase()}:\n${productsText}`;
            })
            .join("\n\n") +
        `\n\nTotal: $${total.toFixed(2)}` +
        (discountRate > 0
            ? `\nDescuento por venta mayorista: -$${discountAmount.toFixed(2)}` +
            `\nImporte final: $${finalTotal.toFixed(2)}`
            : "")
    );

    const handleQuantityChange = (product: ProductType, delta: number) => {
        const current = quantityMap.get(product.id) ?? 0;
        const newQuantity = current + delta;
        if (newQuantity < 0) return; // no negativos
        updateQuantity(product.id, newQuantity);
    };

    // Abrir modal de confirmación para vaciar carrito
    const handleClearCartClick = () => setConfirmOpen(true);

    // Confirmar vaciar carrito
    const confirmClearCart = async () => {
        await clearCart();
        setConfirmOpen(false);
        setOpen(false);
    };

    // Enviar pedido y mostrar modal de éxito
    const handleSendOrder = () => {
        window.open(`https://wa.me/5491164094722?text=${message}`, "_blank");
        setAfterSendOpen(true);
        setOpen(false);
    };

    const handleClearCartAndClose = async () => {
        await clearCart();
    };

    useEffect(() => {
        if (open) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [open]);

    return (
        <div>
            <motion.button
                onClick={() => setOpen(true)}
                aria-label="Abrir carrito"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-pink-600 text-white rounded-full p-2 shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-400 transition flex items-center justify-center z-50 text-lg"
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

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setOpen(false)}
                        />

                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.5, ease: easeInOut }}
                            className="fixed top-0 right-0 h-full w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl border-l border-white/30 z-50 p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
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
                                    <div className="max-h-[60vh] overflow-y-auto pr-2 mb-4">
                                        {Object.entries(groupedByThemeUI).map(([theme, items]) => (
                                            <div key={theme} className="mb-6">
                                                <h4 className="text-lg font-semibold mb-2 border-b border-pink-600">
                                                    {theme.toUpperCase()}
                                                </h4>
                                                <ul className="space-y-2">
                                                    {items.map(({ product, quantity }) => (
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
                                            </div>
                                        ))}
                                    </div>

                                    {discountRate > 0 ? (
                                        <div className="mb-1 border-t border-gray-300 pt-1 text-red-600 font-semibold">
                                            <p>Descuento por venta mayorista: -${discountAmount.toFixed(2)}</p>
                                        </div>
                                    ) : (
                                        <div className="mb-1 border-t border-gray-300 pt-1 text-gray-400 font-semibold italic">
                                            <p>Precio mayorista +20 productos</p>
                                        </div>
                                    )}

                                    <p className="text-lg font-semibold mb-2">
                                        Total {discountRate > 0 ? "(con descuento)" : ""}: ${finalTotal.toFixed(2)}
                                    </p>

                                    <div className="flex justify-between">
                                        <button
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                                            onClick={handleClearCartClick}
                                        >
                                            Vaciar
                                        </button>
                                        <button
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                                            onClick={handleSendOrder}
                                        >
                                            Enviar pedido ahora
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <p className="text-center text-gray-700">No hay productos en el carrito.</p>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {confirmOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 flex items-center justify-center  bg-black/50 z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmOpen(false)}
                        />
                        <motion.div
                            className="fixed inset-0 flex items-center justify-center  z-50"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                        >
                            <div className="bg-white rounded-lg p-6 max-w-sm w-full m shadow-lg text-center">
                                <p className="mb-4 text-lg font-medium">
                                    ¿Estás seguro que quieres vaciar el carrito?
                                </p>
                                <div className="flex justify-center gap-4 text-white">
                                    <button
                                        onClick={confirmClearCart}
                                        className="px-3 py-1 bg-red-400 text-wheat rounded hover:bg-red-500 transition"
                                    >
                                        Vaciar
                                    </button>
                                    <button
                                        onClick={() => setConfirmOpen(false)}
                                        className="px-5 py-3 bg-green-500 rounded hover:bg-green-700 transition"
                                    >
                                        Seguir Comprando
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <AfterSendModal
                open={afterSendOpen}
                onClose={() => setAfterSendOpen(false)}
                onClearCart={handleClearCartAndClose}
                onResendOrder={handleSendOrder}
                onContinueChoosing={() => {
                    setAfterSendOpen(false);
                    setOpen(true);
                }}
            />
        </div>
    );
}
