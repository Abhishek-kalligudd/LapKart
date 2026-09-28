import React from 'react';
import { motion } from 'framer-motion';
import { Laptop } from 'lucide-react';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        animate={{ rotateY: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="text-primary"
      >
        <Laptop size={64} />
      </motion.div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="mt-4 text-lg font-semibold tracking-widest text-primary"
      >
        LAPKART
      </motion.p>
    </div>
  );
}
