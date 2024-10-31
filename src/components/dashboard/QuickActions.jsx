// src/components/dashboard/QuickActions.jsx
import { Building2, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
    const navigate = useNavigate();

    const actions = [
        {
            title: 'Add New City',
            description: 'Create a new city in the system',
            icon: Building2,
            onClick: () => navigate('/cities'),
            color: 'bg-blue-500',
        },
        {
            title: 'Add New Zone',
            description: 'Create a new zone in a city',
            icon: MapPin,
            onClick: () => navigate('/zones'),
            color: 'bg-green-500',
        },
        {
            title: 'Register Candidate',
            description: 'Add a new candidate to a zone',
            icon: Users,
            onClick: () => navigate('/candidates'),
            color: 'bg-purple-500',
        },
    ];

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                <div className="mt-6 grid gap-4">
                    {actions.map((action) => (
                        <button
                            key={action.title}
                            onClick={action.onClick}
                            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className={`${action.color} p-3 rounded-lg`}>
                                <action.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4 text-left">
                                <p className="text-sm font-medium text-gray-900">{action.title}</p>
                                <p className="mt-1 text-sm text-gray-500">{action.description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}