import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import InputField from '../common/InputField';
import TextareaField from '../common/TextAreaField';
import FileUploadDropzone from '../FileUploadDropzone';
import { z } from 'zod';
import { studentFormSchema } from '../../schemas/studentSchema';
import SelectField from '../common/SelectField';

const StudentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isSubmitting,
  apiErrors = {},
}) => {
  const isEditingMode = !!initialData;

  const [formData, setFormData] = useState({
    namaLengkap: '',
    nisn: '',
    tanggalLahir: '',
    jenisKelamin: '',
    alamat: '',
    noTelp: '',
    email: '',
    password: '',
    password_confirmation: '',
    fotoSiswaFile: null,
    fotoSiswaPreviewUrl: null,
  });

  const [localValidationErrors, setLocalValidationErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        namaLengkap: initialData.name || '',
        nisn: initialData.nisn || '',
        tanggalLahir: initialData.date_of_birth?.split('T')[0] || '',
        jenisKelamin: initialData.gender || '',
        alamat: initialData.address || '',
        noTelp: initialData.no_telp || '',
        email: initialData.user_email || '',
        password: initialData.password || '',
        password_confirmation: initialData.password_confirmation || '',
        fotoSiswaFile: null,
        fotoSiswaPreviewUrl: initialData.image || null,
      });
    } else {
      setFormData({
        namaLengkap: '',
        nisn: '',
        tanggalLahir: '',
        jenisKelamin: '',
        alamat: '',
        noTelp: '',
        email: '',
        password: '',
        password_confirmation: '',
        fotoSiswaFile: null,
        fotoSiswaPreviewUrl: null,
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

  const handleFotoSiswaChange = useCallback((file, previewUrl) => {
    setFormData((prev) => ({
      ...prev,
      fotoSiswaFile: file,
      fotoSiswaPreviewUrl: previewUrl,
    }));
    if (localValidationErrors.fotoSiswaFile) {
      setLocalValidationErrors((prev) => ({ ...prev, fotoSiswaFile: undefined }));
    }
  }, [localValidationErrors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLocalValidationErrors({});

    try {
      studentFormSchema(isEditingMode).parse(formData);

      const dataToSend = new FormData();
      dataToSend.append('name', formData.namaLengkap);
      dataToSend.append('nisn', formData.nisn);
      dataToSend.append('date_of_birth', formData.tanggalLahir);
      dataToSend.append('gender', formData.jenisKelamin);
      dataToSend.append('address', formData.alamat);
      dataToSend.append('no_telp', formData.noTelp);
      dataToSend.append('email', formData.email);
      if (!isEditingMode || formData.password) {
        dataToSend.append('password', formData.password);
        dataToSend.append('password_confirmation', formData.password_confirmation);
      }


      if (formData.fotoSiswaFile) {
        dataToSend.append('image', formData.fotoSiswaFile);
      } else if (isEditingMode && !formData.fotoSiswaFile && !formData.fotoSiswaPreviewUrl) {
        dataToSend.append('image', '');
      }

      if (isEditingMode) {
        dataToSend.append('_method', 'PATCH');
        dataToSend.append('user_id', formData.user_id);
      }

      await onSubmit(dataToSend);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors = {};
        err.issues.forEach((issue) => {
          newErrors[issue.path[0]] = issue.message;
        });
        setLocalValidationErrors(newErrors);
      } else {
        console.error('Submit error:', err);
      }
    }
  }, [formData, onSubmit, isEditingMode]);

  const displayErrors = { ...localValidationErrors, ...apiErrors };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-6 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-6xl  ">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {isEditingMode ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-1">
                <FileUploadDropzone
                  label="Foto Siswa"
                  onFileChange={handleFotoSiswaChange}
                  currentPreviewUrl={formData.fotoSiswaPreviewUrl}
                  acceptedFileTypes="image/*"
                  heightClass="min-h-[180px]"
                  hasError={!!displayErrors.fotoSiswaFile}
                />
                {displayErrors.fotoSiswaFile && (
                  <p className="text-red-500 text-sm mt-1">{displayErrors.fotoSiswaFile}</p>
                )}
              </div>

              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <InputField
                    id="namaLengkap"
                    label="Nama Lengkap"
                    value={formData.namaLengkap}
                    onChange={handleChange}
                    hasError={!!displayErrors.namaLengkap}
                  />
                  {displayErrors.namaLengkap && (
                    <p className="text-red-500 text-sm">{displayErrors.namaLengkap}</p>
                  )}
                </div>

                <div>
                  <InputField
                    id="nisn"
                    label="NISN"
                    value={formData.nisn}
                    onChange={handleChange}
                    hasError={!!displayErrors.nisn}
                  />
                  {displayErrors.nisn && (
                    <p className="text-red-500 text-sm">{displayErrors.nisn}</p>
                  )}
                </div>

                <div>
                  <InputField
                    id="tanggalLahir"
                    label="Tanggal Lahir"
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={handleChange}
                    hasError={!!displayErrors.tanggalLahir}
                  />
                  {displayErrors.tanggalLahir && (
                    <p className="text-red-500 text-sm">{displayErrors.tanggalLahir}</p>
                  )}
                </div>

                <div>
                  <SelectField
                    id="jenisKelamin"
                    label="Jenis Kelamin"
                    value={formData.jenisKelamin}
                    onChange={handleChange}
                    options={[
                      { value: '', label: 'Pilih Jenis Kelamin' },
                      { value: 'man', label: 'Laki-laki' },
                      { value: 'woman', label: 'Perempuan' },
                    ]}
                    hasError={!!displayErrors.jenisKelamin}
                    errorMessage={displayErrors.jenisKelamin}
                  />
                </div>

                <div className="md:col-span-2">
                  <TextareaField
                    id="alamat"
                    label="Alamat"
                    rows={3}
                    value={formData.alamat}
                    onChange={handleChange}
                    hasError={!!displayErrors.alamat}
                  />
                  {displayErrors.alamat && (
                    <p className="text-red-500 text-sm">{displayErrors.alamat}</p>
                  )}
                </div>

                <div>
                  <InputField
                    id="noTelp"
                    label="No. Telepon"
                    value={formData.noTelp}
                    onChange={handleChange}
                    hasError={!!displayErrors.noTelp}
                  />
                  {displayErrors.noTelp && (
                    <p className="text-red-500 text-sm">{displayErrors.noTelp}</p>
                  )}
                </div>

                <div>
                  <InputField
                    id="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    hasError={!!displayErrors.email}
                  />
                  {displayErrors.email && (
                    <p className="text-red-500 text-sm">{displayErrors.email}</p>
                  )}
                </div>
                <div>
                  <InputField
                    id="password"
                    label="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    hasError={!!displayErrors.password}
                  />
                  {displayErrors.password && (
                    <p className="text-red-500 text-sm">{displayErrors.password}</p>
                  )}
                </div>
                <div>
                  <InputField
                    id="password_confirmation"
                    label="password_confirmation"
                    type="password"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    hasError={!!displayErrors.password_confirmation}
                  />
                  {displayErrors.password_confirmation && (
                    <p className="text-red-500 text-sm">{displayErrors.password_confirmation}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tombol */}
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-md mr-3 text-gray-700 dark:text-gray-300 border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 disabled:opacity-50"
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

export default StudentFormModal;
