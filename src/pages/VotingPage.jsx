import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { useVoting } from '../context/VotingContext';
import { getCandidatesByZone, castVote } from '../services/api';
import { generateDeviceId } from '../utils/deviceId';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VotingPage = () => {
    const { selectedZone, candidates, setCandidates, votingResults, setVotingResults } = useVoting();
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [isVoted, setIsVoted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!selectedZone) {
            navigate('/');
            return;
        }

        const fetchCandidates = async () => {
            try {
                const data = await getCandidatesByZone(selectedZone._id);
                setCandidates(data.candidates);
                setVotingResults(data);
                console.log(data);

            } catch (error) {
                console.error('Error fetching candidates:', error);
            }
        };

        fetchCandidates();
    }, [selectedZone, setCandidates, setVotingResults, navigate]);

    const handleVote = async () => {
        if (!selectedCandidate) return;

        try {
            const deviceId = generateDeviceId();
            await castVote(selectedCandidate._id, deviceId);
            setIsVoted(true);

            // Update local voting results
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
        }
    };

    // Add image error handling
    const handleImageError = (e) => {
        e.target.src = '/placeholder-candidate.png'; // Add a placeholder image
        e.target.onerror = null; // Prevent infinite loop if placeholder also fails
    };

    const chartData = {
        labels: votingResults?.candidates?.map(c => c.name) || [],
        datasets: [{
            label: 'Votes',
            data: votingResults?.candidates?.map(c => c.votes) || [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: `Voting Results - ${selectedZone?.name}` }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
                {!isVoted ? (
                    <>
                        <h1 className="text-2xl font-bold text-center mb-6 text-primary">
                            Select Candidate in {selectedZone?.name}
                        </h1>
                        <div className="grid md:grid-cols-3 gap-4">
                            {candidates.map((candidate) => (
                                <div
                                    key={candidate._id}
                                    onClick={() => setSelectedCandidate(candidate)}
                                    className={`border rounded-lg p-4 cursor-pointer transition 
                                    ${selectedCandidate?._id === candidate._id
                                            ? 'border-green-500 bg-green-100'
                                            : 'border-gray-300 hover:bg-gray-100'
                                        }`}
                                >
                                    <img
                                        src={candidate.photoUrl}
                                        alt={candidate.name}
                                        className="w-full h-48 object-cover rounded-md mb-2"
                                        onError={handleImageError}
                                    />
                                    <h2 className="text-center font-semibold">{candidate.name}</h2>
                                    <p className="text-center text-gray-600">
                                        {candidate.percentage}% votes
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleVote}
                            disabled={!selectedCandidate}
                            className={`w-full mt-6 py-3 rounded ${selectedCandidate
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Cast Vote
                        </button>
                    </>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
                            Vote Casted Successfully!
                        </h2>
                        <Bar data={chartData} options={chartOptions} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default VotingPage;
