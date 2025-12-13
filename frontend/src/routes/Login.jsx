import React from 'react';
import Auth from '@/components/Auth';
import PremiumBackground from '@/components/PremiumBackground';
import { motion } from 'framer-motion';

export default function Login() {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Decoration */}
            <PremiumBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="z-10 w-full"
            >
                <Auth />
            </motion.div>
        </div>
    );
}
