import React, { useState, useEffect, useCallback, useMemo } from 'react';
import TeacherTable from '../components/teachers/TeacherTable';
import TeacherFormModal from '../components/teachers/TeacherFormModal';
import TeacherDetailModal from '../components/teachers/TeacherDetailModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ToastNotification from '../components/common/ToastNotification';
import teacherApi from '../api/teacherApi';
import InputField from '../components/common/InputField';


const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formApiErrors, setFormApiErrors] = useState(null);
  const [error, setError] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '', id: null });

  const [searchName, setSearchName] = useState('');
  const [filterGender, setFilterGender] = useState('');

  const handleCloseModal = useCallback(() => {
    setIsFormModalOpen(false);
    setIsDetailModalOpen(false);
    setIsConfirmModalOpen(false);
    setCurrentTeacher(null);
    setTeacherToDelete(null);
    setFormApiErrors(null);
  }, []);

  const showToast = useCallback((message, type) => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const handleCloseToast = useCallback(() => {
    setToast({ message: '', type: '', id: null });
  }, []);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await teacherApi.getTeachers();
      const mapped = (Array.isArray(res) ? res : []).map((item) => ({
        id: item.id,
        user_id: item.user_id,
        namaLengkap: item.name, 
        nuptk: item.nuptk,
        tanggalLahir: item.date_of_birth,
        jenisKelamin: item.gender,
        alamat: item.address,
        noTelp: item.no_telp,
        email: item.user_email,
        fotoGuruUrl: item.image,
        role: item.role,
      }));
      setTeachers(mapped);
    } catch (err) {
      console.error("Error fetching teachers:", err.response?.data || err.message);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const filteredTeachers = useMemo(() => {
    let temp = teachers;
    if (filterGender) temp = temp.filter(t => t.jenisKelamin === filterGender);
    if (searchName) {
      const q = searchName.toLowerCase();
      temp = temp.filter(t =>
        (t.namaLengkap && t.namaLengkap.toLowerCase().includes(q)) ||
        (t.nuptk && t.nuptk.toLowerCase().includes(q)) ||
        (t.email && t.email.toLowerCase().includes(q))
      );
    }
    return temp;
  }, [teachers, filterGender, searchName]);

  const handleSearchNameChange = useCallback(e => setSearchName(e.target.value), []);
  const handleGenderChange = useCallback(e => setFilterGender(e.target.value), []);

  const handleAddTeacher = useCallback(() => {
    setCurrentTeacher(null);
    setIsFormModalOpen(true);
  }, []);

  const handleFormSubmit = useCallback(async (formData) => {
    setIsSubmittingForm(true);
    setFormApiErrors(null);
    try {
      if (currentTeacher) {
        await teacherApi.updateTeacher(currentTeacher.id, formData);
        showToast('Data guru berhasil diperbarui!', 'success');
      } else {
        await teacherApi.storeTeacher(formData);
        showToast('Data guru berhasil ditambahkan!', 'success');
      }
      handleCloseModal();
      await fetchTeachers();
    } catch (err) {
      if (err.response?.status === 422) {
        setFormApiErrors(err.response.data.errors);
        showToast('Validasi gagal. Mohon cek kembali isian.', 'error');
      } else {
        showToast('Gagal menyimpan guru: ' + (err.response?.data?.message || err.message), 'error');
      }
    } finally {
      setIsSubmittingForm(false);
    }
  }, [currentTeacher, handleCloseModal, fetchTeachers, showToast]);

  const handleEditTeacher = useCallback((teacher) => {
    setCurrentTeacher({
      id: teacher.id,
      user_id: teacher.user_id,
      name: teacher.namaLengkap,
      nuptk: teacher.nuptk,
      date_of_birth: teacher.tanggalLahir,
      gender: teacher.jenisKelamin,
      address: teacher.alamat,
      no_telp: teacher.noTelp,
      user_email: teacher.email,
      image: teacher.fotoGuruUrl,
      password: '',
      password_confirmation: '',
    });
    setIsFormModalOpen(true);
  }, []);

  const handleViewDetail = useCallback((teacher) => {
    setCurrentTeacher(teacher);
    setIsDetailModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((id) => {
    setTeacherToDelete(id);
    setIsConfirmModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!teacherToDelete) return;
    try {
      await teacherApi.deleteTeacher(teacherToDelete);
      setTeachers(prev => prev.filter(t => t.id !== teacherToDelete));
      showToast('Data guru berhasil dihapus!', 'success');
    } catch (err) {
      showToast('Gagal menghapus guru: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      handleCloseModal();
    }
  }, [teacherToDelete, handleCloseModal, showToast]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex-grow">
          <button
            onClick={handleAddTeacher}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md
                       hover:bg-red-700 w-full sm:w-auto"
          >
            Tambah Guru
          </button>
        </div>
        <div className="flex flex-col sm:flex-row items-end gap-3 w-full sm:w-auto">
          <InputField
            id="searchName"
            type="text"
            placeholder="Cari nama, NUPTK, atau email..."
            value={searchName}
            onChange={handleSearchNameChange}
          />
          <select
            id="filterGender"
            value={filterGender}
            onChange={handleGenderChange}
            className="mt-2 sm:mt-0 rounded-md p-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Semua Jenis Kelamin</option>
            <option value="man">Laki-laki</option>
            <option value="woman">Perempuan</option>
          </select>
          {(filterGender || searchName) && (
            <button onClick={() => { setFilterGender(''); setSearchName(''); }} className="mt-2 sm:mt-0 px-4 py-2 bg-gray-200 rounded-md">
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-center">Memuat daftar guru...</p>
      ) : error ? (
        <p className="text-center text-red-600">Error memuat guru: {error.message}</p>
      ) : (
        <TeacherTable
          teachers={filteredTeachers}
          onEdit={handleEditTeacher}
          onViewDetail={handleViewDetail}
          onDelete={handleDeleteClick}
        />
      )}

      <TeacherFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={currentTeacher}
        isSubmitting={isSubmittingForm}
        apiErrors={formApiErrors}
      />

      <TeacherDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        teacher={currentTeacher}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus guru ini?"
      />

      <ToastNotification
        key={toast.id}
        message={toast.message}
        type={toast.type}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default TeachersPage;
