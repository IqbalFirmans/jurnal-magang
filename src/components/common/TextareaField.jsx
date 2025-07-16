// src/components/common/TextareaField.jsx
import React from 'react';

const TextareaField = ({ label, id, placeholder, rows = 3, value, onChange, hasError = false, disabled = false }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={`mt-1 block w-full rounded-md border
                   ${hasError ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600'}
                   shadow-sm focus:border-blue-500 focus:ring-blue-500
                   bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2
                   ${disabled ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      ></textarea>
    </div>
  );
};

export default TextareaField;