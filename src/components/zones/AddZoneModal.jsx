// src/components/zones/AddZoneModal.jsx
import { useState } from 'react';
import api from '../../utils/axios';
import { handleApiError } from '../../utils/helpers';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';

export default function AddZoneModal({ open, onClose, cityId, onSuccess }) {
    const [zoneNames, setZoneNames] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const zones = zoneNames.split('\n')
            .map(name => name.trim())
            .filter(name => name);

        if (zones.length === 0) {
            setError('Please enter at least one zone name');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/admin/addZones', {
                cityId,
                zones,
            });
            onSuccess(response.data.zones);
            setZoneNames('');
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
            title="Add New Zones"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <Alert message={error} />}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zone Names
                    </label>
                    <textarea
                        value={zoneNames}
                        onChange={(e) => setZoneNames(e.target.value)}
                        required
                        placeholder="Enter zone names (one per line)"
                        rows={5}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Enter multiple zone names, one per line
                    </p>
                </div>

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
                        {loading ? 'Adding...' : 'Add Zones'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}