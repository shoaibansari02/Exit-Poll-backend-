// src/components/location/LocationSelector.js
import React from 'react';
import { Building2, MapPin } from 'lucide-react';

export const LocationSelector = ({ cities, zones, onCitySelect, onZoneSelect }) => (
    <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/2">
            <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                    onChange={(e) => onCitySelect(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 appearance-none bg-white cursor-pointer hover:border-blue-300"
                >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                        <option key={city._id} value={city._id}>
                            {city.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>

        <div className="w-full md:w-1/2">
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                    onChange={(e) => onZoneSelect(e.target.value)}
                    disabled={zones.length === 0}
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-lg transition-all duration-200 appearance-none
                        ${zones.length === 0
                            ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                            : 'border-gray-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 cursor-pointer hover:border-blue-300'
                        }`}
                >
                    <option value="">Select Zone</option>
                    {zones.map((zone) => (
                        <option key={zone._id} value={zone._id}>
                            {zone.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    </div>
);