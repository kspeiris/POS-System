
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check local storage on mount
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            return data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, isAuthenticated: !!user, updateUser: setUser }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
