import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('cloudbox_current_user');
        if (storedUser) {
            setCurrentUser(storedUser);
        }
        setLoading(false);
    }, []);

    const login = (username) => {
        setCurrentUser(username);
        localStorage.setItem('cloudbox_current_user', username);
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('cloudbox_current_user');
    };

    const value = {
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser
    };

    if (loading) {
        return null; // Or a loading spinner
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
