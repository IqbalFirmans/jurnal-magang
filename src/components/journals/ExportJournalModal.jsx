import React from 'react';

const ExportModal = ({ isOpen, onClose, onExport, selectedMonth, setSelectedMonth }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-md p-6 shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Export PDF Berdasarkan Bulan</h2>
        
        <input
          type="month"
          className="w-full border rounded-md p-2 dark:bg-gray-700 dark:text-white"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />

        <div className="flex justify-end mt-4 space-x-2">
          <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">Batal</button>
          <button onClick={onExport} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Export</button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;
