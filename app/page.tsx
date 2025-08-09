"use client";

import { motion, useMotionValue, useTransform, useAnimationFrame } from "framer-motion";
import Image from "next/image";
import SorpresaAleatoria from "./components/SorpresaAleatoria";

export default function HomePageContainer() {
  // Para hacer la contrarotación de la imagen interna
  const rotate = useMotionValue(0);
  const inverseRotate = useTransform(rotate, (value) => -value);

  useAnimationFrame((t, delta) => {
    rotate.set((rotate.get() + (360 / 20000) * delta) % 360);
  });

  return (
    <main className="min-h-screen backdrop-blur-md max-w-7xl mx-auto px-4 py-10 flex flex-col gap-16">
      {/* Primera fila: texto e imágenes */}
      <section className="flex flex-col md:flex-row gap-10 items-center justify-center">
        {/* Texto a la izquierda */}
        <motion.div
          className="flex-1 flex flex-col justify-center items-center p-8  max-w-xl"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-4xl font-extrabold text-pink-600 mb-6 text-center md:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Regalos Sorpresa Únicos
          </motion.h1>

          <motion.p
            className="text-lg text-gray-800 leading-relaxed mb-6 text-center md:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            No importa lo que haya dentro de la caja... <br />
            Lo que realmente importa es la chispa de emoción que despierta, la sonrisa inesperada, el instante mágico que se queda en la memoria.
          </motion.p>

          <motion.p
            className="italic text-pink-600 font-semibold text-center md:text-left max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            Porque los mejores regalos no se ven, se sienten.
          </motion.p>
        </motion.div>

        {/* Imágenes girando a la derecha */}
        <motion.div
          className="relative w-64 h-64"
          style={{ rotate }}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Image
            src="/3.png"
            alt="Imagen giratoria"
            fill
            style={{ objectFit: "contain" }}
            priority
          />

          <motion.div
            className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2"
            style={{ rotate: inverseRotate }}
          >
            <Image
              src="/4.png"
              alt="Imagen interna"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Segunda fila: componente sorpresa aleatoria centrado */}
      <motion.section
        className="w-full max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <SorpresaAleatoria budget={10000} />
      </motion.section>
    </main>
  );
}
