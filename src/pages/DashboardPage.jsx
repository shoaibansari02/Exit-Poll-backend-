// src/pages/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    MapPin,
    Users,
    ArrowUp,
    ArrowDown,
    Plus
} from 'lucide-react';
import api from '../utils/axios';
import { handleApiError } from '../utils/helpers';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';
import StatCard from '../components/dashboard/StatCard';
import RecentActivities from '../components/dashboard/RecentActivities';
import QuickActions from '../components/dashboard/QuickActions';

export default function DashboardPage() {
    const [cityId, setCityId] = useState(null); // Initialize cityId
    const [zoneId, setZoneId] = useState(null); // Initialize zoneId

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


    if (stats.loading) {
        return <Spinner size="lg" />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <div className="flex space-x-3">
                    <Button
                        onClick={() => navigate('/cities')}
                        variant="secondary"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add City
                    </Button>
                    <Button
                        onClick={() => navigate('/candidates')}
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

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <RecentActivities />
                <QuickActions />
            </div>
        </div>
    );
}
