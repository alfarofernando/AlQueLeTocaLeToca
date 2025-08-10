'use client';

import { useState, useEffect, useRef } from "react";
import { useProducts } from "../hooks/useProducts";
import { ProductType } from "../types/ProductType";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { findBestCombination } from "../utils/findBestCombination";
import Spinner from "./Spinner";
import { FiRefreshCw, FiShoppingCart } from "react-icons/fi";
import ProductItem from "./ProductItem";

export default function SorpresaAleatoria({ budget = 10000 }: { budget?: number }) {
    const { products, error } = useProducts();
    const [inputBudget, setInputBudget] = useState<number>(budget);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [showContent, setShowContent] = useState<boolean>(false);
    const [loadingContent, setLoadingContent] = useState<boolean>(false);
    const [animating, setAnimating] = useState<boolean>(false);
    const [bestCombo, setBestCombo] = useState<{ product: ProductType; quantity: number }[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number>(0);
    const { addToCart } = useCart();
    const [loadingAddAll, setLoadingAddAll] = useState(false);

    // Estado para controlar qué producto tiene la info abierta (por id), o null si ninguno
    const [openInfoId, setOpenInfoId] = useState<number | null>(null);

    // Convierte array simple a array con cantidad agrupada
    function groupByQuantity(productsList: ProductType[]) {
        const map = new Map<number, { product: ProductType; quantity: number }>();
        for (const prod of productsList) {
            if (map.has(prod.id)) {
                map.get(prod.id)!.quantity++;
            } else {
                map.set(prod.id, { product: prod, quantity: 1 });
            }
        }
        return Array.from(map.values());
    }

    const toggleOpen = async () => {
        if (isOpen) {
            setIsOpen(false);
            setShowContent(false);
            setLoadingContent(false);
            setAnimating(false);
            setOpenInfoId(null); // cerrar cualquier info abierta al cerrar todo
            return;
        }

        setIsOpen(true);
        setLoadingContent(true);
        setShowContent(false);
        setAnimating(true);

        // Simular espera mínima de 3 segundos
        await new Promise((res) => setTimeout(res, 3000));

        if (products) {
            const combo = findBestCombination(products, inputBudget);
            setBestCombo(groupByQuantity(combo));
        }

        setLoadingContent(false);
        setShowContent(true);
        setTimeout(() => setAnimating(false), 600);
    };

    // Actualiza altura del contenedor, usando requestAnimationFrame para asegurar que DOM está actualizado
    const updateContentHeight = () => {
        requestAnimationFrame(() => {
            if (contentRef.current) {
                setContentHeight(contentRef.current.scrollHeight);
            }
        });
    };

    // Maneja abrir/cerrar info de un producto
    const handleToggleInfo = (id: number) => {
        setOpenInfoId((prev) => (prev === id ? null : id));
    };

    // Recalcular altura cuando cambia el contenido visible o el producto con info abierta
    useEffect(() => {
        if (showContent && contentRef.current) {
            updateContentHeight();
        } else {
            setContentHeight(0);
        }
    }, [showContent, bestCombo, inputBudget, openInfoId]);

    if (error) return <p className="text-red-500">Error: {error.message}</p>;

    return (
        <div className="px-4 mb-12">
            {/* Input para presupuesto */}
            <div className="flex flex-col items-center gap-4 m-3 shadow-md rounded-2xl p-6 max-w-md mx-auto ">
                <p className="text-center text-gray-600 text-sm italic">
                    ¿Indeciso? Prueba nuestro sistema de <span className="font-semibold text-pink-600">Sorpresa Aleatoria</span> y déjate sorprender.
                </p>

                <label
                    htmlFor="budgetInput"
                    className="font-semibold text-lg text-gray-700 whitespace-nowrap"
                >
                    Presupuesto:
                </label>
                <input
                    id="budgetInput"
                    type="number"
                    min={0}
                    max={99999999}
                    value={inputBudget}
                    onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 99999999) val = 99999999;
                        setInputBudget(val);
                    }}
                    placeholder="Ingresa tu presupuesto"
                    className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg
               focus:outline-none focus:ring-4 focus:ring-pink-400
               text-lg transition"
                />

                <button
                    onClick={toggleOpen}
                    disabled={loadingContent || animating}
                    className={`w-full flex justify-center items-center gap-2 px-5 py-3 rounded-lg text-white font-semibold
                transition-colors duration-300
                ${isOpen ? "bg-pink-700 hover:bg-pink-800 animate-pulse" : "bg-pink-600 hover:bg-pink-700"}
                disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label="Activar sorpresas aleatorias"
                    title={isOpen ? "Intenta de nuevo :)" : "Sorpresas Aleatorias"}
                >
                    {isOpen ? (
                        <>
                            <FiRefreshCw className="w-5 h-5" />
                            Intenta de nuevo :)
                        </>
                    ) : (
                        <>
                            <FiShoppingCart className="w-5 h-5" />
                            Sorpresas Aleatorias
                        </>
                    )}
                </button>
            </div>

            {/* Contenedor resultados */}
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        id="best-combo-content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: 1,
                            height: loadingContent ? 200 : contentHeight,
                        }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        ref={contentRef}
                        className=" p-6 text-gray-800"
                    >
                        {loadingContent && (
                            <div className="flex justify-center items-center h-56">
                                <Spinner />
                            </div>
                        )}

                        {showContent && (
                            <>
                                {bestCombo.length === 0 ? (
                                    <p className="text-center text-gray-500 text-lg font-medium">
                                        No hay combinaciones posibles con ese presupuesto.
                                    </p>
                                ) : (
                                    <>
                                        <ul className="space-y-1">
                                            {bestCombo.map(({ product, quantity }) => (
                                                <ProductItem
                                                    key={product.id}
                                                    product={product}
                                                    quantity={quantity}
                                                    addToCart={addToCart}
                                                    isInfoOpen={openInfoId === product.id}
                                                    onToggleInfo={() => handleToggleInfo(product.id)}
                                                />
                                            ))}
                                        </ul>

                                        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 my-6 shadow-lg rounded-2xl p-4 bg-white max-w-md mx-auto">
                                            <p className="font-bold text-pink-700 text-lg sm:text-xl">
                                                Total: ${bestCombo.reduce((sum, p) => sum + p.product.price * p.quantity, 0).toLocaleString()}
                                            </p>
                                            <button
                                                onClick={async () => {
                                                    setLoadingAddAll(true);
                                                    for (const { product, quantity } of bestCombo) {
                                                        await addToCart(product.id, quantity);
                                                    }
                                                    setLoadingAddAll(false);
                                                }}
                                                disabled={loadingAddAll}
                                                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                                                aria-label="Agregar toda la lista al carrito"
                                            >
                                                {loadingAddAll ? (
                                                    <div className="flex items-center gap-2 justify-center">
                                                        <span>Agregando...</span>
                                                    </div>

                                                ) : (
                                                    "Agregar todo"
                                                )}
                                            </button>
                                        </div>

                                    </>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
