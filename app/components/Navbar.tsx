import { useState } from "react";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import CartModal from "./CartModal";
import { FiMenu, FiX } from "react-icons/fi";

const themes = [
    { key: "diversion", label: "Diversión" },
    { key: "beauty", label: "Belleza" },
    { key: "fiesta", label: "Fiesta" },
    { key: "romantic", label: "Romántico" },
    { key: "relax", label: "Relajado" },
];

type NavbarProps = {
    selectedTheme: string | null;
    onSelectTheme: (theme: string | null) => void;
};

export default function Navbar({ selectedTheme, onSelectTheme }: NavbarProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [hovered, setHovered] = useState<string | null>(null);

    return (
        <nav className="fixed top-0 left-0 w-full z-50  shadow-md rounded-b-xl px-4 py-3">
            <div className="flex items-center w-full">
                {/* Botón hamburguesa móvil */}
                <button
                    className="sm:hidden p-2 rounded-md hover:bg-gray-200 focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? (
                        <FiX className="w-6 h-6 text-pink-600" />
                    ) : (
                        <FiMenu className="w-6 h-6 text-pink-600" />
                    )}
                </button>

                {/* Menú central */}
                <div className="flex flex-1 justify-center sm:justify-center gap-4 mt-3 sm:mt-0">
                    {themes.map((theme) => {
                        const isSelected = selectedTheme === theme.key;
                        const isHovered = hovered === theme.key;

                        return (
                            <button
                                key={theme.key}
                                onClick={() => onSelectTheme(theme.key)}
                                onMouseEnter={() => setHovered(theme.key)}
                                onMouseLeave={() => setHovered(null)}
                                className={`relative px-3 py-1 mb-2 sm:mb-0 text-sm rounded-lg font-medium transition-colors duration-200 whitespace-nowrap ${isSelected ? "text-pink-600" : "text-gray-700 hover:text-pink-600"
                                    } hidden sm:inline-flex`} // <-- esta clase oculta en móvil y muestra desde sm
                                style={{ background: "transparent" }}
                            >
                                {theme.label}
                                {(isSelected || isHovered) && (
                                    <motion.div
                                        layoutId="underline"
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600 rounded"
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => onSelectTheme(null)}
                        onMouseEnter={() => setHovered("all")}
                        onMouseLeave={() => setHovered(null)}
                        className="relative px-3 py-1 mb-2 sm:mb-0 text-sm rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium transition-colors duration-200 whitespace-nowrap hidden sm:inline-flex" // <-- igual acá
                    >
                        Ver todos
                        {hovered === "all" && (
                            <motion.div
                                layoutId="underline"
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-pink-600 rounded"
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                    </button>
                </div>

                {/* Carrito */}
                <div className="ml-auto sm:ml-0">
                    <CartModal />
                </div>
            </div>

            {/* Menú móvil con slide */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        {/* Fondo semitransparente */}
                        <motion.div
                            className="fixed inset-0 bg-black/30 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                        />

                        {/* Menú deslizante */}
                        <motion.div
                            className="fixed top-0 left-0 h-full w-full bg-white shadow-xl z-50 p-6 flex flex-col gap-6"
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "tween", duration: 0.4, ease: easeInOut }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Encabezado del menú */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-gray-800">Selecciona una temática</h2>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="text-gray-600 hover:text-pink-600 transition-colors"
                                    aria-label="Cerrar menú"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Botones de temas */}
                            <div className="flex flex-col gap-3">
                                {themes.map((theme) => (
                                    <button
                                        key={theme.key}
                                        onClick={() => {
                                            onSelectTheme(theme.key);
                                            setMenuOpen(false);
                                        }}
                                        className={`px-3 py-2 text-base rounded-lg font-medium transition-colors duration-200 whitespace-nowrap ${selectedTheme === theme.key
                                            ? "bg-pink-600 text-white"
                                            : "bg-pink-400 hover:bg-pink-500 text-white"
                                            }`}
                                    >
                                        {theme.label}
                                    </button>
                                ))}
                                <button
                                    onClick={() => {
                                        onSelectTheme(null);
                                        setMenuOpen(false);
                                    }}
                                    className="px-3 py-2 text-base rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium transition-colors duration-200 whitespace-nowrap"
                                >
                                    Ver todos
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </nav>
    );
}
