import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, Share2, Link as LinkIcon, Edit, RotateCcw, Cloud, Check, Filter } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const FILTER_PRESETS = [
    { name: 'Normal', class: '' },
    { name: 'B&W', class: 'grayscale' },
    { name: 'Sepia', class: 'sepia' },
    { name: 'Vintage', class: 'contrast-125 sepia-[.3] hue-rotate-[-10deg]' },
    { name: 'Cool', class: 'hue-rotate-[30deg] contrast-110' }
];

export default function Gallery({ refreshTrigger }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/images`, { params: { user_id: 'user_123' } });

            const mapped = (res.data.images || []).map(item => ({
                id: item.image_id,
                ...item
            }));
            setImages(mapped);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load images");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, [refreshTrigger]);

    const handleDelete = async (e, imageId) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this image?")) return;

        try {
            toast.loading("Deleting...");
            await axios.delete(`${API_URL}/delete`, {
                params: { id: imageId, user_id: 'user_123' }
            });
            toast.dismiss();
            toast.success("Image deleted");
            setImages(prev => prev.filter(img => img.image_id !== imageId));
        } catch (err) {
            toast.dismiss();
            toast.error("Failed to delete");
        }
    };

    const handleShare = (e, url) => {
        e.stopPropagation();
        // Prefer navigator.share if mobile/supported
        if (navigator.share) {
            navigator.share({
                title: 'Check out this image!',
                url: url
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(url);
            toast.success("Image Link Copied!");
        }
    };

    const handleForceDownload = async (e, url, filename) => {
        e.stopPropagation();
        const toastId = toast.loading("Downloading...");
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename || 'download.jpg'; // Force download attribute
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(a);

            toast.success("Download started", { id: toastId });
        } catch (err) {
            console.error(err);
            toast.error("Download failed", { id: toastId });
            // Fallback to open
            window.open(url, '_blank');
        }
    };

    const handleBackup = (e) => {
        e.stopPropagation();
        toast.promise(
            new Promise(resolve => setTimeout(resolve, 1000)),
            {
                loading: 'Backing up to Cloud...',
                success: 'Backup Successful!',
                error: 'Backup failed',
            }
        );
    };

    const handleRestore = (e) => {
        e.stopPropagation();
        toast.success("Image Restored (Simulation)");
    };

    const GalleryImageCard = ({ item }) => {
        const [src, setSrc] = useState(null);
        const [showActions, setShowActions] = useState(false);
        const [activeFilter, setActiveFilter] = useState('');
        const [showFilterMenu, setShowFilterMenu] = useState(false);

        useEffect(() => {
            const getUrl = async () => {
                try {
                    const res = await axios.get(`${API_URL}/generate-download-url`, { params: { id: item.image_id } });
                    setSrc(res.data.download_url);
                } catch {
                    setSrc(null);
                }
            };
            getUrl();
        }, [item]);

        if (!src) return <div className="w-full h-72 bg-slate-800/50 animate-pulse rounded-xl" />;

        return (
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full h-72 group"
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => { setShowActions(false); setShowFilterMenu(false); }}
            >
                {/* Premium Card Style */}
                <div className="absolute inset-0 bg-[#0f1115] rounded-xl border border-white/10 overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                    {/* Header Bar */}
                    <div className="h-8 bg-[#1a1d24] flex items-center px-3 gap-1.5 border-b border-white/5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                        <span className="ml-auto text-[10px] text-slate-500 font-mono truncate max-w-[100px]">
                            {item.original_filename || 'IMG.css'}
                        </span>
                    </div>

                    {/* Image Area */}
                    <div className="relative h-[calc(100%-2rem)] p-2">
                        <img
                            src={src}
                            className={`w-full h-full object-cover rounded-lg transition-all duration-300 ${activeFilter}`}
                            alt=""
                        />

                        {/* Hover Overlay Actions */}
                        <div className={`absolute inset-0 bg-black/70 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 transition-opacity duration-200 ${showActions ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>

                            {/* Primary Actions Row */}
                            <div className="flex gap-3">
                                <button
                                    onClick={(e) => handleForceDownload(e, src, item.original_filename)}
                                    className="p-2.5 rounded-full bg-white/10 hover:bg-blue-500/20 text-white hover:text-blue-400 border border-white/10 transition-all transform hover:scale-110"
                                    title="Download (JPG/PNG)"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setShowFilterMenu(!showFilterMenu); }}
                                    className={`p-2.5 rounded-full bg-white/10 hover:bg-purple-500/20 text-white hover:text-purple-400 border border-white/10 transition-all transform hover:scale-110 ${showFilterMenu ? 'bg-purple-500/20 text-purple-400' : ''}`}
                                    title="Apply Filters"
                                >
                                    <Filter className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => handleShare(e, src)}
                                    className="p-2.5 rounded-full bg-white/10 hover:bg-green-500/20 text-white hover:text-green-400 border border-white/10 transition-all transform hover:scale-110"
                                    title="Share Link"
                                >
                                    <LinkIcon className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Secondary Actions Row */}
                            <div className="flex gap-2">
                                <button
                                    onClick={handleBackup}
                                    className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-xs text-slate-300 border border-white/10 flex items-center gap-1 transition-colors"
                                >
                                    <Cloud className="w-3 h-3" /> Backup
                                </button>
                                <button
                                    onClick={(e) => handleDelete(e, item.image_id)}
                                    className="px-3 py-1.5 rounded-md bg-white/5 hover:bg-red-900/30 text-xs text-red-400 border border-white/10 flex items-center gap-1 transition-colors"
                                >
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                            </div>

                            {/* Filter Menu Overlay */}
                            <AnimatePresence>
                                {showFilterMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute bottom-16 bg-[#1a1d24] border border-white/10 rounded-lg p-2 flex flex-col gap-1 w-32 shadow-xl z-20"
                                    >
                                        <span className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 px-1">Filters</span>
                                        {FILTER_PRESETS.map(filter => (
                                            <button
                                                key={filter.name}
                                                onClick={(e) => { e.stopPropagation(); setActiveFilter(filter.class); }}
                                                className={`text-left text-xs px-2 py-1.5 rounded hover:bg-white/10 transition-colors flex justify-between ${activeFilter === filter.class ? 'text-blue-400 bg-blue-500/10' : 'text-slate-300'}`}
                                            >
                                                {filter.name}
                                                {activeFilter === filter.class && <Check className="w-3 h-3" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <span className="absolute bottom-3 text-[10px] text-slate-500 bg-black/50 px-2 py-1 rounded-full">
                                {item.tag || '#untagged'}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="w-full min-h-screen bg-black p-8 pt-24">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">My CloudBox</h2>
                        <p className="text-slate-400 text-sm">{images.length} items stored securely.</p>
                    </div>
                    {/* Refresh/Sort controls could go here */}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-72 bg-[#0f1115] rounded-xl border border-white/10 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-20"
                    >
                        <AnimatePresence>
                            {images.map((img) => (
                                <GalleryImageCard key={img.image_id} item={img} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {!loading && images.length === 0 && (
                    <div className="text-center py-20 text-slate-500">
                        <p>No images yet. Upload some above!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
