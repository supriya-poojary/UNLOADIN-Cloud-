import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Text3D, MeshDistortMaterial, Sphere, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cloud, Upload, Shield, Zap, ArrowRight } from 'lucide-react';
import * as THREE from 'three';

// Animated 3D Sphere with distortion
function AnimatedSphere({ position, color }) {
    const meshRef = useRef();

    useFrame((state) => {
        meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime()) * 0.5;
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
                <MeshDistortMaterial
                    color={color}
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
}

// Floating particles
function Particles({ count = 200 }) {
    const mesh = useRef();
    const dummy = React.useMemo(() => new THREE.Object3D(), []);

    const particles = React.useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const x = (Math.random() - 0.5) * 150;
            const y = (Math.random() - 0.5) * 150;
            const z = (Math.random() - 0.5) * 150;
            temp.push({ t, factor, speed, x, y, z });
        }
        return temp;
    }, [count]);

    useFrame(() => {
        particles.forEach((particle, i) => {
            let { t, factor, speed, x, y, z } = particle;
            t = particle.t += speed / 2;
            const a = Math.cos(t) + Math.sin(t * 1) / 10;
            const b = Math.sin(t) + Math.cos(t * 2) / 10;

            dummy.position.set(
                x + Math.cos(t / 10) * 15,
                y + Math.sin(t / 10) * 15,
                z + Math.cos(t) * 15
            );
            dummy.scale.setScalar(Math.cos(t) * 0.5 + 0.5);
            dummy.rotation.set(a * 5, b * 5, 0);
            dummy.updateMatrix();

            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <dodecahedronGeometry args={[0.15, 0]} />
            <meshStandardMaterial color="#60a5fa" transparent opacity={0.6} />
        </instancedMesh>
    );
}

// 3D Scene
function Scene() {
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff7a57" />

            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <AnimatedSphere position={[-4, 0, -5]} color="#3b82f6" />
            <AnimatedSphere position={[4, 2, -8]} color="#8b5cf6" />
            <AnimatedSphere position={[0, -3, -6]} color="#ec4899" />

            <Particles count={300} />

            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </>
    );
}

export default function Home() {
    const navigate = useNavigate();

    const features = [
        {
            icon: Cloud,
            title: "Cloud Storage",
            description: "Secure and scalable cloud storage powered by AWS S3"
        },
        {
            icon: Upload,
            title: "Fast Uploads",
            description: "Lightning-fast uploads with presigned URLs"
        },
        {
            icon: Shield,
            title: "Secure",
            description: "Enterprise-grade security with IAM and encryption"
        },
        {
            icon: Zap,
            title: "Serverless",
            description: "Built on AWS Lambda for infinite scalability"
        }
    ];

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0e1a]">
            {/* 3D Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 15], fov: 60 }} dpr={[1, 2]}>
                    <fog attach="fog" args={['#0a0e1a', 10, 50]} />
                    <Scene />
                </Canvas>
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0e1a]/50 to-[#0a0e1a] z-[1] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">

                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-center max-w-5xl mx-auto mb-16"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="mb-6"
                    >
                        <h1 className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 tracking-tight leading-tight">
                            CloudBox
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="text-xl md:text-3xl text-slate-300 mb-4 font-light"
                    >
                        Your Creative Cloud Storage
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 1 }}
                        className="text-lg text-slate-400 max-w-2xl mx-auto mb-12"
                    >
                        Upload, manage, and share your digital assets with enterprise-grade security and infinite scalability.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <button
                            onClick={() => navigate('/login')}
                            className="group px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={() => navigate('/login')}
                            className="px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            Sign In
                        </button>
                    </motion.div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                            className="group relative p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                    <feature.icon className="w-6 h-6 text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-400 text-sm">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="mt-20 text-center"
                >
                    <p className="text-slate-500 text-sm">
                        Built with AWS Lambda, S3, DynamoDB • Serverless Architecture
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
