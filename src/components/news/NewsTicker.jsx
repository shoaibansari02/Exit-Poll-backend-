import React, { useState, useEffect } from 'react';
import { getAllNews } from '../../services/api';
import { format } from 'date-fns';


const NewsTicker = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await getAllNews();
                setNews(response);
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    if (loading) {
        return (
            <div className="h-24 lg:h-full flex items-center justify-center bg-white rounded-xl shadow-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg">
            {/* Header */}
            <div
                className="flex items-center justify-between p-4 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600"
            >
                <h2 className="text-xl font-bold text-white">Latest News</h2>
            </div>

            {/* News container */}
            <div className={`relative overflow-hidden transition-all duration-300 ease-in-out
                max-h-[70vh]'} 
                lg:max-h-[calc(100vh-8rem)]
            `}>
                <div className="flex flex-col group animate-scroll hover:pause-animation">
                    {/* First set of news */}
                    {news.map((item, index) => (
                        <div
                            key={`original-${item._id}-${index}`}
                            className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200"
                        >
                            <h3 className="font-semibold text-gray-800 text-lg">{item.title}</h3>
                            <div className="bg-blue-50 rounded-lg p-2 mt-2">
                                <p className="text-sm text-gray-600 font-medium">{item.headline}</p>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    {format(new Date(item.createdAt), 'MMM d, yyyy')}
                                </span>
                            </div>
                        </div>
                    ))}
                    {/* Duplicate set for seamless loop */}
                    {news.map((item, index) => (
                        <div
                            key={`duplicate-${item._id}-${index}`}
                            className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200"
                        >
                            <h3 className="font-semibold text-gray-800 text-lg">{item.title}</h3>
                            <div className="bg-blue-50 rounded-lg p-2 mt-2">
                                <p className="text-sm text-gray-600 font-medium">{item.headline}</p>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    {format(new Date(item.createdAt), 'MMM d, yyyy')}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsTicker;