import { motion } from "framer-motion";

export default function ProductCardSkeleton() {
    return (
        <motion.div
            className="rounded-2xl border border-white/40 bg-white/30 backdrop-blur-lg shadow-xl p-6 flex flex-col justify-between h-full"
            initial={{ opacity: 0, y: 10 }}
            animate={{
                opacity: [0.6, 1, 0.6], // titileo loop
                y: [10, 0, 10],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
            }}
        >
            {/* Título */}
            <div className="flex flex-col gap-2 mb-4">
                <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto" />
                <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-full" />
                    <div className="h-4 bg-gray-300 rounded w-5/6" />
                </div>
            </div>

            {/* Precio y botón */}
            <div className="flex justify-between items-center mt-auto">
                <div className="h-5 bg-gray-300 rounded w-1/3" />
                <div className="h-9 bg-gray-300 rounded-xl w-24" />
            </div>
        </motion.div>
    );
}
