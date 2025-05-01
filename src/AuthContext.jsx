import React, { createContext, useState, useEffect } from 'react';

// Create a context with a default value
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if user is already logged in by checking localStorage
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    // A function to log in the user
    const login = () => {
        setIsLoggedIn(true);
    };

    // A function to log out the user
    const logout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('jwtToken');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
