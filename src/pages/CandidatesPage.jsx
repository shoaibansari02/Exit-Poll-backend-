import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2 } from 'lucide-react';
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
    const [searchTerm, setSearchTerm] = useState('');

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

    // Filter candidates based on search term
    const filteredCandidates = candidates.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            header: 'Photo',
            cell: (row) => (
                <div className="flex items-center">
                    <img
                        src={row.photoUrl}
                        alt={row.name}
                        className="h-10 w-10 md:h-12 md:w-12 rounded-full object-cover border-2 border-gray-200"
                    />
                </div>
            ),
        },
        {
            header: 'Name',
            accessor: 'name',
            cell: (row) => (
                <div className="font-medium text-gray-900 text-sm md:text-base">
                    {row.name}
                </div>
            )
        },
        {
            header: 'Actions',
            cell: (row) => (
                <div className="flex space-x-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center"
                        onClick={() => setSelectedCandidate(row)}
                    >
                        <Edit2 className="h-4 w-4 mr-1" />
                        Edit
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        className="flex items-center"
                        onClick={() => handleDelete(row._id)}
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Candidates Management</h1>
                        <Button
                            onClick={() => setIsAddModalOpen(true)}
                            disabled={!selectedZone}
                            className="w-full md:w-auto flex items-center justify-center"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add Candidate
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select City
                            </label>
                            <div className="relative">
                                <select
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
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
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <Filter className="h-5 w-5" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Select Zone
                            </label>
                            <div className="relative">
                                <select
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
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
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <Filter className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {selectedZone && (
                        <div className="mt-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search candidates..."
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-4">
                        <Alert message={error} />
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner />
                    </div>
                ) : (
                    selectedZone && (
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <Table
                                columns={columns}
                                data={filteredCandidates}
                                emptyStateMessage="No candidates found in this zone."
                            />
                        </div>
                    )
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
        </div>
    );
}