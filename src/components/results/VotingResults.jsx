import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowLeft, Trophy, Users, ChevronUp } from 'lucide-react';

export const VotingResults = ({ votingData, zoneName, onBack }) => {
    const data = votingData.candidates.map(c => ({
        name: c.name,
        votes: c.votes,
        partyName: c.partyName
    }));

    const COLORS = ['#6366F1', '#F43F5E', '#10B981', '#F59E0B', '#8B5CF6'];
    const totalVotes = data.reduce((sum, item) => sum + item.votes, 0);

    // Sort data by votes in descending order
    const sortedData = [...data].sort((a, b) => b.votes - a.votes);
    const winner = sortedData[0];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                    <p className="font-semibold text-gray-900">{data.name}</p>
                    <p className="text-indigo-600 text-sm">{data.partyName}</p>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-gray-600">
                            <span className="font-medium text-gray-900">{data.votes.toLocaleString()}</span> votes
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium text-gray-900">
                                {((data.votes / totalVotes) * 100).toFixed(1)}%
                            </span> of total
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6 p-4 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <button
                    onClick={onBack}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-medium">Back to Candidates</span>
                </button>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-full inline-flex items-center gap-2">
                    <ChevronUp className="w-4 h-4" />
                    <span className="font-medium">Vote Recorded Successfully</span>
                </div>
            </div>

            {/* Winner Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                    <div className="rounded-full bg-indigo-100 p-3">
                        <Trophy className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900">{winner.name}</h3>
                        <p className="text-indigo-600 font-medium">{winner.partyName}</p>
                        <p className="text-gray-600 mt-1">
                            Leading with {winner.votes.toLocaleString()} votes
                            ({((winner.votes / totalVotes) * 100).toFixed(1)}%)
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Total Votes Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-blue-100 p-3">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Votes Cast</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {totalVotes.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Zone Card */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="rounded-full bg-purple-100 p-3">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">Voting Zone</p>
                            <p className="text-2xl font-semibold text-gray-900">{zoneName}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Vote Distribution</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={sortedData} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
                                <XAxis
                                    dataKey="name"
                                    tick={{ fontSize: 12 }}
                                    interval={0}
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="votes"
                                    fill="#6366F1"
                                    name="Votes"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Vote Share</h3>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sortedData}
                                    dataKey="votes"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    label={({ name, percent }) =>
                                        `${name} (${(percent * 100).toFixed(1)}%)`
                                    }
                                    labelLine={true}
                                >
                                    {sortedData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VotingResults;