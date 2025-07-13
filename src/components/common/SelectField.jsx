import React from 'react';

const SelectField = ({
  id,
  label,
  value,
  onChange,
  options = [],
  hasError = false,
  errorMessage = '',
  className = '',
  required = false,
}) => {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label} {required && '*'}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`block w-full p-2.5 rounded-md border ${
          hasError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
        } focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {hasError && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default SelectField;
