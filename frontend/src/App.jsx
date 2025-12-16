import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Home from '@/routes/Home';
import Login from '@/routes/Login';
import Dashboard from '@/routes/Dashboard';
import HealthCheck from '@/components/HealthCheck';

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </AnimatePresence>
    );
}

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-8">
                    <h1 className="text-3xl font-bold text-red-500 mb-4">Something went wrong</h1>
                    <div className="bg-slate-800 p-6 rounded-lg max-w-2xl overflow-auto border border-red-500/30 w-full">
                        <h2 className="text-xl font-mono mb-2 text-red-300">{this.state.error?.toString()}</h2>
                        <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap">
                            {this.state.errorInfo?.componentStack}
                        </pre>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors"
                    >
                        Return to Home
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

import { AuthProvider } from '@/context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <ErrorBoundary>
                    <HealthCheck />
                    <AnimatedRoutes />
                    <Toaster
                        position="bottom-right"
                        toastOptions={{
                            style: {
                                background: '#1e293b',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }
                        }}
                    />
                </ErrorBoundary>
            </Router>
        </AuthProvider>
    )
}

export default App
