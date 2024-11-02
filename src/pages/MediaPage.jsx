import React, { useState, useEffect } from 'react';
import { Image, Film, Upload } from 'lucide-react';
import api from '../utils/axios';
import { handleApiError } from '../utils/helpers';
import { Button } from '../components/common/Button';
import { Spinner } from '../components/common/Spinner';

const MediaPage = () => {
    const [media, setMedia] = useState({
        photo: null,
        video: null
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/get-media');
            setMedia(response.data);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Get file inputs
        const photoInput = document.querySelector('input[name="photo"]');
        const videoInput = document.querySelector('input[name="video"]');

        if (photoInput.files[0]) {
            formData.append('photo', photoInput.files[0]);
        }
        if (videoInput.files[0]) {
            formData.append('video', videoInput.files[0]);
        }

        if (!photoInput.files[0] && !videoInput.files[0]) {
            setError('Please select at least one file to upload');
            return;
        }

        try {
            setUploading(true);
            setError(null);

            const response = await api.post('/admin/upload-media', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            setMedia(response.data);
            // Reset file inputs
            photoInput.value = '';
            videoInput.value = '';
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Media Management</h1>
            </div>

            {/* Upload Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Media</h2>
                <form onSubmit={handleUpload} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Photo Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Photo
                            </label>
                            <input
                                type="file"
                                name="photo"
                                accept="image/*"
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                            />
                        </div>

                        {/* Video Upload */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Video
                            </label>
                            <input
                                type="file"
                                name="video"
                                accept="video/*"
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700
                                    hover:file:bg-blue-100"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm">{error}</div>
                    )}

                    <Button
                        type="submit"
                        disabled={uploading}
                        className="w-full sm:w-auto"
                    >
                        {uploading ? (
                            <>
                                <Spinner size="sm" className="mr-2" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5 mr-2" />
                                Upload Media
                            </>
                        )}
                    </Button>
                </form>
            </div>

            {/* Media Preview */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Media</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Photo Preview */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-700 flex items-center">
                            <Image className="w-4 h-4 mr-2" />
                            Photo
                        </h3>
                        {media.photo ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                                <img
                                    src={media.photo}
                                    alt="Uploaded photo"
                                    className="object-contain w-full h-full"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center aspect-video rounded-lg bg-gray-100">
                                <p className="text-gray-500">No photo uploaded</p>
                            </div>
                        )}
                    </div>

                    {/* Video Preview */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-700 flex items-center">
                            <Film className="w-4 h-4 mr-2" />
                            Video
                        </h3>
                        {media.video ? (
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                                <video
                                    controls
                                    className="w-full h-full"
                                >
                                    <source src={media.video} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center aspect-video rounded-lg bg-gray-100">
                                <p className="text-gray-500">No video uploaded</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaPage;