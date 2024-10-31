// src/components/dashboard/RecentActivities.jsx
export default function RecentActivities() {
    const activities = [
        {
            id: 1,
            type: 'city_added',
            description: 'New city "Mumbai" was added',
            timestamp: '2 hours ago',
        },
        {
            id: 2,
            type: 'candidate_added',
            description: 'New candidate "John Doe" was registered in Zone A',
            timestamp: '4 hours ago',
        },
        {
            id: 3,
            type: 'zone_updated',
            description: 'Zone "Central" was updated',
            timestamp: '1 day ago',
        }
    ];

    return (
        <div className="bg-white shadow rounded-lg">
            <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
                <div className="mt-6 flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                        {activities.map((activity) => (
                            <li key={activity.id} className="py-5">
                                <div className="relative">
                                    <p className="text-sm text-gray-800">{activity.description}</p>
                                    <div className="mt-1 flex items-center text-sm text-gray-500">
                                        <span>{activity.timestamp}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
