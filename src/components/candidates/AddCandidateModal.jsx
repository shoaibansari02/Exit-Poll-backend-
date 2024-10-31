// src/components/candidates/AddCandidateModal.jsx
import { useState } from 'react';
import api from '../../utils/axios';
import { handleApiError } from '../../utils/helpers';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import ImageUpload from './ImageUpload';

export default function AddCandidateModal({ open, onClose, onSuccess, zoneId }) {
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!photo) {
            setError('Please select a photo');
            return;
        }

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('zoneId', zoneId);
        formData.append('photo', photo);

        try {
            const response = await api.post('/admin/add-candidate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onSuccess(response.data);
            setName('');
            setPhoto(null);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Add New Candidate"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <Alert message={error} />}

                <Input
                    label="Candidate Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter candidate name"
                />

                <ImageUpload
                    onImageSelect={setPhoto}
                    preview={photo ? URL.createObjectURL(photo) : null}
                />

                <div className="flex justify-end space-x-3">
                    <Button
                        variant="secondary"
                        onClick={onClose}
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
