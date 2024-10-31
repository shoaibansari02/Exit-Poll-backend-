import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    MapPin,
    Users,
    Plus,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import api from '../utils/axios';
import { handleApiError } from '../utils/helpers';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';

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
                    <span className={`
                        ${trend.direction === 'up' ? 'text-green-600' : 'text-red-600'}
                    `}>
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

export default function DashboardPage() {
    const [cityId, setCityId] = useState(null);
    const [zoneId, setZoneId] = useState(null);

    const [stats, setStats] = useState({
        cities: 0,
        zones: 0,
        candidates: 0,
        loading: true,
        error: null
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const requests = [api.get('/admin/cities')];

            if (cityId) {
                requests.push(api.get(`/admin/getZonesByCity/${cityId}`));
            }

            if (zoneId) {
                requests.push(api.get(`/admin/get-candidates/${zoneId}`));
            }

            const [citiesRes, zonesRes, candidatesRes] = await Promise.all(requests);

            setStats({
                cities: citiesRes.data.length,
                zones: zonesRes ? zonesRes.data.length : 0,
                candidates: candidatesRes ? candidatesRes.data.length : 0,
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

    const quickActions = [
        {
            title: 'Add City',
            icon: Building2,
            onClick: () => navigate('/cities')
        },
        {
            title: 'Add Zone',
            icon: MapPin,
            onClick: () => navigate('/zones')
        },
        {
            title: 'Add Candidate',
            icon: Users,
            onClick: () => navigate('/candidates')
        }
    ];

    if (stats.loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <div className="flex space-x-3">
                    <Button
                        onClick={() => navigate('/cities')}
                        variant="secondary"
                        className="w-full sm:w-auto"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add City
                    </Button>
                    <Button
                        onClick={() => navigate('/candidates')}
                        className="w-full sm:w-auto"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Candidate
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title="Total Cities"
                    value={stats.cities}
                    icon={Building2}
                    trend={{
                        value: 12,
                        direction: 'up',
                        label: 'from last month'
                    }}
                    onClick={() => navigate('/cities')}
                />
                <StatCard
                    title="Total Zones"
                    value={stats.zones}
                    icon={MapPin}
                    trend={{
                        value: 8,
                        direction: 'up',
                        label: 'from last month'
                    }}
                    onClick={() => navigate('/zones')}
                />
                <StatCard
                    title="Total Candidates"
                    value={stats.candidates}
                    icon={Users}
                    trend={{
                        value: 2,
                        direction: 'down',
                        label: 'from last month'
                    }}
                    onClick={() => navigate('/candidates')}
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-100 rounded-lg p-5">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        </div>
    );
}