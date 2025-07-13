import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import InputField from '../common/InputField';
import TextareaField from '../common/TextAreaField';
import FileUploadDropzone from '../FileUploadDropzone';
import { z } from 'zod';
import { jurnalSchema } from '../../schemas/journalSchema';

const JournalFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting,
  apiErrors,
}) => {
  const MIN_DESC_CHARS = 1;
  const MAX_DESC_CHARS = 500;
  const isEditingMode = !!initialData;

  const [formData, setFormData] = useState({
    judulJurnal: '',
    deskripsi: '',
    thumbnailFile: null,
    thumbnailPreviewUrl: null,
  });

  const [localValidationErrors, setLocalValidationErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        judulJurnal: initialData.judulJurnal || '',
        deskripsi: initialData.deskripsi || '',
        thumbnailFile: null,
        thumbnailPreviewUrl: initialData.thumbnailUrl || null,
      });
    } else {
      setFormData({
        judulJurnal: '',
        deskripsi: '',
        thumbnailFile: null,
        thumbnailPreviewUrl: null,
      });
    }
    setLocalValidationErrors({});
  }, [initialData, isOpen]);

  const handleChange = useCallback((e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (localValidationErrors[id]) {
      setLocalValidationErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  }, [localValidationErrors]);

  const handleThumbnailChange = useCallback((file, previewUrl) => {
    setFormData((prev) => ({
      ...prev,
      thumbnailFile: file,
      thumbnailPreviewUrl: previewUrl,
    }));
    if (localValidationErrors.thumbnailFile) {
      setLocalValidationErrors((prev) => ({ ...prev, thumbnailFile: undefined }));
    }
  }, [localValidationErrors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLocalValidationErrors({});

    try {
      const currentSchema = jurnalSchema(isEditingMode);
      currentSchema.parse(formData);

      const dataToSend = new FormData();
      dataToSend.append('title', formData.judulJurnal);
      dataToSend.append('description', formData.deskripsi);

      if (formData.thumbnailFile) {
        dataToSend.append('image', formData.thumbnailFile);
      } else if (isEditingMode && !formData.thumbnailFile && !formData.thumbnailPreviewUrl) {
        dataToSend.append('image', '');
      }

      if (isEditingMode) {
        dataToSend.append('_method', 'PATCH');
      }

      await onSubmit(dataToSend);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors = {};
        err.issues.forEach((issue) => {
          newErrors[issue.path[0]] = issue.message;
        });
        setLocalValidationErrors(newErrors);
        console.error('Kesalahan validasi frontend (Zod):', newErrors);
      } else {
        console.error('Kesalahan dalam proses pengiriman:', err);
      }
    }
  }, [formData, onSubmit, isEditingMode]);

  const deskripsiCharCount = formData.deskripsi.length || 0;
  const isDescBelowMin = deskripsiCharCount < MIN_DESC_CHARS;
  const isDescAboveMax = deskripsiCharCount > MAX_DESC_CHARS;

  const deskripsiCharColorClass = isDescBelowMin || isDescAboveMax
    ? 'text-red-500'
    : 'text-green-500';

  const displayErrors = { ...localValidationErrors, ...apiErrors };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-start justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-xl w-full max-w-4xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {isEditingMode ? 'Edit Jurnal' : 'Tambah Jurnal Baru'}
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

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mt-6">
              <FileUploadDropzone
                label="Jatuhkan file di sini untuk mengunggah thumbnail"
                onFileChange={handleThumbnailChange}
                currentPreviewUrl={formData.thumbnailPreviewUrl}
                acceptedFileTypes="image/*"
                heightClass="min-h-[230px]"
                hasError={!!displayErrors.thumbnailFile}
              />
              {displayErrors.thumbnailFile && (
                <p className="text-red-500 text-sm mt-1">{displayErrors.thumbnailFile}</p>
              )}
            </div>

            <div className="flex flex-col space-y-4">
              <InputField
                label="Judul Jurnal"
                id="judulJurnal"
                placeholder="Contoh: Judul jurnal terbaru..."
                value={formData.judulJurnal}
                onChange={handleChange}
                hasError={!!displayErrors.judulJurnal}
              />
              {displayErrors.judulJurnal && (
                <p className="text-red-500 text-sm">{displayErrors.judulJurnal}</p>
              )}

              <TextareaField
                label="Deskripsi"
                id="deskripsi"
                placeholder="Deskripsi jurnal..."
                rows="5"
                value={formData.deskripsi}
                onChange={handleChange}
                hasError={!!displayErrors.deskripsi}
              />
              <div className="flex justify-between text-sm mt-1">
                {displayErrors.deskripsi && (
                  <p className="text-red-500 text-sm">{displayErrors.deskripsi}</p>
                )}
                <p className={`${deskripsiCharColorClass} ml-auto`}>
                  {deskripsiCharCount} / {MIN_DESC_CHARS}-{MAX_DESC_CHARS} Karakter
                </p>
              </div>
            </div>

            <div className="md:col-span-2 flex justify-end mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 mr-3 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Menyimpan...' : isEditingMode ? 'Simpan Perubahan' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default JournalFormModal;
