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

const VotingHomePage = () => {
    const [cities, setCities] = useState([]);
    const [zones, setZones] = useState([]);
    const { setSelectedCity, setSelectedZone } = useVoting();
    const [selectedZoneId, setSelectedZoneId] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [isVoted, setIsVoted] = useState(false);
    const [votingResults, setVotingResults] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const fetchedCities = await getCities();
                setCities(fetchedCities);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };
        fetchCities();
    }, []);

    const handleCitySelect = async (cityId) => {
        if (!cityId) {
            setZones([]);
            setSelectedZoneId(null);
            return;
        }

        setLoading(true);
        const selectedCity = cities.find((city) => city._id === cityId);
        setSelectedCity(selectedCity);

        try {
            const fetchedZones = await getZonesByCity(cityId);
            setZones(Array.isArray(fetchedZones) ? fetchedZones : fetchedZones.zones || []);
        } catch (error) {
            console.error('Error fetching zones:', error);
            setZones([]);
        } finally {
            setLoading(false);
        }
    };

    const handleZoneSelect = async (zoneId) => {
        if (!zoneId) return;

        setLoading(true);
        setSelectedZoneId(zoneId);
        const selectedZone = zones.find((zone) => zone._id === zoneId);
        setSelectedZone(selectedZone);

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
                {/* Fixed News Ticker - Desktop Only */}
                <div className="hidden lg:block fixed top-8 w-80">
                    <NewsTicker />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
                    {/* Spacer div for desktop layout */}
                    <div className="hidden lg:block lg:col-span-1" />

                    {/* Main Content */}
                    <div className="col-span-1 lg:col-span-3 px-4 lg:px-0">
                        {/* Voting Header Card */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                            <div className="text-center py-8 px-6 bg-white border-b">
                                <h1 className="text-3xl font-bold text-blue-600 mb-2">
                                    Online Voting System
                                </h1>
                                <p className="text-gray-600">
                                    Select your location and vote for your candidate
                                </p>
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

                        {/* Loading State */}
                        {loading && (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        )}

                        {/* Candidates Section */}
                        {selectedZoneId && !loading && (
                            <div className="bg-white shadow-lg rounded-xl p-6 transition-all duration-300 mb-8">
                                {!isVoted ? (
                                    <>
                                        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
                                            Select Your Candidate
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
                                        zoneName={zones.find(z => z._id === selectedZoneId)?.name}
                                        onBack={handleBack}
                                    />
                                )}
                            </div>
                        )}

                        {/* News Ticker - Mobile Only */}
                        <div className="lg:hidden mb-8">
                            <NewsTicker />
                        </div>

                        {/* Features Section */}
                        <VotingFeatures />
                    </div>
                </div>
            </div>
            <AdminMediaViewer />
        </div>
    );
};

export default VotingHomePage;