import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    MapPin,
    Users,
    LogOut,
    Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();
    const { signOut } = useAuth();

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
            title: 'Settings',
            icon: Settings,
            path: '/settings'
        }
    ];

    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error('Failed to sign out:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center h-16 px-6 border-b border-gray-200">
                        <h1 className="text-xl font-semibold text-gray-800">Exit Poll Admin</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-1">
                        {menuItems.map((item) => (
                            <button
                                key={item.title}
                                onClick={() => navigate(item.path)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50"
                            >
                                <item.icon className="w-5 h-5 mr-3" />
                                {item.title}
                            </button>
                        ))}
                    </nav>

                    {/* Sign Out Button */}
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={handleSignOut}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50"
                        >
                            <LogOut className="w-5 h-5 mr-3" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-64">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-200">
                    <div className="flex items-center justify-between h-full px-6">
                        <h2 className="text-lg font-medium text-gray-800">Dashboard</h2>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;