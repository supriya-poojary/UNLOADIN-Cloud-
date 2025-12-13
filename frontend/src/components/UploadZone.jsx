import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, File, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

// NOTE: Configure your API endpoint here.
// In dev (docker-compose), backend is exposed on port 4566 (LocalStack) or if using
// separate backend container for logic, it depends on setup.
// For now, valid S3 uploads need presigned URLs.
// Using relative path '/api' or absolute URL matching backend.
// Currently hardcoded to localhost:4566 via Vite proxy or direct if CORS allowed.
// Assuming direct call to a "backend_api_url" which we will define.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4566'; // Placeholder

export default function UploadZone({ onUploadComplete }) {
    const [file, setFile] = useState(null);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.length > 0) {
            setFile(acceptedFiles[0]);
            setTags([]); // Reset tags for new file
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1,
        multiple: false
    });

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setProgress(10); // Start progress

        try {
            // 1. Get Presigned URL
            const uploadUrlRes = await axios.post(`${API_URL}/generate-upload-url`, {
                filename: file.name,
                filetype: file.type
            });
            const { upload_url, object_name } = uploadUrlRes.data;
            setProgress(30);

            // 2. Upload to S3
            await axios.put(upload_url, file, {
                headers: { 'Content-Type': file.type }
            });
            setProgress(70);

            // 3. Save Metadata
            await axios.post(`${API_URL}/save-metadata`, {
                user_id: 'user_123', // Hardcoded for demo/simplicity or assume auth context
                image_id: object_name,
                tag: tags[0] || 'uncategorized', // Primary tag for GSI
                tags: tags, // Store all tags in list
                description: `Uploaded via web on ${new Date().toLocaleDateString()}`,
                content_type: file.type,
                original_filename: file.name
            });
            setProgress(100);

            toast.success("Image uploaded successfully!");
            if (onUploadComplete) onUploadComplete();

            // Reset
            setTimeout(() => {
                setFile(null);
                setTags([]);
                setUploading(false);
                setProgress(0);
            }, 1000);

        } catch (error) {
            console.error("Upload error:", error);
            const msg = error.response?.data?.message || "Upload failed. Check backend connection.";
            toast.error(msg);
            setUploading(false);
            setProgress(0);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <motion.div
                layout
                className={cn(
                    "relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all duration-300",
                    isDragActive ? "bg-white/10 ring-2 ring-blue-500/50" : "hover:bg-white/10"
                )}
            >
                {!file ? (
                    <div {...getRootProps()} className="flex flex-col items-center justify-center h-64 cursor-pointer">
                        <input {...getInputProps()} />
                        <div className="p-4 rounded-full bg-blue-500/10 mb-4 animate-pulse">
                            <UploadCloud className="w-10 h-10 text-blue-400" />
                        </div>
                        <p className="text-lg font-medium text-white mb-2">
                            {isDragActive ? "Drop it like it's hot!" : "Drag & drop your image here"}
                        </p>
                        <p className="text-sm text-slate-400">or click to browse</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        className="w-full h-full object-cover opacity-80"
                                        alt="preview"
                                    />
                                </div>
                                <div>
                                    <p className="font-medium text-white truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            {!uploading && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                    className="p-2 hover:bg-slate-700/50 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            )}
                        </div>

                        {/* Tags Input */}
                        <div>
                            <label className="text-sm text-slate-400 mb-2 block">Add Tags (Press Enter)</label>
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                disabled={uploading}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                                placeholder="nature, travel, 2023..."
                            />
                            <div className="flex flex-wrap gap-2 mt-3">
                                <AnimatePresence>
                                    {tags.map(tag => (
                                        <motion.span
                                            key={tag}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm border border-blue-500/20 flex items-center gap-2"
                                        >
                                            {tag}
                                            {!uploading && (
                                                <button onClick={() => removeTag(tag)}><X className="w-3 h-3 hover:text-white" /></button>
                                            )}
                                        </motion.span>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Progress Bar or Upload Button */}
                        {uploading ? (
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-slate-400">
                                    <span>Uploading...</span>
                                    <span>{progress}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-blue-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={handleUpload}
                                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] active:scale-[0.98]"
                            >
                                Upload Image
                            </button>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
