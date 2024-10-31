// src/pages/ZonesPage.jsx
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../utils/axios';
import { handleApiError } from '../utils/helpers';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Alert } from '../components/common/Alert';
import { Spinner } from '../components/common/Spinner';
import AddZoneModal from '../components/zones/AddZoneModal';
import EditZoneModal from '../components/zones/EditZoneModal';

export default function ZonesPage() {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingZone, setEditingZone] = useState(null);

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        if (selectedCity) {
            fetchZones(selectedCity);
        }
    }, [selectedCity]);

    const fetchCities = async () => {
        try {
            const response = await api.get('/admin/cities');
            setCities(response.data);
            if (response.data.length > 0) {
                setSelectedCity(response.data[0]._id);
            }
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const fetchZones = async (cityId) => {
        setLoading(true);
        try {
            const response = await api.get(`/admin/getZonesByCity/${cityId}`);
            setZones(response.data.zones);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (zoneId) => {
        if (!window.confirm('Are you sure you want to delete this zone?')) return;

        try {
            await api.delete(`/admin/deleteZone/${zoneId}`);
            setZones(zones.filter(zone => zone._id !== zoneId));
        } catch (err) {
            setError(handleApiError(err));
        }
    };

    const columns = [
        {
            header: 'Zone Name',
            accessor: 'name',
        },
        {
            header: 'Created At',
            accessor: 'createdAt',
            cell: (row) => new Date(row.createdAt).toLocaleDateString(),
        },
        {
            header: 'Actions',
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingZone(row)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(row._id)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    if (loading && !zones.length) {
        return <Spinner />;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Zones</h1>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    disabled={!selectedCity}
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Zone
                </Button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <select
                    className="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                >
                    {cities.map((city) => (
                        <option key={city._id} value={city._id}>
                            {city.name}
                        </option>
                    ))}
                </select>
            </div>

            {error && <Alert message={error} />}

            <div className="bg-white shadow rounded-lg">
                <Table
                    columns={columns}
                    data={zones}
                />
            </div>

            <AddZoneModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                cityId={selectedCity}
                onSuccess={(newZones) => {
                    setZones([...zones, ...newZones]);
                    setIsAddModalOpen(false);
                }}
            />

            <EditZoneModal
                zone={editingZone}
                onClose={() => setEditingZone(null)}
                onSuccess={(updatedZone) => {
                    setZones(zones.map(z =>
                        z._id === updatedZone._id ? updatedZone : z
                    ));
                    setEditingZone(null);
                }}
            />
        </div>
    );
}