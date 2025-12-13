import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Trash2, Calendar, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4566';

export default function Gallery({ refreshTrigger }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('All');

    const fetchImages = async (tag = '') => {
        try {
            setLoading(true);
            const params = { user_id: 'user_123' }; // Hardcoded user for demo
            if (tag && tag !== 'All') params.tag = tag;

            const res = await axios.get(`${API_URL}/images`, { params });
            // DynamoDB response structure from handler: { images: [...] }
            // Each item: { image_id, s3_key, upload_time, tags, content_type ... }

            // Mapper:
            const mapped = (res.data.images || []).map(item => ({
                id: item.image_id,
                url: `${API_URL}/generate-download-url?id=${item.image_id}`, // This returns JSON {download_url}. We need to fetch IT, or use a direct S3 link?
                // Wait, GET /generate-download-url returns a JSON with presigned URL. 
                // We can't put that directly in <img src>.
                // We need to resolve it OR, for public buckets, use direct URL.
                // Since this is a "secure" app with presigned URLs, we technically need to async fetch the signed URL for EACH image.
                // OPTIMIZATION: For the gallery view, maybe we cheat and assume public read for demo OR 
                // we actually fetch the signed URL. 
                // Let's implement a sub-component <GalleryItem> that fetches its own signed URL?
                // Or better, for "GET /images", the backend *could* pre-generate signed URLs?
                // The current backend doesn't.
                // Let's do client-side resolving. It's slower but correct.

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
        fetchImages(activeFilter);
    }, [activeFilter, refreshTrigger]);

    const handleDownload = async (id) => {
        try {
            const res = await axios.get(`${API_URL}/generate-download-url`, { params: { id } });
            if (res.data.download_url) {
                window.open(res.data.download_url, '_blank');
            }
        } catch (e) {
            toast.error("Download failed");
        }
    };

    // Sub-component to handle async image source resolution
    const GalleryImage = ({ item }) => {
        const [src, setSrc] = useState(null);

        useEffect(() => {
            const getUrl = async () => {
                try {
                    // For localstack demo, direct S3 url might work if public?
                    // But let's use the API as designed.
                    const res = await axios.get(`${API_URL}/generate-download-url`, { params: { id: item.image_id } });
                    setSrc(res.data.download_url);
                } catch (e) {
                    // Fallback or error
                    console.error("Failed to sign url for", item.image_id);
                }
            };
            getUrl();
        }, [item.image_id]);

        if (!src) return <div className="w-full h-full bg-slate-800 animate-pulse" />;

        return (
            <img
                src={src}
                alt="Gallery Item"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto mt-24 px-4 pb-20">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                    Your Gallery <span className="text-sm font-normal text-slate-400">({images.length})</span>
                </h2>
                <div className="flex gap-2 flex-wrap justify-center">
                    {['All', 'nature', 'tech', 'building', 'people'].map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-full text-sm transition-all border ${activeFilter === filter
                                    ? 'bg-blue-500 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                                }`}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                    ))}
                    <button onClick={() => fetchImages(activeFilter)} className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-colors" title="Refresh">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {loading && images.length === 0 ? (
                <div className="text-center text-slate-400 py-20">Loading memories...</div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <AnimatePresence>
                        {images.map((img, index) => (
                            <motion.div
                                key={img.image_id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-800 border border-white/5 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-shadow"
                            >
                                <GalleryImage item={img} />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {/* Tags can be array or single string */}
                                        {(Array.isArray(img.tags) ? img.tags : [img.tag]).filter(Boolean).map(t => (
                                            <span key={t} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-white/20 text-white backdrop-blur-md">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-300 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> {new Date(img.upload_time || Date.now()).toLocaleDateString()}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleDownload(img.image_id)}
                                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors text-white"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            {/* Delete functionality could be added here similarly */}
                                            <button className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 backdrop-blur-md transition-colors text-red-200">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {!loading && images.length === 0 && (
                <div className="text-center text-slate-500 py-20">No images found. Time to upload some!</div>
            )}
        </div>
    );
}
