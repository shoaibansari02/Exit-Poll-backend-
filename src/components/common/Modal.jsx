// src/components/common/Modal.jsx
import { Fragment } from 'react';
import { X } from 'lucide-react';

export function Modal({
    open,
    onClose,
    title,
    children,
    maxWidth = 'max-w-lg'
}) {
    if (!open) return null;

    return (
        <Fragment>
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className={`relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full ${maxWidth} sm:p-6`}>
                        <div className="absolute right-0 top-0 pr-4 pt-4">
                            <button
                                type="button"
                                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                onClick={onClose}
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {title && (
                            <div className="mb-4">
                                <h3 className="text-lg font-medium leading-6 text-gray-900">
                                    {title}
                                </h3>
                            </div>
                        )}

                        {children}
                    </div>
                </div>
            </div>
        </Fragment>
    );
}