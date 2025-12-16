import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Auth({ onLogin }) {
    const [isRegister, setIsRegister] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [form, setForm] = useState({ username: '', password: '', name: '' });
    const [resetForm, setResetForm] = useState({ username: '', newPassword: '' });
    const [googleEmail, setGoogleEmail] = useState('');
    const [error, setError] = useState('');

    const toggleAuth = () => {
        setIsRegister(!isRegister);
        setIsForgotPassword(false);
        setError('');
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        // Requirement: Valid Google Account format
        if (!form.username.trim().endsWith('@gmail.com')) {
            setError('Enter correct username format');
            return;
        }

        const storedPassword = localStorage.getItem('demo_password');

        // If a password has been set via "Forgot Password", validate against it
        if (storedPassword && form.password !== storedPassword) {
            setError('Wrong Password');
            return;
        }

        // If no password set (initial state), we allow ANY password to simulate 
        // "logging in with their own Google account password"
        if (!storedPassword && !form.password) {
            setError('Please enter your password');
            return;
        }

        navigate('/dashboard');
    };

    const handleGoogleLogin = async (e) => {
        e.preventDefault();

        if (!googleEmail) {
            alert("Please enter your email address.");
            return;
        }

        // Simulate verification process
        const loadingToast = toast.loading("Sending verification email...");

        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.dismiss(loadingToast);
        toast.success(`Welcome to CloudBox! Verification sent to ${googleEmail}. Please check your mail.`);

        // Brief delay to read the toast then "verify" and login
        setTimeout(() => {
            navigate('/dashboard');
        }, 2500);
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (!resetForm.newPassword) return;

        localStorage.setItem('demo_password', resetForm.newPassword);

        setIsForgotPassword(false);
        setForm(prev => ({ ...prev, password: '' })); // Clear login password
        alert("Password reset successfully! You can now login with your new password.");
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
                        {!isForgotPassword ? (
                            <>
                                <h2 className="text-4xl font-bold mb-2 animation" style={{ '--i': 0 }}>Login</h2>

                                <div className="relative animation" style={{ '--i': 1 }}>
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        required
                                        aria-label="Username"
                                        value={form.username}
                                        onChange={(e) => {
                                            setForm({ ...form, username: e.target.value });
                                            if (error) setError('');
                                        }}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#ff7a57] focus:border-transparent outline-none transition-all"
                                        placeholder="Username"
                                    />
                                </div>

                                <div className="relative group animation" style={{ '--i': 2 }}>
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#ff7a57] transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        aria-label="Password"
                                        value={form.password}
                                        onChange={(e) => {
                                            setForm({ ...form, password: e.target.value });
                                            if (error) setError('');
                                        }}
                                        className={`w-full bg-[#0f172a] border rounded-xl py-3 pl-10 pr-12 focus:ring-2 focus:ring-[#ff7a57] focus:border-transparent outline-none transition-all ${error ? 'border-red-500' : 'border-white/10'
                                            }`}
                                        placeholder="Password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors z-20 cursor-pointer p-1"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {error && (
                                    <p className="text-red-500 text-xs text-right mt-[-10px] animation" style={{ '--i': 2 }}>
                                        {error}
                                    </p>
                                )}

                                <div className="text-right animation" style={{ '--i': 3 }}>
                                    <button
                                        type="button"
                                        onClick={() => setIsForgotPassword(true)}
                                        className="text-sm text-[#ff7a57] hover:text-[#ff8a6b] transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                <button
                                    className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-[#ff7a57] to-[#d8482d] font-bold text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-transform animation"
                                    style={{ '--i': 3 }}
                                >
                                    Login
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold mb-2 animation" style={{ '--i': 0 }}>Reset Password</h2>
                                <p className="text-sm text-slate-400 mb-4 animation" style={{ '--i': 0 }}>Enter your new password to regain access.</p>

                                <div className="relative animation" style={{ '--i': 1 }}>
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        required
                                        aria-label="Username/Email"
                                        value={resetForm.username}
                                        onChange={(e) => setResetForm({ ...resetForm, username: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#ff7a57] focus:border-transparent outline-none transition-all"
                                        placeholder="Username or Email"
                                    />
                                </div>

                                <div className="relative animation" style={{ '--i': 2 }}>
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="password"
                                        required
                                        aria-label="New Password"
                                        value={resetForm.newPassword}
                                        onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#ff7a57] focus:border-transparent outline-none transition-all"
                                        placeholder="New Password"
                                    />
                                </div>

                                <button
                                    onClick={handleResetPassword}
                                    className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-[#ff7a57] to-[#d8482d] font-bold text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-transform animation"
                                    style={{ '--i': 3 }}
                                >
                                    Set New Password
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsForgotPassword(false)}
                                    className="w-full mt-2 text-sm text-slate-400 hover:text-white transition-colors animation"
                                    style={{ '--i': 4 }}
                                >
                                    Back to Login
                                </button>
                            </>
                        )}

                        <p className="text-center text-slate-400 text-sm animation" style={{ '--i': 5 }}>
                            <button onClick={() => navigate('/')} className="text-[#ff7a57] hover:underline">Go Home</button>
                        </p>
                    </form>
                </div>

                {/* Register/Google Form */}
                <div className="form-box Register text-white">
                    <form onSubmit={handleGoogleLogin} className="w-full flex flex-col gap-6 items-center justify-center h-full">
                        <h2 className="text-4xl font-bold mb-4 animation" style={{ '--i': 0 }}>Get Started</h2>

                        <p className="text-slate-300 text-center mb-6 animation" style={{ '--i': 1 }}>
                            Join CloudBox instantly. Enter your Google email to verify.
                        </p>

                        <div className="w-full relative animation" style={{ '--i': 2 }}>
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input
                                type="email"
                                required
                                aria-label="Google Email"
                                value={googleEmail}
                                onChange={(e) => setGoogleEmail(e.target.value)}
                                className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#ff7a57] focus:border-transparent outline-none transition-all"
                                placeholder="Enter your Google Mail"
                            />
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full py-4 px-6 rounded-xl bg-white text-slate-900 font-bold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all animation"
                            style={{ '--i': 3 }}
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Verify & Sign In
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
                        <button onClick={toggleAuth} className="border-2 border-white px-8 py-2 rounded-xl font-bold hover:bg-white hover:text-[#d8482d] transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                            </svg>
                            Google Sign In
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
