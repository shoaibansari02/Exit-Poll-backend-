import { ArrowDown, ArrowUp } from "lucide-react";

// src/components/dashboard/StatCard.jsx
export default function StatCard({ title, value, icon: Icon, trend, onClick }) {
    const TrendIcon = trend?.direction === 'up' ? ArrowUp : ArrowDown;
    const trendColor = trend?.direction === 'up' ? 'text-green-500' : 'text-red-500';

    return (
        <div
            onClick={onClick}
            className={`
          bg-white rounded-lg shadow p-6 
          ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}
        `}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="rounded-lg bg-blue-50 p-3">
                        <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="ml-3 text-lg font-medium text-gray-900">{title}</h3>
                </div>
            </div>

            <div className="mt-6">
                <p className="text-3xl font-semibold text-gray-900">{value}</p>
                {trend && (
                    <div className="flex items-center mt-2">
                        <TrendIcon className={`h-4 w-4 ${trendColor}`} />
                        <span className={`ml-2 text-sm ${trendColor}`}>
                            {trend.value}%
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                            {trend.label}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
