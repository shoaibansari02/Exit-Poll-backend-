import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VotingProvider } from './context/VotingContext';
import HomePage from './pages/VotingHomePage';
import VotingPage from './pages/VotingPage';
import './App.css';

function App() {
  return (
    <Router>
      <VotingProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/vote" element={<VotingPage />} />
          </Routes>
        </div>
      </VotingProvider>
    </Router>
  );
}

export default App;