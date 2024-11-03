import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    MapPin,
    Users,
    Plus,
    TrendingUp,
    TrendingDown,
    Image,
    Newspaper,
    Loader2,
    X,
    Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import api from '../utils/axios';
import { handleApiError } from '../utils/helpers';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="w-5 h-5" />
                </button>
                {children}
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, trend, onClick }) => (
    <div
        onClick={onClick}
        className="bg-white rounded-lg shadow-md p-5 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
        <div className="flex justify-between items-center">
            <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <div className="flex items-center mt-2 text-sm">
                    {trend.direction === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}>
                        {trend.value}% {trend.direction} {trend.label}
                    </span>
                </div>
            </div>
            <div className="bg-blue-50 rounded-full p-3">
                <Icon className="w-6 h-6 text-blue-600" />
            </div>
        </div>
    </div>
);

const QuickActionButton = ({ icon: Icon, title, onClick }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
        <div className="bg-blue-50 rounded-full p-3 mb-2">
            <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <span className="text-sm text-gray-700 font-medium">{title}</span>
    </button>
);

export default function EnhancedDashboard() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dashboard states
    const [stats, setStats] = useState({
        cities: 0,
        zones: 0,
        candidates: 0,
        media: { count: 0, photo: false, video: false },
        news: 0,
        loading: true,
        error: null
    });

    // News states
    const [news, setNews] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        headline: '',
        description: ''
    });

    useEffect(() => {
        fetchDashboardData();
        fetchNews();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [citiesRes, mediaRes, newsRes] = await Promise.all([
                api.get('/admin/cities'),
                api.get('/admin/get-media'),
                api.get('/admin/get-news')
            ]);

            const mediaCount = (mediaRes.data.photo ? 1 : 0) + (mediaRes.data.video ? 1 : 0);

            setStats({
                cities: citiesRes.data.length,
                zones: 0,
                candidates: 0,
                media: {
                    count: mediaCount,
                    photo: mediaRes.data.photo,
                    video: mediaRes.data.video
                },
                news: newsRes.data.length,
                loading: false,
                error: null
            });
        } catch (err) {
            setStats(prev => ({
                ...prev,
                loading: false,
                error: handleApiError(err)
            }));
        }
    };

    const fetchNews = async () => {
        try {
            const response = await api.get('/admin/get-news');
            setNews(response.data);
        } catch (err) {
            console.error('Failed to fetch news:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await api.post('/admin/add-news', formData);
            setNews([response.data, ...news]);
            setFormData({ title: '', headline: '', description: '' });
            setIsModalOpen(false);
            // Update stats
            setStats(prev => ({
                ...prev,
                news: prev.news + 1
            }));
        } catch (err) {
            console.error('Failed to create news:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this news?')) {
            try {
                await api.delete(`/admin/delete-news/${id}`);
                setNews(news.filter(item => item._id !== id));
                // Update stats
                setStats(prev => ({
                    ...prev,
                    news: prev.news - 1
                }));
            } catch (err) {
                console.error('Failed to delete news:', err);
            }
        }
    };

    if (stats.loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    const quickActions = [
        { title: 'Add City', icon: Building2, onClick: () => navigate('/cities') },
        { title: 'Add Zone', icon: MapPin, onClick: () => navigate('/zones') },
        { title: 'Add Candidate', icon: Users, onClick: () => navigate('/candidates') },
        { title: 'Add News', icon: Newspaper, onClick: () => setIsModalOpen(true) }
    ];

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <div className="flex space-x-3">
                    <Button variant="secondary" onClick={() => navigate('/cities')}>
                        <Plus className="h-5 w-5 mr-2" />
                        Add City
                    </Button>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="h-5 w-5 mr-2" />
                        Add News
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard
                    title="Total Cities"
                    value={stats.cities}
                    icon={Building2}
                    trend={{ value: 12, direction: 'up', label: 'from last month' }}
                    onClick={() => navigate('/cities')}
                />
                <StatCard
                    title="Total Zones"
                    value={stats.zones}
                    icon={MapPin}
                    trend={{ value: 8, direction: 'up', label: 'from last month' }}
                    onClick={() => navigate('/zones')}
                />
                <StatCard
                    title="Total Candidates"
                    value={stats.candidates}
                    icon={Users}
                    trend={{ value: 2, direction: 'down', label: 'from last month' }}
                    onClick={() => navigate('/candidates')}
                />
                <StatCard
                    title="Media Files"
                    value={stats.media.count}
                    icon={Image}
                    trend={{
                        value: stats.media.count > 0 ? 100 : 0,
                        direction: stats.media.count > 0 ? 'up' : 'down',
                        label: 'uploads'
                    }}
                    onClick={() => navigate('/media')}
                />
                <StatCard
                    title="News Articles"
                    value={stats.news}
                    icon={Newspaper}
                    trend={{ value: 15, direction: 'up', label: 'from last month' }}
                    onClick={() => navigate('/news')}
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-100 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <QuickActionButton
                            key={index}
                            title={action.title}
                            icon={action.icon}
                            onClick={action.onClick}
                        />
                    ))}
                </div>
            </div>

            {/* Recent News Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Recent News</h2>
                    <Button onClick={() => navigate('/news')}>View All News</Button>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {news.slice(0, 3).map((item) => (
                        <div key={item._id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                                    <p className="text-gray-600 text-sm">{item.headline}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="text-xs text-gray-500 flex justify-between">
                                <span>By: {item.createdBy?.name}</span>
                                <span>{format(new Date(item.createdAt), 'MMM d, yyyy')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add News Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Create New Article</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Title"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Headline"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.headline}
                                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="Description"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center justify-center"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Create News
                        </button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}