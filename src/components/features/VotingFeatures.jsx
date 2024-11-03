// src/components/features/VotingFeatures.js
import React from 'react';
import { MousePointerClick, Shield, BarChart3, UserCheck, MapPin, Clock } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

export const VotingFeatures = () => {
    const features = [
        {
            icon: MousePointerClick,
            title: "Easy Selection",
            description: "Simple two-step process to select your city and zone. User-friendly interface ensures quick navigation."
        },
        {
            icon: Shield,
            title: "Secure Voting",
            description: "Advanced security measures protect your vote. One-time voting system with device verification ensures fair elections."
        },
        {
            icon: BarChart3,
            title: "Real-time Results",
            description: "Watch live vote counting and view instant statistics with interactive charts after casting your vote."
        },
        {
            icon: UserCheck,
            title: "Candidate Verification",
            description: "View detailed profiles and photos of verified candidates in your zone before making your decision."
        },
        {
            icon: MapPin,
            title: "Location-Based System",
            description: "Automatically shows candidates specific to your selected zone, ensuring relevant voting options."
        },
        {
            icon: Clock,
            title: "24/7 Accessibility",
            description: "Vote at your convenience. The system is available round the clock for your voting needs."
        }
    ];

    return (
        <div className="py-12 bg-gradient-to-b from-blue-50 to-white">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-blue-600 mb-4">
                        How Our Voting System Works
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Experience a modern and efficient voting process with our feature-rich platform.
                        Follow these simple steps to make your voice heard.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </div>
    );
};