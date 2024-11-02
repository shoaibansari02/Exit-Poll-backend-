//src/componenets/layout/DashboardLayout.jsx

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    MapPin,
    Users,
    LogOut,
    Settings,
    Menu,
    X,
    Image
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
    const { logout, admin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        {
            title: 'Dashboard',
            icon: LayoutDashboard,
            path: '/dashboard'
        },
        {
            title: 'Cities',
            icon: Building2,
            path: '/cities'
        },
        {
            title: 'Zones',
            icon: MapPin,
            path: '/zones'
        },
        {
            title: 'Candidates',
            icon: Users,
            path: '/candidates'
        },
        {
            title: 'Media',
            icon: Image,
            path: '/media'
        }
    ];

    const handleSignOut = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to sign out:', error);
        }
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile Menu Button */}
            <button
                className="fixed top-4 left-4 z-50 md:hidden"
                onClick={toggleMobileMenu}
            >
                {isMobileMenuOpen ? (
                    <X className="w-6 h-6 text-gray-800" />
                ) : (
                    <Menu className="w-6 h-6 text-gray-800" />
                )}
            </button>

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300
                md:translate-x-0 z-40
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-blue-600 text-white">
                        <h1 className="text-xl font-bold">Exit Poll Admin</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.title}
                                to={item.path}
                                className={`
                                    flex items-center w-full px-4 py-2 text-sm rounded-lg transition-all duration-200
                                    ${location.pathname === item.path
                                        ? 'bg-blue-100 text-blue-700 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                                `}
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.title}
                            </Link>
                        ))}
                    </nav>

                    {/* Sign Out Button */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 md:ml-64">
                {/* Header */}
                <header className="h-16 bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between h-full px-6">
                        <h2 className="text-lg font-medium text-gray-800">
                            {admin ? `Welcome, ${admin.username}` : 'Dashboard'}
                        </h2>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 sm:p-6" onClick={() => setIsMobileMenuOpen(false)}>
                    {children}
                </main>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={toggleMobileMenu}
                />
            )}
        </div>
    );
};

export default DashboardLayout;