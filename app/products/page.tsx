"use client";

import { useSearchParams } from "next/navigation";
import { useProducts } from "../hooks/useProducts";
import ProductCard from "./components/ProductCard";
import ProductCardSkeleton from "./components/ProductCardSkeleton";
import { motion, AnimatePresence, useMotionValue, useTransform, useAnimationFrame } from "framer-motion";
import { temasDescripcion } from "../data/temasDescripcion";
import Image from "next/image";

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const theme = searchParams.get("theme") || undefined;
    const { products, loading, error } = useProducts(theme);

    // Buscar la descripción según tema
    const temaInfo = temasDescripcion.find((t) => t.theme === theme);

    // Animación de rotación para iconos decorativos
    const rotate = useMotionValue(0);
    const inverseRotate = useTransform(rotate, (v) => -v);
    useAnimationFrame((t, delta) => {
        rotate.set((rotate.get() + (360 / 30000) * delta) % 360);
    });

    if (error) {
        return (
            <p className="mt-24 px-6 text-red-500">
                Error: {error.message}
            </p>
        );
    }

    return (
        <div className="mt-2 px-6 max-w-7xl mx-auto flex flex-col gap-4">
            {/* Cabecera temática */}
            {/* Cabecera temática */}
            {temaInfo && (
                <motion.section
                    className="relative flex flex-col items-center text-center gap-6 p-6 rounded-2xl bg-pink-50 shadow-md overflow-hidden"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.h1
                        className="text-3xl md:text-4xl font-extrabold text-pink-600 drop-shadow-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        {temaInfo.theme.charAt(0).toUpperCase() + temaInfo.theme.slice(1)}
                    </motion.h1>

                    {/* Animación suave en el cambio de texto */}
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={temaInfo.theme} // Clave para que detecte el cambio de contenido
                            className="text-lg text-gray-700 max-w-3xl leading-relaxed"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.5 }}
                        >
                            {temaInfo.description}
                        </motion.p>
                    </AnimatePresence>

                    {/* Iconos decorativos */}
                    <motion.div
                        className="absolute top-4 right-4 w-20 h-20 opacity-20"
                        style={{ rotate }}
                    >
                        <Image src="/3.png" alt="Decoración" fill style={{ objectFit: "contain" }} />
                    </motion.div>
                    <motion.div
                        className="absolute bottom-4 left-4 w-16 h-16 opacity-20"
                        style={{ rotate: inverseRotate }}
                    >
                        <Image src="/3.png" alt="Decoración" fill style={{ objectFit: "contain" }} />
                    </motion.div>
                </motion.section>
            )}


            {/* Lista de productos */}
            <motion.div
                className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.1 }
                    }
                }}
            >
                <AnimatePresence>
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))
                        : products.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20, scale: 0.95 },
                                    visible: { opacity: 1, y: 0, scale: 1 }
                                }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                exit={{ opacity: 0 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
