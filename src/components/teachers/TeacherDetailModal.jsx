import React from 'react';
import { createPortal } from 'react-dom';
import InputField from '../common/InputField';
import TextareaField from '../common/TextAreaField';
import FileUploadDropzone from '../FileUploadDropzone';

const TeacherDetailModal = ({ isOpen, onClose, teacher }) => {
  if (!isOpen || !teacher) return null;

  const formatTanggal = (tanggal) => {
    if (!tanggal) return '-';
    try {
      return new Date(tanggal).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return '-';
    }
  };

  const genderLabel = (val) =>
    val === 'man' ? 'Laki-laki' : val === 'woman' ? 'Perempuan' : '-';

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 p-6 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-6xl mt-10">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Detail Data Guru
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
              title="Tutup"
            >
              ✕
            </button>
          </div>

          {/* Konten Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Foto Guru */}
            <div className="col-span-1">
              <FileUploadDropzone
                label="Foto Guru"
                currentPreviewUrl={teacher.fotoGuruUrl}
                heightClass="min-h-[180px]"
                disabled={true}
              />
            </div>

            {/* Data Form */}
            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                id="detailNamaLengkap"
                label="Nama Lengkap"
                value={teacher.namaLengkap || '-'}
                disabled
                readOnly
              />

              <InputField
                id="detailNuptk"
                label="NUPTK"
                value={teacher.nuptk || '-'}
                disabled
                readOnly
              />

              <InputField
                id="detailTanggalLahir"
                label="Tanggal Lahir"
                value={formatTanggal(teacher.tanggalLahir)}
                disabled
                readOnly
              />

              <InputField
                id="detailJenisKelamin"
                label="Jenis Kelamin"
                value={genderLabel(teacher.jenisKelamin)}
                disabled
                readOnly
              />

              <div className="md:col-span-2">
                <TextareaField
                  id="detailAlamat"
                  label="Alamat"
                  value={teacher.alamat || '-'}
                  rows={3}
                  disabled
                />
              </div>

              <InputField
                id="detailNoTelp"
                label="No. Telepon"
                value={teacher.noTelp || '-'}
                disabled
                readOnly
              />

              <InputField
                id="detailEmail"
                label="Email"
                value={teacher.email || '-'}
                disabled
                readOnly
              />
            </div>
          </div>

          {/* Tombol Tutup */}
          <div className="flex justify-end mt-8">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
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

export default TeacherDetailModal;
