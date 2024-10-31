// src/components/candidates/ImageUpload.jsx
import { useRef } from 'react';
import { Camera } from 'lucide-react';

export default function ImageUpload({ onImageSelect, preview, existingImage = false }) {
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            onImageSelect(file);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {existingImage ? 'Change Photo' : 'Upload Photo'}
            </label>

            <div
                className="relative flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-4 h-48 cursor-pointer hover:border-gray-400"
                onClick={() => fileInputRef.current?.click()}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        className="max-h-full rounded-lg object-contain"
                    />
                ) : (
                    <div className="text-center">
                        <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                            Click to upload a photo
                        </span>
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
            />
        </div>
    );
}