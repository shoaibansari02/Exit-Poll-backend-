// src/pages/CandidatesPage.jsx
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../utils/axios';
import { handleApiError } from '../utils/helpers';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Alert } from '../components/common/Alert';
import { Spinner } from '../components/common/Spinner';
import AddCandidateModal from '../components/candidates/AddCandidateModal';
import EditCandidateModal from '../components/candidates/EditCandidateModal';

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const [zones, setZones] = useState([]);
    const [selectedZone, setSelectedZone] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        if (selectedCity) {
            fetchZones(selectedCity);
        } else {
            setZones([]);
            setSelectedZone('');
        }
    }, [selectedCity]);

    useEffect(() => {
        if (selectedZone) {
            fetchCandidates(selectedZone);
        } else {
            setCandidates([]);
        }
    }, [selectedZone]);

    const fetchCities = async () => {
        try {
            const response = await api.get('/admin/cities');
            setCities(response.data);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const fetchZones = async (cityId) => {
        try {
            const response = await api.get(`/admin/getZonesByCity/${cityId}`);
            setZones(response.data.zones);
        } catch (err) {
            setError(handleApiError(err));
        }
    };

    const fetchCandidates = async (zoneId) => {
        try {
            setLoading(true);
            const response = await api.get(`/admin/get-candidates/${zoneId}`);
            setCandidates(response.data.candidates);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (candidateId) => {
        if (!window.confirm('Are you sure you want to delete this candidate?')) return;

        try {
            await api.delete(`/admin/delete-candidate/${candidateId}`);
            setCandidates(candidates.filter(candidate => candidate._id !== candidateId));
        } catch (err) {
            setError(handleApiError(err));
        }
    };

    const columns = [
        {
            header: 'Photo',
            cell: (row) => (
                <img
                    src={row.photoUrl}
                    alt={row.name}
                    className="h-12 w-12 rounded-full object-cover"
                />
            ),
        },
        {
            header: 'Name',
            accessor: 'name',
        },
        {
            header: 'Actions',
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedCandidate(row)}
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    disabled={!selectedZone}
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Candidate
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select City
                    </label>
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        <option value="">Select a city</option>
                        {cities.map((city) => (
                            <option key={city._id} value={city._id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Zone
                    </label>
                    <select
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={selectedZone}
                        onChange={(e) => setSelectedZone(e.target.value)}
                        disabled={!selectedCity}
                    >
                        <option value="">Select a zone</option>
                        {zones.map((zone) => (
                            <option key={zone._id} value={zone._id}>
                                {zone.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && <Alert message={error} />}

            {loading ? (
                <Spinner />
            ) : (
                <div className="bg-white shadow rounded-lg">
                    <Table
                        columns={columns}
                        data={candidates}
                    />
                </div>
            )}

            <AddCandidateModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={(newCandidate) => {
                    setCandidates([...candidates, newCandidate]);
                    setIsAddModalOpen(false);
                }}
                zoneId={selectedZone}
            />

            <EditCandidateModal
                open={!!selectedCandidate}
                onClose={() => setSelectedCandidate(null)}
                onSuccess={(updatedCandidate) => {
                    setCandidates(candidates.map(c =>
                        c._id === updatedCandidate._id ? updatedCandidate : c
                    ));
                    setSelectedCandidate(null);
                }}
                candidate={selectedCandidate}
            />
        </div>
    );
}
