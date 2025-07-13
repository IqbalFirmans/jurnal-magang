// src/components/common/ConfirmationModal.jsx
import React from 'react';
import { createPortal } from 'react-dom';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm transform transition-all scale-100 opacity-100">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                        {message}
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md
                                       hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                                       dark:focus:ring-offset-gray-900"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationModal;