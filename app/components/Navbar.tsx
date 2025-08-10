"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import CartModal from "./CartModal";
import Image from "next/image";

const themes = [
    { key: "adolescentes", label: "Adolescentes" },
    { key: "babyshower", label: "Babyshower" },
    { key: "despedida", label: "Despedida Solterx" },
    { key: "casamiento", label: "Casamiento" },
    { key: "Levanta-Animo", label: "Levanta Animo" },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "auto";
    }, [menuOpen]);

    return (
        <nav className="sticky inset-0 w-full z-50 bg-[#328AC2] shadow-md">
            <div className="flex items-center justify-between mx-6">
                {/* Logo */}
                <Link href="/">
                    <Image
                        src="/LaSuerteEsLoca.png"
                        alt="La Suerte es Loca"
                        width={60}
                        height={60}
                        className="hover:opacity-80 transition-opacity"
                        priority={true}
                    />
                </Link>


                {/* Separador vertical */}
                <div className="w-px h-6 bg-white/50 mx-4" />

                {/* Temáticas escritorio */}
                <div className="hidden sm:flex gap-6 items-center">
                    {themes.map((theme) => (
                        <Link
                            key={theme.key}
                            href={`/products?theme=${theme.key}`}
                            className="text-sm font-semibold text-white hover:text-[#CA8B41] transition-colors"
                        >
                            {theme.label}
                        </Link>
                    ))}
                </div>


                {/* Separador vertical */}
                <div className="w-px h-6 bg-white/50 mx-4" />
                {/* Link Sobre Nosotros */}
                <Link
                    href="/nosotros"
                    className="text-sm font-semibold text-white hover:text-[#CA8B41] transition-colors"
                >
                    Sobre Nosotros
                </Link>

                {/* Separador vertical */}
                <div className="w-px h-6 bg-white/50 mx-4" />
                {/* Carrito + menú móvil */}
                <div className="flex items-center gap-4">
                    <CartModal />
                    <button
                        className="sm:hidden p-2 rounded-md hover:bg-[#7B9CAE]/30"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? (
                            <FiX className="w-6 h-6 text-white" />
                        ) : (
                            <FiMenu className="w-6 h-6 text-white" />
                        )}
                    </button>
                </div>
            </div>

            {/* Menú móvil */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/40 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                        />
                        <motion.div
                            className="fixed top-0 right-0 h-full w-[75%] sm:w-[300px] bg-[#328AC2] shadow-lg z-50 p-6 flex flex-col gap-6 overflow-y-auto"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "tween", duration: 0.4, ease: easeInOut }}
                        >
                            {/* Título móvil */}
                            <h3 className="sm:hidden text-white text-lg font-bold px-4 mb-2 border-b border-white/30">
                                Temáticas
                            </h3>

                            {themes.map((theme) => (
                                <Link
                                    key={theme.key}
                                    href={`/products?theme=${theme.key}`}
                                    className="px-4 py-2 font-semibold text-white hover:bg-[#7B9CAE]/30 rounded-md"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {theme.label}
                                </Link>
                            ))}

                            {/* Separador y nuevo título para Nosotros */}
                            <h3 className="sm:hidden text-white text-lg font-bold px-4 mt-6 mb-2 border-b border-white/30">
                                Más Información
                            </h3>
                            <Link
                                href="/nosotros"
                                className="px-4 py-2 font-semibold text-white hover:bg-[#7B9CAE]/30 rounded-md"
                                onClick={() => setMenuOpen(false)}
                            >
                                Sobre Nosotros
                            </Link>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav>
    );
}
