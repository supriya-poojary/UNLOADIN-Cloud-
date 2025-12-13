import React, { useState } from 'react';
import Hero3D from '@/components/Hero3D';
import UploadZone from '@/components/UploadZone';
import Gallery from '@/components/Gallery';
import SuccessConfetti from '@/components/SuccessConfetti';
import PremiumBackground from '@/components/PremiumBackground';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [showConfetti, setShowConfetti] = useState(false);
    const [refreshGallery, setRefreshGallery] = useState(0);
    const navigate = useNavigate();

    const handleUploadComplete = () => {
        console.log("Upload completed, refreshing gallery...");
        setShowConfetti(true);
        setRefreshGallery(prev => prev + 1);
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="relative min-h-screen">
            <PremiumBackground />
            <SuccessConfetti show={showConfetti} onComplete={() => setShowConfetti(false)} />
            <Hero3D />

            {/* Navbar Overlay */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-transparent backdrop-blur-sm pointer-events-auto">
                <div className="text-xl font-bold font-sans tracking-tighter text-white">
                    Cloud<span className="text-blue-400">Box</span>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </nav>

            <main className="relative z-10 flex flex-col items-center pt-32 pb-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300 mb-4 tracking-tight">
                        Your Creative Space
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto">
                        Upload, manage, and share your digital assets with style.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="w-full mb-16"
                >
                    <UploadZone onUploadComplete={handleUploadComplete} />
                </motion.div>

                <Gallery refreshTrigger={refreshGallery} />

            </main>
        </div>
    );
}
