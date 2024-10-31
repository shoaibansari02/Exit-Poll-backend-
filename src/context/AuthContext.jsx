// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = AuthService.getToken();
            if (token) {
                const userData = await AuthService.getProfile();
                setAdmin(userData);
            }
        } catch (error) {
            AuthService.logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const userData = await AuthService.login(username, password);
        setAdmin(userData);
        navigate('/dashboard');
        return userData;
    };

    const logout = () => {
        AuthService.logout();
        setAdmin(null);
        navigate('/login');
    };

    const value = {
        admin,
        loading,
        login,
        logout,
        isAuthenticated: AuthService.isAuthenticated()
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
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