'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const Spinner = () => {
    return (
        <div className="flex items-center justify-center w-full h-full p-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    repeat: Infinity,
                    ease: 'linear',
                    duration: 3, // más rápido
                }}
                className="w-32 h-32"
            >
                <Image src="/3.png" alt="Spinner" width={128} height={128} priority />
            </motion.div>
        </div>
    );
};

export default Spinner;
