import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    const toggleAuth = () => setIsRegister(!isRegister);

    const handleLogin = (e) => {
        e.preventDefault();
        // Simulate login success
        navigate('/dashboard');
    };


    return (
        <div className="flex items-center justify-center min-h-[600px] w-full p-4 relative z-20">

            {/* Specific CSS for the requested animation */}
            <style>{`
        .auth-container {
            position: relative;
            width: 850px;
            height: 550px;
            background: #111827;
            border-radius: 30px;
            box-shadow: 0 0 30px rgba(0,0,0,0.5);
            overflow: hidden;
            border: 2px solid rgba(255, 122, 87, 0.3);
        }

        .form-box {
            position: absolute;
            left: 0; /* Form on Left */
            width: 50%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px;
            z-index: 10;
            transition: all 0.6s ease-in-out;
        }

        .form-box.Register {
            opacity: 0;
            z-index: 5;
            pointer-events: none;
            transform: translateX(100%);
        }

        .auth-container.active .form-box.Register {
            opacity: 1;
            z-index: 10;
            pointer-events: auto;
            transform: translateX(0%);
        }

        .form-box.Login {
            z-index: 10;
        }

        .auth-container.active .form-box.Login {
            transform: translateX(100%); /* Move to Right (hidden behind overlay?) No, overlay moves Left. */
            /* Actually, if overlay moves left, Login (Left) should disappear or move. */
            opacity: 0;
            pointer-events: none;
        }

        /* Specific Animation for Inputs */
        .form-box .animation {
            transform: translateX(120%);
            opacity: 0;
            filter: blur(10px);
            transition: .7s ease;
        }

        .auth-container.active .form-box.Register .animation {
            transform: translateX(0%);
            opacity: 1;
            filter: blur(0);
            transition-delay: calc(.1s * var(--i));
        }

        .auth-container:not(.active) .form-box.Login .animation {
            transform: translateX(0%);
            opacity: 1;
            filter: blur(0);
            transition-delay: calc(.1s * var(--i));
        }
        
        /* Toggle Box (Overlay) */
        .toggle-box {
            position: absolute;
            top: 0;
            left: 50%; /* Overlay starts on Right */
            width: 50%;
            height: 100%;
            overflow: hidden;
            transition: all 0.6s ease-in-out;
            z-index: 100;
            border-radius: 150px 0 0 100px;
        }

        .auth-container.active .toggle-box {
            left: 0; /* Overlay moves to Left */
            border-radius: 0 150px 100px 0;
        }

        .toggle-box::before {
            content: '';
            position: absolute;
            height: 100%;
            width: 200%;
            background: linear-gradient(135deg, #ff7a57, #d8482d, #0f172a);
            top: 0;
            left: -100%; /* Gradient alignment */
            transition: all 0.6s ease-in-out;
        }

        .auth-container.active .toggle-box::before {
            left: 0;
        }

        .toggle-panel {
            position: absolute;
            width: 50%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #fff;
            z-index: 2;
            transition: all 0.6s ease-in-out;
            top: 0;
            transform: translateX(0);
        }

        /* Right Panel (Welcome) - Visible initially inside Right Overlay */
        .toggle-panel.toggle-right {
            right: 0;
            transform: translateX(0);
        }

        /* Left Panel (Hello Again) - Hidden initially? */
        /* Since Toggle Box is half-width, we need to position panels inside IT. */
        /* The Toggle Box translates, wrapping the panels. */
        /* Actually, simpler approach: Toggle Box is the container. */
        /* Inside Toggle Box (50% wide): */
        /*   If at Right: we show Toggle Right. */
        /*   If at Left: we show Toggle Left. */
        
        /* Let's double the width of content inside? */
        /* Standard trick: Toggle Panel Left is at Left: 0 (of 200% width container?) */
        /* Let's stick to the simplest visual: absolute panels relative to toggle-box. */
        
        .toggle-panel.toggle-left {
            transform: translateX(-200%); /* Hidden to left */
        }
        
        .auth-container.active .toggle-panel.toggle-left {
            transform: translateX(0); /* Visible when overlay is on left */
             /* Since overlay is on Left, Left panel is inside it. */
             /* Wait, toggle-box width is 50%. Panel width is 50%? No 100% of box. */
        }
        
        .toggle-panel { width: 100% !important; }

        .auth-container.active .toggle-panel.toggle-right {
            transform: translateX(200%); /* Move out to right */
        }

      `}</style>

            <div className={`auth-container ${isRegister ? 'active' : ''} glass`}>

                {/* Login Form */}
                <div className="form-box Login text-white">
                    <form onSubmit={handleLogin} className="w-full flex flex-col gap-6">
                        <h2 className="text-4xl font-bold mb-2 animation" style={{ '--i': 0 }}>Login</h2>

                        <div className="relative animation" style={{ '--i': 1 }}>
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                required
                                aria-label="Username"
                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#ff7a57] focus:border-transparent outline-none transition-all"
                                placeholder="Username"
                            />
                        </div>

                        <div className="relative animation" style={{ '--i': 2 }}>
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="password"
                                required
                                aria-label="Password"
                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#ff7a57] focus:border-transparent outline-none transition-all"
                                placeholder="Password"
                            />
                        </div>

                        <div className="text-right animation" style={{ '--i': 3 }}>
                            <a href="#" className="text-sm text-[#ff7a57] hover:text-[#ff8a6b] transition-colors">
                                Forgot Password?
                            </a>
                        </div>

                        <button
                            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-[#ff7a57] to-[#d8482d] font-bold text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-transform animation"
                            style={{ '--i': 3 }}
                        >
                            Login
                        </button>

                        <p className="text-center text-slate-400 text-sm animation" style={{ '--i': 4 }}>
                            Should not be here? <button onClick={() => navigate('/')} className="text-[#ff7a57] hover:underline">Go Home</button>
                        </p>
                    </form>
                </div>

                {/* Register Form */}
                <div className="form-box Register text-white">
                    <form onSubmit={(e) => e.preventDefault()} className="w-full flex flex-col gap-5">
                        <h2 className="text-4xl font-bold mb-2 animation" style={{ '--i': 0 }}>Sign Up</h2>

                        <div className="relative animation" style={{ '--i': 1 }}>
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="text"
                                required
                                aria-label="Username"
                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#ff7a57] focus:border-transparent outline-none transition-all"
                                placeholder="Username"
                            />
                        </div>

                        <div className="relative animation" style={{ '--i': 2 }}>
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="email"
                                required
                                aria-label="Email"
                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#ff7a57] focus:border-transparent outline-none transition-all"
                                placeholder="Email"
                            />
                        </div>

                        <div className="relative animation" style={{ '--i': 3 }}>
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="password"
                                required
                                aria-label="Password"
                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#ff7a57] focus:border-transparent outline-none transition-all"
                                placeholder="Password"
                            />
                        </div>

                        <button
                            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-[#ff7a57] to-[#d8482d] font-bold text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-transform animation"
                            style={{ '--i': 4 }}
                        >
                            Sign Up
                        </button>
                    </form>
                </div>

                {/* Toggle Panel Overlay */}
                <div className="toggle-box">
                    <div className="toggle-panel toggle-left">
                        <h1 className="text-3xl font-bold mb-4">Hello Again!</h1>
                        <p className="mb-8 text-center px-8">Welcome back to the future of cloud storage.</p>
                        <button onClick={toggleAuth} className="border-2 border-white px-8 py-2 rounded-xl font-bold hover:bg-white hover:text-[#d8482d] transition-colors">
                            Login
                        </button>
                    </div>

                    <div className="toggle-panel toggle-right">
                        <h1 className="text-3xl font-bold mb-4">Welcome!</h1>
                        <p className="mb-8 text-center px-8">Join us and experience infinite possibilities.</p>
                        <button onClick={toggleAuth} className="border-2 border-white px-8 py-2 rounded-xl font-bold hover:bg-white hover:text-[#d8482d] transition-colors">
                            Sign Up
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
