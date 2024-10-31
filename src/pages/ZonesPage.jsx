import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin } from 'lucide-react';
import api from '../utils/axios';
import { handleApiError } from '../utils/helpers';
import { Button } from '../components/common/Button';
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

    if (loading && !zones.length) {
        return <Spinner />;
    }

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                <div className="flex items-center space-x-3">
                    <MapPin className="w-8 h-8 text-blue-600" />
                    <h1 className="text-3xl font-extrabold text-gray-900">Zones Management</h1>
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    disabled={!selectedCity}
                    className="w-full md:w-auto"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Zone
                </Button>
            </div>

            {/* City Selector */}
            <div className="mb-6">
                <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 mb-2">
                    Select City
                </label>
                <select
                    id="city-select"
                    className="block w-full md:max-w-xs rounded-lg border-gray-300 shadow-sm 
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-all 
                    duration-300 ease-in-out"
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

            {/* Error Handling */}
            {error && <Alert message={error} className="mb-6" />}

            {/* Zones List */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                {zones.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No zones found for the selected city.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {zones.map((zone) => (
                            <div
                                key={zone._id}
                                className="flex flex-col md:flex-row justify-between 
                                p-4 hover:bg-gray-50 transition-colors duration-200"
                            >
                                <div className="flex-grow">
                                    <div className="font-semibold text-gray-800">{zone.name}</div>
                                    <div className="text-sm text-gray-500">
                                        Created: {new Date(zone.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="flex space-x-2 mt-2 md:mt-0">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="flex items-center"
                                        onClick={() => setEditingZone(zone)}
                                    >
                                        <Edit2 className="w-4 h-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="flex items-center"
                                        onClick={() => handleDelete(zone._id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
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