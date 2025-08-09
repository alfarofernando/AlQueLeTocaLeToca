"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiTrash2, FiShoppingCart, FiRepeat } from "react-icons/fi";

type AfterSendModalProps = {
    open: boolean;
    onClose: () => void;
    onClearCart: () => void;
    onResendOrder: () => void;
    onContinueChoosing: () => void;
};

export default function AfterSendModal({
    open,
    onClose,
    onClearCart,
    onResendOrder,
    onContinueChoosing,
}: AfterSendModalProps) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl text-center">
                            <FiCheckCircle className="mx-auto mb-3 text-green-500" size={48} />
                            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Pedido enviado</h2>
                            <p className="mb-6 text-gray-600 text-lg">
                                ¿Qué querés hacer ahora?
                            </p>
                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={() => {
                                        onClearCart();
                                        onClose();
                                    }}
                                    className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow transition"
                                >
                                    <FiTrash2 size={20} />
                                    Vaciar carrito
                                </button>

                                <button
                                    onClick={() => {
                                        onContinueChoosing();
                                        onClose();
                                    }}
                                    className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow transition"
                                >
                                    <FiShoppingCart size={20} />
                                    Seguir eligiendo
                                </button>

                                <button
                                    onClick={() => {
                                        onResendOrder();
                                    }}
                                    className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition"
                                >
                                    <FiRepeat size={20} />
                                    Reenviar pedido
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
