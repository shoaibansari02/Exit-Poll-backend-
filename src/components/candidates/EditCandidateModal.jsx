import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { handleApiError } from '../../utils/helpers';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import ImageUpload from './ImageUpload';

export default function EditCandidateModal({ open, onClose, onSuccess, candidate }) {
    const [formData, setFormData] = useState({
        name: '',
        partyName: '',
    });
    const [photo, setPhoto] = useState(null);
    const [partyLogo, setPartyLogo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [previewUrls, setPreviewUrls] = useState({
        photo: '',
        partyLogo: ''
    });

    useEffect(() => {
        if (candidate) {
            setFormData({
                name: candidate.name || '',
                partyName: candidate.partyName || '',
            });
            setPreviewUrls({
                photo: candidate.photo || '',
                partyLogo: candidate.partyLogo || ''
            });
        }
    }, [candidate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePhotoChange = (file) => {
        setPhoto(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrls(prev => ({
                ...prev,
                photo: url
            }));
        }
    };

    const handlePartyLogoChange = (file) => {
        setPartyLogo(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrls(prev => ({
                ...prev,
                partyLogo: url
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const submitFormData = new FormData();
        submitFormData.append('name', formData.name);
        submitFormData.append('partyName', formData.partyName);

        if (photo) {
            submitFormData.append('photo', photo);
        }
        if (partyLogo) {
            submitFormData.append('partyLogo', partyLogo);
        }

        try {
            const response = await api.put(
                `/admin/update-candidate/${candidate._id}`,
                submitFormData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            onSuccess(response.data);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: candidate?.name || '',
            partyName: candidate?.partyName || ''
        });
        setPhoto(null);
        setPartyLogo(null);
        setPreviewUrls({
            photo: candidate?.photo || '',
            partyLogo: candidate?.partyLogo || ''
        });
        setError('');
    };

    return (
        <Modal
            open={open}
            onClose={() => {
                resetForm();
                onClose();
            }}
            title="Edit Candidate"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <Alert message={error} />}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Candidate Name
                    </label>
                    <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter candidate name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Party Name
                    </label>
                    <Input
                        type="text"
                        name="partyName"
                        value={formData.partyName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter party name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Candidate Photo
                    </label>
                    <ImageUpload
                        onImageSelect={handlePhotoChange}
                        preview={previewUrls.photo}
                        className="h-32 w-32"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Upload a new photo or leave empty to keep the current one
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Party Logo
                    </label>
                    <ImageUpload
                        onImageSelect={handlePartyLogoChange}
                        preview={previewUrls.partyLogo}
                        className="h-32 w-32"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Upload a new party logo or leave empty to keep the current one
                    </p>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            resetForm();
                            onClose();
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}