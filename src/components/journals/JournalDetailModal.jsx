// src/components/journals/JournalDetailModal.jsx
import React from 'react';
import { createPortal } from 'react-dom';
import InputField from '../common/InputField';
import TextareaField from '../common/TextAreaField';
import FileUploadDropzone from '../FileUploadDropzone'; 

const JournalDetailModal = ({ isOpen, onClose, journal }) => {
  if (!isOpen || !journal) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-start justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-xl w-full max-w-4xl transform transition-all scale-100 opacity-100">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Detail Jurnal
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Tutup"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-1 mt-6">
              <FileUploadDropzone
                label="Tidak ada gambar" 
                currentPreviewUrl={journal.thumbnailUrl}
                heightClass="min-h-[400px]"
                disabled={true}
              />
            </div>

            <div className="md:col-span-1 flex flex-col space-y-4">
              <InputField
                label="Judul Jurnal"
                id="detailJudulJurnal"
                value={journal.judulJurnal}
                disabled={true} 
              />
              <TextareaField
                label="Deskripsi"
                id="detailDeskripsi"
                value={journal.deskripsi}
                rows="5"
                disabled={true} 
              />
              <InputField
                label="Tanggal Dibuat"
                id="detailCreatedAt"
                value={new Date(journal.createdAt).toLocaleDateString('id-ID', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
                disabled={true}
              />
              <InputField
                label="Tanggal Diperbarui"
                id="detailUpdatedAt"
                value={new Date(journal.updatedAt).toLocaleDateString('id-ID', {
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
                disabled={true}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md
                         hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                         dark:focus:ring-offset-gray-900"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default JournalDetailModal;