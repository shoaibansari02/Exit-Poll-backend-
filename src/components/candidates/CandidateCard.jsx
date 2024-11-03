import React from 'react';

export const CandidateCard = ({ candidate, onVote, isVoted }) => {
    return (
        <div className="border-2 rounded-xl p-4 transition-all duration-300 hover:shadow-md border-gray-200">
            <div className="flex flex-col h-full">
                <div className="relative mb-4">
                    <img
                        src={candidate.photo || '/placeholder-candidate.png'}
                        alt={candidate.name}
                        className="w-full h-48 object-cover rounded-lg shadow-sm"
                        onError={(e) => {
                            e.target.src = '/placeholder-candidate.png';
                            e.target.onerror = null;
                        }}
                    />
                    {candidate.partyLogo && (
                        <div className="absolute bottom-2 right-2 bg-white rounded-full p-1">
                            <img
                                src={candidate.partyLogo}
                                alt={`${candidate.partyName || 'Party'} logo`}
                                className="w-10 h-10 object-contain rounded-full"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                </div>
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {candidate.name}
                    </h3>
                    {(candidate.partyName || candidate.partyLogo) && (
                        <div className="flex items-center gap-2 mb-2">
                            {candidate.partyLogo && (
                                <img
                                    src={candidate.partyLogo}
                                    alt={`${candidate.partyName || 'Party'} logo`}
                                    className="w-5 h-5 object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                            {candidate.partyName && (
                                <p className="text-blue-600 font-medium">
                                    {candidate.partyName}
                                </p>
                            )}
                        </div>
                    )}
                    <button
                        onClick={() => onVote(candidate)}
                        disabled={isVoted}
                        className={`w-full mt-4 py-3 px-4 rounded-lg font-medium transition-all duration-300
                            ${isVoted
                                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                    >
                        {isVoted ? 'Vote Recorded' : 'Vote Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CandidateCard;