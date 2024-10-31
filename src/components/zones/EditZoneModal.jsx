// src/components/zones/EditZoneModal.jsx
import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { handleApiError } from '../../utils/helpers';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';

export default function EditZoneModal({ zone, onClose, onSuccess }) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (zone) {
            setName(zone.name);
        }
    }, [zone]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.put(`/admin/updateZone/${zone._id}`, {
                name: name.trim(),
            });
            onSuccess(response.data);
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={!!zone}
            onClose={onClose}
            title="Edit Zone"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <Alert message={error} />}

                <Input
                    label="Zone Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter zone name"
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