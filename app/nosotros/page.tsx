"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FiMail, FiPhone, FiMessageCircle, FiFacebook, FiInstagram } from "react-icons/fi";

export default function AboutUsPage() {
    return (
        <main className="min-h-screen backdrop-blur-lg max-w-7xl mx-auto px-6 py-12 flex flex-col gap-16">
            {/* Título principal */}
            <motion.h1
                className="text-2xl sm:text-3xl font-extrabold text-pink-600 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                Sobre Nosotros
            </motion.h1>

            {/* Fila 1: Texto a la izquierda, foto a la derecha */}
            <motion.section
                className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto text-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <article className="md:flex-1 max-w-xl text-base sm:text-lg leading-relaxed space-y-6">
                    <h2 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-4">Nuestra Historia</h2>
                    <p>
                        Somos un matrimonio que junto a nuestros dos hijos hemos descubierto el verdadero significado de regalar: no es el objeto, sino la emoción que nace de la acción. La risa espontánea, la sonrisa sincera y esos momentos compartidos que quedan tatuados en el alma.
                    </p>
                    <p>
                        Cada detalle, cada sorpresa, es el reflejo de un amor genuino y una dedicación profunda. En <span className="font-semibold text-pink-600">La Suerte Es Loca</span>, transformamos esta experiencia vivida en un compromiso diario para crear regalos que toquen corazones y construyan recuerdos eternos.
                    </p>
                </article>

                <motion.div
                    className="md:flex-1 rounded-xl shadow-lg overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ width: 350, height: 350, position: "relative" }}
                >
                    <Image
                        src="/nosotros1.jpg"
                        alt="Matrimonio feliz"
                        fill
                        style={{ objectFit: "contain", borderRadius: "0.75rem" }}
                        priority
                    />
                </motion.div>
            </motion.section>

            {/* Fila 2: Foto a la izquierda, contacto a la derecha */}
            <motion.section
                className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto text-pink-700 font-semibold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            >
                <motion.div
                    className="md:flex-1 rounded-xl overflow-hidden"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ width: 350, height: 350, position: "relative" }}
                >
                    <Image
                        src="/nosotros2.jpg"
                        alt="Niños felices jugando"
                        fill
                        style={{ objectFit: "contain", borderRadius: "0.75rem" }}
                        priority
                    />
                </motion.div>

                <aside
                    className="
            md:flex-1
            bg-gradient-to-tr from-pink-100 via-pink-200 to-pink-100
            rounded-xl p-8 shadow-2xl
            max-w-md w-full
            flex flex-col gap-6
            border border-pink-300
          "
                >
                    <h3 className="text-3xl font-bold text-pink-600 border-b border-pink-300 pb-3 mb-6 text-center">
                        Contáctanos
                    </h3>

                    {[
                        {
                            href: "mailto:contacto@lasuerteesloca.com",
                            icon: <FiMail className="text-pink-600" size={24} />,
                            label: "contacto@lasuerteesloca.com",
                        },
                        {
                            href: "tel:+541112223344",
                            icon: <FiPhone className="text-pink-600" size={24} />,
                            label: "+54 11 2223-344",
                        },
                        {
                            href: "https://wa.me/549112223344",
                            icon: <FiMessageCircle className="text-pink-600" size={24} />,
                            label: "WhatsApp",
                            external: true,
                        },
                        {
                            href: "https://facebook.com/lasuerteesloca",
                            icon: <FiFacebook className="text-pink-600" size={24} />,
                            label: "Facebook",
                            external: true,
                        },
                        {
                            href: "https://instagram.com/lasuerteesloca",
                            icon: <FiInstagram className="text-pink-600" size={24} />,
                            label: "Instagram",
                            external: true,
                        },
                    ].map(({ href, icon, label, external }, i) => (
                        <a
                            key={i}
                            href={href}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener noreferrer" : undefined}
                            className="flex items-center gap-3 rounded-lg bg-white p-3 shadow hover:shadow-lg transition shadow-pink-300 hover:bg-pink-50 text-base font-semibold text-pink-800"
                        >
                            {icon}
                            {label}
                        </a>
                    ))}
                </aside>
            </motion.section>

            {/* Fila 3: Texto centrado */}
            <motion.section
                className="max-w-4xl mx-auto text-center text-gray-800 text-base sm:text-lg leading-relaxed space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            >
                <h2 className="text-3xl sm:text-4xl font-bold text-pink-600 mb-6">Nuestro Sueño</h2>
                <p>
                    Nuestro mayor anhelo es que cada regalo trascienda lo material, convirtiéndose en un gesto lleno de emoción y significado profundo, capaz de unir corazones y dibujar sonrisas genuinas en quienes más amamos.
                </p>
                <p>
                    Estamos convencidos del poder transformador de la alegría compartida y de la magia que se desata cuando un pequeño detalle se convierte en un recuerdo imborrable que perdura para siempre.
                </p>
            </motion.section>
        </main>
    );
}
