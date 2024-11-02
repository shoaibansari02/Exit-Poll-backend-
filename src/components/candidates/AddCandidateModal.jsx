import { useState } from 'react';
import api from '../../utils/axios';
import { handleApiError } from '../../utils/helpers';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import ImageUpload from './ImageUpload';

export default function AddCandidateModal({ open, onClose, onSuccess, zoneId }) {
    const [formData, setFormData] = useState({
        name: '',
        partyName: '',
        photo: null,
        partyLogo: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageSelect = (type, file) => {
        setFormData(prev => ({
            ...prev,
            [type]: file
        }));
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('Please enter candidate name');
            return false;
        }
        if (!formData.partyName.trim()) {
            setError('Please enter party name');
            return false;
        }
        if (!formData.photo) {
            setError('Please select a candidate photo');
            return false;
        }
        if (!formData.partyLogo) {
            setError('Please select a party logo');
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setFormData({
            name: '',
            partyName: '',
            photo: null,
            partyLogo: null
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        const submitFormData = new FormData();
        submitFormData.append('name', formData.name.trim());
        submitFormData.append('partyName', formData.partyName.trim());
        submitFormData.append('zoneId', zoneId);
        submitFormData.append('photo', formData.photo);
        submitFormData.append('partyLogo', formData.partyLogo);

        try {
            const response = await api.post('/admin/add-candidate', submitFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onSuccess(response.data);
            resetForm();
            onClose();
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={() => {
                resetForm();
                onClose();
            }}
            title="Add New Candidate"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && <Alert message={error} />}

                <div className="space-y-4">
                    <Input
                        label="Candidate Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter candidate name"
                    />

                    <Input
                        label="Party Name"
                        name="partyName"
                        value={formData.partyName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter party name"
                    />

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Candidate Photo
                        </label>
                        <ImageUpload
                            onImageSelect={(file) => handleImageSelect('photo', file)}
                            preview={formData.photo ? URL.createObjectURL(formData.photo) : null}
                            className="h-32 w-32 rounded-full"
                            accept="image/*"
                        />
                        <p className="text-sm text-gray-500">
                            Upload a clear photo of the candidate
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Party Logo
                        </label>
                        <ImageUpload
                            onImageSelect={(file) => handleImageSelect('partyLogo', file)}
                            preview={formData.partyLogo ? URL.createObjectURL(formData.partyLogo) : null}
                            className="h-24 w-24"
                            accept="image/*"
                        />
                        <p className="text-sm text-gray-500">
                            Upload the party logo image
                        </p>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
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
                        {loading ? 'Adding...' : 'Add Candidate'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}