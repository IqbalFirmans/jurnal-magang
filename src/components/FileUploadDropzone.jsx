import React, { useState, useEffect, useCallback } from 'react';

const FileUploadDropzone = ({ label, onFileChange, currentPreviewUrl, acceptedFileTypes, heightClass, hasError, disabled = false }) => {
  const [internalPreview, setInternalPreview] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    if (currentPreviewUrl) {
      setInternalPreview(currentPreviewUrl);
    } else {
      setInternalPreview(null);
    }
  }, [currentPreviewUrl]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setInternalPreview(url);
      onFileChange(file, url);
    }
  }, [onFileChange]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setInternalPreview(url);
      onFileChange(file, url);
    }
  }, [onFileChange]);

  const handleRemoveImage = useCallback((e) => {
    e.stopPropagation();
    setInternalPreview(null);
    onFileChange(null, null);
  }, [onFileChange]);

  return (
    <div
      className={`border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer
                  ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 dark:border-gray-600'}
                  ${hasError ? 'border-red-500' : ''} ${heightClass}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
      onDragLeave={() => setIsDragActive(false)}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload-input').click()}
    >
      <input
        type="file"
        id="file-upload-input"
        className="hidden"
        accept={acceptedFileTypes}
        onChange={handleFileSelect}
        disabled={disabled}
      />
      {internalPreview ? (
        <div className="relative w-full h-full flex items-center justify-center">
          <img src={internalPreview} alt="Preview" className="max-w-full max-h-96 object-contain rounded-md" />
        </div>
      ) : (
        <>
          <p className="text-gray-500 dark:text-gray-400 text-center">{label}</p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            {acceptedFileTypes === "image/*" ? "Hanya format gambar yang diizinkan." : `Hanya ${acceptedFileTypes} diizinkan.`}
          </p>
        </>
      )}
    </div>
  );
};

export default FileUploadDropzone;