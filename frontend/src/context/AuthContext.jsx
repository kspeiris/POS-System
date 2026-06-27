/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

const readStoredUser = () => {
    try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    } catch {
        localStorage.removeItem('user');
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        return readStoredUser();
    });
    

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

    const updateProfile = async (updates) => {
        try {
            const { data } = await api.patch('/auth/me', updates);
            setUser((prev) => {
                const nextUser = prev ? { ...prev, ...data } : data;
                localStorage.setItem('user', JSON.stringify(nextUser));
                return nextUser;
            });
            return data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update profile');
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading: false, login, logout, updateProfile, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
