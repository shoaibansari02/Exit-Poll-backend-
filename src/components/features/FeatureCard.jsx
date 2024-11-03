// src/components/features/FeatureCard.js
import React from "react";

export const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-lg shadow-md h-full transition-all duration-300 hover:shadow-lg">
    <div className="flex flex-col items-center text-center p-6">
      <div className="p-3 bg-blue-100 rounded-full mb-4">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);
