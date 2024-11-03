import React, { createContext, useState, useContext } from 'react';

const VotingContext = createContext(null);

export const VotingProvider = ({ children }) => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [votingResults, setVotingResults] = useState(null);

    const resetSelection = () => {
        setSelectedCity(null);
        setSelectedZone(null);
        setCandidates([]);
        setVotingResults(null);
    };

    return (
        <VotingContext.Provider value={{
            selectedCity,
            setSelectedCity,
            selectedZone,
            setSelectedZone,
            candidates,
            setCandidates,
            votingResults,
            setVotingResults,
            resetSelection
        }}>
            {children}
        </VotingContext.Provider>
    );
};

export const useVoting = () => {
    const context = useContext(VotingContext);
    if (!context) {
        throw new Error('useVoting must be used within a VotingProvider');
    }
    return context;
};