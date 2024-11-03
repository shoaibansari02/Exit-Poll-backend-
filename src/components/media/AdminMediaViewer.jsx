import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getAdminMedia } from '../../services/api';

const AdminMediaViewer = () => {
    const [mediaData, setMediaData] = useState({ photo: '', video: '' });
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchAdminMedia = async () => {
            try {
                setLoading(true);
                const data = await getAdminMedia();
                setMediaData({
                    photo: data.photo,
                    video: data.video
                });
                setError(null);
            } catch (error) {
                console.error('Error fetching media:', error);
                setError('Failed to load media content');
            } finally {
                setLoading(false);
            }
        };

        fetchAdminMedia();

        // Bounce animation interval
        const bounceInterval = setInterval(() => {
            setIsVisible(prev => !prev);
        }, 3000); // Toggle every 3 seconds

        return () => clearInterval(bounceInterval);
    }, []);

    const handlePhotoClick = () => {
        if (mediaData.video) {
            setIsVideoModalOpen(true);
        }
    };

    if (loading) {
        return (
            <div className="fixed bottom-8 right-8 z-50">
                <div className="w-16 h-16 rounded-full border-2 border-blue-500 flex items-center justify-center bg-white">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error || !mediaData.photo) {
        return null;
    }

    return (
        <>
            <div className="fixed bottom-8 right-8 z-50">
                {/* Pulsing circle behind the photo */}
                <div className="absolute inset-0 animate-pulse-ring rounded-full"></div>

                {/* Animated Photo Container */}
                <div
                    className={`
            relative
            w-20 h-20
            rounded-full
            overflow-hidden
            cursor-pointer
            shadow-lg
            transform
            transition-all
            duration-500
            hover:scale-110
            ${isVisible ? 'translate-y-0' : 'translate-y-2'}
            hover:shadow-2xl
            before:content-['']
            before:absolute
            before:inset-0
            before:bg-blue-500
            before:opacity-0
            before:transition-opacity
            before:duration-300
            hover:before:opacity-20
          `}
                    onClick={handlePhotoClick}
                >
                    {/* Promotional Label */}
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs whitespace-nowrap animate-bounce">
                        Watch Now!
                    </div>

                    {/* Photo */}
                    <img
                        src={mediaData.photo}
                        alt="Promotional Content"
                        className="w-full h-full object-cover"
                    />

                    {/* Glowing Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 animate-shine" />
                </div>
            </div>

            {/* Video Modal */}
            {isVideoModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                    style={{ backdropFilter: 'blur(5px)' }}
                >
                    <div className="relative w-full max-w-4xl mx-4 transform transition-transform duration-500 scale-100">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsVideoModalOpen(false)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 focus:outline-none transition-transform duration-300 hover:scale-110"
                            aria-label="Close video"
                        >
                            <X size={24} />
                        </button>

                        {/* Video Player */}
                        <video
                            className="w-full rounded-lg shadow-lg"
                            controls
                            autoPlay
                            src={mediaData.video}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            )}

            {/* Add global styles for custom animations */}
            <style jsx global>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            transform: scale(0.8);
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        @keyframes shine {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-shine {
          animation: shine 2s infinite;
        }
      `}</style>
        </>
    );
};

export default AdminMediaViewer;