"use client";

import { useState, useEffect, useRef } from "react";
import { useProducts } from "../hooks/useProducts";
import { ProductType } from "../types/ProductType";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function BestCombination({ budget = 10000 }: { budget?: number }) {
    const { products, loading, error } = useProducts();
    const [inputBudget, setInputBudget] = useState<number>(budget);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [showContent, setShowContent] = useState<boolean>(false);
    const [loadingContent, setLoadingContent] = useState<boolean>(false);
    const [animating, setAnimating] = useState<boolean>(false);
    const [bestCombo, setBestCombo] = useState<{ product: ProductType, quantity: number }[]>([]);
    const contentRef = useRef<HTMLDivElement>(null);
    const [contentHeight, setContentHeight] = useState<number>(0);
    const { addToCart } = useCart();


    // Función que busca una combinación aleatoria válida, no la mejor exacta
    const findRandomCombination = (products: ProductType[], maxBudget: number): { product: ProductType, quantity: number }[] => {
        if (!products.length) return [];

        const filtered = products.filter((p) => p.price <= maxBudget);
        if (!filtered.length) return [];

        let bestCombo: { product: ProductType, quantity: number }[] = [];
        let bestTotal = 0;
        const attempts = 300;

        for (let i = 0; i < attempts; i++) {
            let combo: ProductType[] = [];
            let total = 0;

            while (true) {
                const randomProduct = filtered[Math.floor(Math.random() * filtered.length)];
                if (total + randomProduct.price > maxBudget) break;

                combo.push(randomProduct);
                total += randomProduct.price;
            }

            if (total > bestTotal) {
                // Agrupar
                const grouped = combo.reduce<{ [key: string]: { product: ProductType, quantity: number } }>((acc, item) => {
                    if (acc[item.id]) {
                        acc[item.id].quantity += 1;
                    } else {
                        acc[item.id] = { product: item, quantity: 1 };
                    }
                    return acc;
                }, {});
                bestCombo = Object.values(grouped);
                bestTotal = total;
            }
        }

        return bestCombo;
    };


    const toggleOpen = () => {
        if (isOpen) {
            setIsOpen(false);
            setShowContent(false);
            setLoadingContent(false);
            setAnimating(false);
        } else {
            setIsOpen(true);
            setLoadingContent(true);
            setShowContent(false);
            setAnimating(true);

            setTimeout(() => {
                if (products) {
                    const combo = findRandomCombination(products, inputBudget);
                    setBestCombo(combo);
                }
                setLoadingContent(false);
                setShowContent(true);

                setTimeout(() => setAnimating(false), 600);
            }, 1000);
        }
    };

    useEffect(() => {
        if (isOpen && products) {
            setLoadingContent(true);
            setShowContent(false);
            setAnimating(true);

            setTimeout(() => {
                const combo = findRandomCombination(products, inputBudget);
                setBestCombo(combo);
                setLoadingContent(false);
                setShowContent(true);

                setTimeout(() => setAnimating(false), 600);
            }, 1000);
        }
    }, [inputBudget, isOpen, products]);

    // Actualizar altura real del contenido cada vez que cambia showContent o el contenido
    useEffect(() => {
        if (showContent && contentRef.current) {
            setContentHeight(contentRef.current.scrollHeight);
        } else {
            setContentHeight(0);
        }
    }, [showContent, bestCombo, inputBudget]);

    if (loading) return <p className="text-gray-600">Cargando productos...</p>;
    if (error) return <p className="text-red-500">Error: {error.message}</p>;
    if (!products || products.length === 0) return <p>No hay productos disponibles.</p>;

    return (
        <div className="max-w-md mx-auto mt-10">
            {/* Input para ingresar presupuesto */}
            <div className="flex items-center gap-2 mb-4">
                <span>Presupuesto: </span>
                <input
                    type="number"
                    min={0}
                    max={999999999}
                    value={inputBudget}
                    onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 999999999) val = 999999999;
                        setInputBudget(val);
                    }}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
                    placeholder="Ingresa tu presupuesto"
                />

                <button
                    onClick={toggleOpen}
                    className="px-2 py-1 bg-pink-600 text-white rounded-md font-medium text-nowrap hover:bg-pink-700 transition"
                    disabled={loadingContent || animating}
                >
                    {isOpen ? "Intenta de nuevo :)" : "Sorpresas Aleatorias"}
                </button>
            </div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="content"
                        id="best-combo-content"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: contentHeight }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="overflow-hidden p-4 border rounded-lg shadow bg-white text-gray-700"
                        ref={contentRef}
                    >
                        {showContent && (
                            <>
                                <p className="mb-4 text-gray-600">
                                    Presupuesto actual: <span className="font-bold">${inputBudget}</span>
                                </p>

                                <h3 className="font-semibold mb-2">Sugerencia:</h3>

                                {bestCombo.length === 0 ? (
                                    <p>No hay combinaciones posibles con ese presupuesto.</p>
                                ) : (
                                    <>
                                        <ul className="space-y-2">
                                            {bestCombo.map(({ product, quantity }) => (
                                                <li
                                                    key={product.id}
                                                    className="flex justify-between items-center border rounded p-2 bg-gray-50"
                                                >
                                                    <div>
                                                        <p className="font-medium">
                                                            {quantity}x {product.name} - ${product.price * quantity}
                                                        </p>
                                                        <p className="text-sm text-gray-500 italic">({product.theme})</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            for (let i = 0; i < quantity; i++) {
                                                                addToCart(product.id);
                                                            }
                                                        }}
                                                        className="bg-green-500 text-white text-sm px-3 py-1 rounded hover:bg-green-600 transition"
                                                    >
                                                        Agregar {quantity > 1 ? `(${quantity})` : ""}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="flex justify-between items-center mt-4">
                                            <p className="font-semibold">
                                                Total: ${bestCombo.reduce((sum, p) => sum + p.product.price * p.quantity, 0)}
                                            </p>
                                            <button
                                                onClick={() => {
                                                    bestCombo.forEach(({ product, quantity }) => {
                                                        for (let i = 0; i < quantity; i++) {
                                                            addToCart(product.id);
                                                        }
                                                    });
                                                }}
                                                className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition text-sm"
                                            >
                                                Agregar toda la lista
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
