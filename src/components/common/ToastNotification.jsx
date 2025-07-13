// src/components/common/ToastNotification.jsx
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const ToastNotification = ({ message, type, duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) {
                    onClose();
                }
            }, duration);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [message, duration, onClose]);

    if (!isVisible) return null;

    let bgColor = '';
    let textColor = '';
    let borderColor = '';

    switch (type) {
        case 'success':
            bgColor = 'bg-green-500';
            textColor = 'text-white';
            borderColor = 'border-green-600';
            break;
        case 'error':
            bgColor = 'bg-red-500';
            textColor = 'text-white';
            borderColor = 'border-red-600';
            break;
        case 'warning':
            bgColor = 'bg-yellow-500';
            textColor = 'text-gray-900';
            borderColor = 'border-yellow-600';
            break;
        case 'info':
        default:
            bgColor = 'bg-blue-500';
            textColor = 'text-white';
            borderColor = 'border-blue-600';
            break;
    }

    return createPortal(
        <div
            className={`fixed top-4 right-4 z-[9999] p-4 rounded-md shadow-lg border-l-4
                        ${bgColor} ${textColor} ${borderColor}
                        transition-transform transform
                        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
            role="alert"
        >
            <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                    {/* Anda bisa menambahkan ikon di sini, contoh: */}
                    {type === 'success' && (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    )}
                    {type === 'error' && (
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
                <div>
                    <p className="font-medium">{message}</p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="ml-auto -mx-1.5 -my-1.5 bg-transparent text-white rounded-lg focus:ring-2 focus:ring-white p-1.5 hover:bg-opacity-80 inline-flex h-8 w-8 dark:text-white"
                >
                    <span className="sr-only">Close</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>,
        document.body
    );
};

export default ToastNotification;