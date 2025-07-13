import React from 'react';

const InputField = ({ label, id, type = 'text', placeholder, value, onChange, hasError = false, disabled = false }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        className={`mt-1 block w-full rounded-md border
           ${hasError ? 'border-red-500 ring-red-500' : 'border-gray-300 dark:border-gray-600'}
           shadow-sm focus:border-red-500 focus:ring-red-500
           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2.5`}

        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};

export default InputField;
