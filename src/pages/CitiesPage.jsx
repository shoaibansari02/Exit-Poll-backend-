import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Trash2,
    Loader2,
    ArrowLeft,
    ArrowRight,
    Filter
} from 'lucide-react';
import api from '../utils/axios';
import { handleApiError } from '../utils/helpers';
import AddCityModal from '../components/cities/AddCityModal';
import DeleteCityModal from '../components/cities/DeleteCityModal';

export default function CitiesPage() {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const citiesPerPage = 10;

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/cities');
            setCities(response.data);
            setError('');
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleAddCity = (newCity) => {
        setCities((prev) => [...prev, newCity]);
        setIsAddModalOpen(false);
    };

    const handleDeleteCity = async (cityId) => {
        try {
            await api.delete(`/admin/delete-city/${cityId}`);
            setCities((prev) => prev.filter(city => city._id !== cityId));
            setIsDeleteModalOpen(false);
            setSelectedCity(null);
        } catch (err) {
            setError(handleApiError(err));
        }
    };

    // Filtered and Paginated Cities
    const filteredCities = cities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastCity = currentPage * citiesPerPage;
    const indexOfFirstCity = indexOfLastCity - citiesPerPage;
    const currentCities = filteredCities.slice(indexOfFirstCity, indexOfLastCity);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                        Cities Management
                    </h1>
                    <p className="text-gray-600">
                        Manage and organize your city database with ease
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {/* Actions Bar */}
                <div className="bg-white shadow-sm rounded-lg p-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Search */}
                        <div className="relative w-full md:max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="text-gray-400 h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search cities..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1); // Reset to first page on search
                                }}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            />
                        </div>

                        {/* Add City Button */}
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Add City
                        </button>
                    </div>
                </div>

                {/* Cities List */}
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center p-12">
                            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                        </div>
                    ) : (
                        <>
                            {/* Mobile View */}
                            <div className="block md:hidden">
                                {currentCities.map((city) => (
                                    <div
                                        key={city._id}
                                        className="px-4 py-4 border-b last:border-b-0 hover:bg-gray-50 flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{city.name}</p>
                                            <p className="text-xs text-gray-500">
                                                Created: {new Date(city.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                setSelectedCity(city);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop View */}
                            <div className="hidden md:block">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                City Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created At
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {currentCities.map((city) => (
                                            <tr key={city._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {city.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {new Date(city.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCity(city);
                                                            setIsDeleteModalOpen(true);
                                                        }}
                                                        className="text-red-600 hover:text-red-900 inline-flex items-center"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-1" />
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* No Results State */}
                            {currentCities.length === 0 && (
                                <div className="text-center py-8 bg-gray-50">
                                    <p className="text-gray-500">No cities found</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {filteredCities.length > citiesPerPage && (
                                <div className="flex justify-center items-center space-x-2 p-4 bg-gray-50">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </button>
                                    {Array.from({
                                        length: Math.ceil(filteredCities.length / citiesPerPage)
                                    }).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => paginate(index + 1)}
                                            className={`px-3 py-1 rounded-md ${currentPage === index + 1
                                                    ? 'bg-blue-500 text-white'
                                                    : 'hover:bg-gray-200'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === Math.ceil(filteredCities.length / citiesPerPage)}
                                        className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ArrowRight className="h-5 w-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Add City Modal */}
            <AddCityModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleAddCity}
            />

            {/* Delete City Modal */}
            <DeleteCityModal
                open={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedCity(null);
                }}
                onConfirm={() => handleDeleteCity(selectedCity?._id)}
                cityName={selectedCity?.name}
            />
        </div>
    );
}