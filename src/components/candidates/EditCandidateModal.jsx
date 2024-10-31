// src/components/candidates/EditCandidateModal.jsx
import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { handleApiError } from '../../utils/helpers';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import ImageUpload from './ImageUpload';

export default function EditCandidateModal({ open, onClose, onSuccess, candidate }) {
    const [name, setName] = useState('');
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (candidate) {
            setName(candidate.name);
        }
    }, [candidate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('name', name);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            const response = await api.put(
                `/admin/update-candidate/${candidate._id}`,
                formData,
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

    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Edit Candidate"
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
                    preview={photo ? URL.createObjectURL(photo) : candidate?.photoUrl}
                    existingImage={true}
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
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}