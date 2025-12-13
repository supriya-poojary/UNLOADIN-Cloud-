import React, { useState } from 'react';
import Hero3D from '@/components/Hero3D';
import UploadZone from '@/components/UploadZone';
import Gallery from '@/components/Gallery';
import SuccessConfetti from '@/components/SuccessConfetti';
import { motion } from 'framer-motion';

export default function Home() {
    const [showConfetti, setShowConfetti] = useState(false);

    const handleUploadComplete = () => {
        // Trigger gallery refresh logic here
        console.log("Upload completed, refreshing gallery...");
        setShowConfetti(true);
    };

    return (
        <div className="relative min-h-screen">
            <SuccessConfetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
            <Hero3D />

            <main className="relative z-10 flex flex-col items-center pt-24 pb-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300 mb-6 tracking-tight">
                        Cloud Storage. <br /> Reimagined.
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                        Secure, serverless, and stunning. Upload your moments and let us handle the rest with infinite scalability.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="w-full"
                >
                    <UploadZone onUploadComplete={handleUploadComplete} />
                </motion.div>

                <Gallery />

            </main>

            {/* Footer / Branding */}
            <footer className="relative z-10 py-8 text-center text-slate-600 text-sm border-t border-white/5 mt-auto">
                <p>© 2023 CloudService. Powered by AWS Lambda & DynamoDB.</p>
            </footer>
        </div>
    );
}
