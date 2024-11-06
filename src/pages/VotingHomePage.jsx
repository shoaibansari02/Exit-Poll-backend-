import React, { useState, useEffect } from 'react';
import { useVoting } from '../context/VotingContext';
import { getCities, getZonesByCity, getCandidatesByZone, castVote } from '../services/api';
import { generateDeviceId } from '../utils/deviceId';
import { LocationSelector } from '../components/location/LocationSelector';
import { CandidateCard } from '../components/candidates/CandidateCard';
import { VotingResults } from '../components/results/VotingResults';
import { VotingFeatures } from '../components/features/VotingFeatures';
import AdminMediaViewer from '../components/media/AdminMediaViewer';
import NewsTicker from '../components/news/NewsTicker';

import Wallpaper from '../assets/wallpaper.png'

const VotingHomePage = () => {
    const [cities, setCities] = useState([]);
    const [zones, setZones] = useState([]);
    const { setSelectedCity, setSelectedZone } = useVoting();
    const [selectedZoneId, setSelectedZoneId] = useState(null);
    const [selectedCityName, setSelectedCityName] = useState(''); // New state for city name
    const [selectedZoneName, setSelectedZoneName] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [isVoted, setIsVoted] = useState(false);
    const [votingResults, setVotingResults] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch cities and set default selections
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const fetchedCities = await getCities();
                setCities(fetchedCities);

                // Set default city (first city)
                if (fetchedCities.length > 0) {
                    const defaultCity = fetchedCities[0];
                    setSelectedCity(defaultCity);
                    setSelectedCityName(defaultCity.name);

                    // Fetch and set zones for default city
                    const fetchedZones = await getZonesByCity(defaultCity._id);
                    const zonesArray = Array.isArray(fetchedZones) ? fetchedZones : fetchedZones.zones || [];
                    setZones(zonesArray);

                    // Set default zone (first zone)
                    if (zonesArray.length > 0) {
                        const defaultZone = zonesArray[0];
                        setSelectedZone(defaultZone);
                        setSelectedZoneId(defaultZone._id);
                        setSelectedZoneName(defaultZone.name);

                        // Fetch candidates for default zone
                        const data = await getCandidatesByZone(defaultZone._id);
                        setCandidates(data.candidates);
                        setVotingResults(data);
                    }
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        };
        fetchInitialData();
    }, []);

    const handleCitySelect = async (cityId) => {
        if (!cityId) {
            setZones([]);
            setSelectedZoneId(null);
            setSelectedCityName('');
            setSelectedZoneName('');
            return;
        }

        setLoading(true);
        const selectedCity = cities.find((city) => city._id === cityId);
        setSelectedCity(selectedCity);
        setSelectedCityName(selectedCity.name);

        try {
            const fetchedZones = await getZonesByCity(cityId);
            const zonesArray = Array.isArray(fetchedZones) ? fetchedZones : fetchedZones.zones || [];
            setZones(zonesArray);

            // Automatically select first zone of newly selected city
            if (zonesArray.length > 0) {
                const firstZone = zonesArray[0];
                setSelectedZone(firstZone);
                setSelectedZoneId(firstZone._id);
                setSelectedZoneName(firstZone.name);
                const data = await getCandidatesByZone(firstZone._id);
                setCandidates(data.candidates);
                setVotingResults(data);
            }
        } catch (error) {
            console.error('Error fetching zones:', error);
            setZones([]);
        } finally {
            setLoading(false);
        }
    };

    // Rest of the code remains the same...
    const handleZoneSelect = async (zoneId) => {
        if (!zoneId) return;

        setLoading(true);
        setSelectedZoneId(zoneId);
        const selectedZone = zones.find((zone) => zone._id === zoneId);
        setSelectedZone(selectedZone);
        setSelectedZoneName(selectedZone.name);

        try {
            const data = await getCandidatesByZone(zoneId);
            setCandidates(data.candidates);
            setVotingResults(data);
        } catch (error) {
            console.error('Error fetching candidates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (selectedCandidate) => {
        if (!selectedCandidate) return;

        setLoading(true);
        try {
            const deviceId = generateDeviceId();
            await castVote(selectedCandidate._id, deviceId);
            setIsVoted(true);

            const updatedCandidates = candidates.map(candidate =>
                candidate._id === selectedCandidate._id
                    ? { ...candidate, votes: candidate.votes + 1 }
                    : candidate
            );

            setVotingResults({
                ...votingResults,
                candidates: updatedCandidates
            });
        } catch (error) {
            alert(error.response?.data?.message || 'Error casting vote');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setIsVoted(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
            <div className="max-w-7xl mx-auto relative">
                <div className="hidden lg:block fixed top-8 w-80">
                    <NewsTicker />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
                    <div className="hidden lg:block lg:col-span-1" />

                    <div className="col-span-1 lg:col-span-3 px-4 lg:px-0">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                            <div className="relative">
                                {/* Header Image */}
                                <div className="w-full h-48 md:h-64 relative overflow-hidden">
                                    <img
                                        src={Wallpaper}
                                        alt="Voting System Header"
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Overlay for better text visibility */}
                                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                                    {/* Text overlay */}
                                    {/* <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                                            Online Voting System
                                        </h1>
                                        <p className="text-lg md:text-xl text-gray-100">
                                            Select your location and vote for your candidate
                                        </p>
                                    </div> */}
                                </div>
                            </div>

                            <div className="p-6">
                                <LocationSelector
                                    cities={cities}
                                    zones={zones}
                                    onCitySelect={handleCitySelect}
                                    onZoneSelect={handleZoneSelect}
                                />
                            </div>
                        </div>

                        {loading && (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        )}

                        {selectedZoneId && !loading && (
                            <div className="bg-white shadow-lg rounded-xl p-6 transition-all duration-300 mb-8">
                                {!isVoted ? (
                                    <>
                                        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
                                            Candidates for {selectedCityName} - {selectedZoneName}
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {candidates.map((candidate) => (
                                                <CandidateCard
                                                    key={candidate._id}
                                                    candidate={candidate}
                                                    onVote={handleVote}
                                                    isVoted={isVoted}
                                                />
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <VotingResults
                                        votingData={votingResults}
                                        zoneName={selectedZoneName}
                                        onBack={handleBack}
                                    />
                                )}
                            </div>
                        )}

                        <div className="lg:hidden mb-8">
                            <NewsTicker />
                        </div>

                        <VotingFeatures />
                    </div>
                </div>
            </div>
            <AdminMediaViewer />
        </div>
    );
};

export default VotingHomePage;