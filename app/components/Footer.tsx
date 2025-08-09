"use client";

import { motion } from "framer-motion";
import { FiMail, FiInstagram } from "react-icons/fi";
import { FaFacebook } from "react-icons/fa";
import { SiWhatsapp } from "react-icons/si";

export function Footer() {
    return (
        <motion.footer
            className="backdrop-blur-md py-6 px-4 text-center max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <p className="text-gray-600 mb-2">
                &copy; {new Date().getFullYear()} Alfa:Dev. Todos los derechos reservados.
            </p>
            <p className="text-pink-600 font-semibold mb-4">
                Regalando sonrisas, una sorpresa a la vez.
            </p>

            <div className="flex justify-center gap-6 text-gray-600 text-xl">
                <a href="mailto:contacto@alfadev.com" aria-label="Email" className="hover:text-pink-600 transition">
                    <FiMail />
                </a>

                <a href="https://wa.me/54901123456789" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-pink-600 transition">
                    <SiWhatsapp />
                </a>

                <a href="https://facebook.com/alfadev" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-pink-600 transition">
                    <FaFacebook />
                </a>
                <a href="https://instagram.com/alfadev" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-600 transition">
                    <FiInstagram />
                </a>
            </div>
        </motion.footer>
    );
}
