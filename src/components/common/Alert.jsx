// src/components/common/Alert.jsx
export function Alert({ type = 'error', message }) {
    const types = {
        error: 'bg-red-50 text-red-700',
        success: 'bg-green-50 text-green-700',
        warning: 'bg-yellow-50 text-yellow-700',
        info: 'bg-blue-50 text-blue-700',
    };

    if (!message) return null;

    return (
        <div className={`rounded-md p-4 ${types[type]}`}>
            <p className="text-sm">{message}</p>
        </div>
    );
}