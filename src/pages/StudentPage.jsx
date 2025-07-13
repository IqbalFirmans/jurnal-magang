import React, { useState, useCallback, useEffect, useMemo } from 'react';
import StudentTable from '../components/students/StudentTable';
import StudentFormModal from '../components/students/StudentFormModal';
import StudentDetailModal from '../components/students/StudentDetailModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ToastNotification from '../components/common/ToastNotification';
import InputField from '../components/common/InputField';
import studentApi from '../api/studentApi';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formApiErrors, setFormApiErrors] = useState(null);
  const [error, setError] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [toast, setToast] = useState({ message: '', type: '', id: null });

  const [searchName, setSearchName] = useState('');
  const [filterGender, setFilterGender] = useState('');

  const handleCloseModal = useCallback(() => {
    setIsFormModalOpen(false);
    setIsDetailModalOpen(false);
    setIsConfirmModalOpen(false);
    setCurrentStudent(null);
    setStudentToDelete(null);
    setFormApiErrors(null);
  }, []);

  const showToast = useCallback((message, type) => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const handleCloseToast = useCallback(() => {
    setToast({ message: '', type: '', id: null });
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await studentApi.getStudents();
      const mapped = (Array.isArray(res) ? res : []).map((item) => ({
        id: item.id,
        user_id: item.user_id,
        namaLengkap: item.name,
        nisn: item.nisn,
        tanggalLahir: item.date_of_birth,
        jenisKelamin: item.gender,
        alamat: item.address,
        noTelp: item.no_telp,
        email: item.user_email,
        fotoSiswaUrl: item.image,
        role: item.role,
      }));
      setStudents(mapped);
    } catch (err) {
      console.error("Error fetching students:", err.response?.data || err.message);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = useMemo(() => {
    let tempStudents = students;

    if (filterGender) {
      tempStudents = tempStudents.filter(student => student.jenisKelamin === filterGender);
    }

    if (searchName) {
      const lowerCaseSearch = searchName.toLowerCase();
      tempStudents = tempStudents.filter(student =>
        (student.namaLengkap && String(student.namaLengkap).toLowerCase().includes(lowerCaseSearch)) ||
        (student.nisn && String(student.nisn).toLowerCase().includes(lowerCaseSearch)) ||
        (student.email && String(student.email).toLowerCase().includes(lowerCaseSearch))
      );
    }

    return tempStudents;
  }, [students, filterGender, searchName]);

  const handleSearchNameChange = useCallback((e) => {
    setSearchName(e.target.value);
  }, []);

  const handleGenderChange = useCallback((e) => {
    setFilterGender(e.target.value);
  }, []);

  const handleAddStudent = useCallback(() => {
    setCurrentStudent(null);
    setIsFormModalOpen(true);
  }, []);

  const handleFormSubmit = useCallback(async (formData) => {
    setIsSubmittingForm(true);
    setFormApiErrors(null);
    try {
      if (currentStudent) {
        await studentApi.updateStudent(currentStudent.id, formData);
        showToast('Data siswa berhasil diperbarui!', 'success');
      } else {
        await studentApi.storeStudent(formData);
        showToast('Data siswa berhasil ditambahkan!', 'success');
      }
      handleCloseModal();
      fetchStudents();
    } catch (err) {
      if (err.response?.status === 422) {
        setFormApiErrors(err.response.data.errors);
        showToast('Validasi gagal. Mohon cek kembali isian.', 'error');
      } else {
        showToast('Gagal menyimpan siswa: ' + (err.response?.data?.message || err.message), 'error');
      }
    } finally {
      setIsSubmittingForm(false);
    }
  }, [currentStudent, handleCloseModal, fetchStudents, showToast]);

  const handleEditStudent = useCallback((student) => {
    setCurrentStudent({
      id: student.id,
      user_id: student.user_id,
      name: student.namaLengkap,
      nisn: student.nisn,
      date_of_birth: student.tanggalLahir,
      gender: student.jenisKelamin,
      address: student.alamat,
      no_telp: student.noTelp,
      user_email: student.email,
      image: student.fotoSiswaUrl,
      password: '',
      password_confirmation: '',
    });
    setIsFormModalOpen(true);
  }, []);

  const handleViewDetail = useCallback((student) => {
    setCurrentStudent(student);
    setIsDetailModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((studentId) => {
    setStudentToDelete(studentId);
    setIsConfirmModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (studentToDelete) {
      try {
        await studentApi.deleteStudent(studentToDelete);
        setStudents(prev => prev.filter(s => s.id !== studentToDelete));
        showToast('Data siswa berhasil dihapus!', 'success');
      } catch (err) {
        showToast('Gagal menghapus siswa: ' + (err.response?.data?.message || err.message), 'error');
      } finally {
        handleCloseModal();
      }
    }
  }, [studentToDelete, handleCloseModal, showToast]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex-grow">
          <button
            onClick={handleAddStudent}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md
                      hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                      dark:focus:ring-offset-gray-900 w-full sm:w-auto"
          >
            Tambah Siswa
          </button>
        </div>

        {/* --- Bagian Filter --- */}
        <div className="flex flex-col sm:flex-row items-end gap-3 w-full sm:w-auto">
          <div className="flex-1 w-full sm:w-auto">
            <input
              type="text"
              id="searchName"
              value={searchName}
              onChange={handleSearchNameChange}
              placeholder="Cari nama, NISN, atau email..."
              className="block w-full rounded-md border-gray-300 dark:border-gray-600
                         shadow-sm focus:border-red-500 focus:ring-red-500
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2.5"
            />
          </div>

          <div className="flex-1 w-full sm:w-auto">
            <select
              id="filterGender"
              value={filterGender}
              onChange={handleGenderChange}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600
                         shadow-sm focus:border-red-500 focus:ring-red-500
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2.5"
            >
              <option value="">Semua Jenis Kelamin</option>
              <option value="man">Laki-laki</option>
              <option value="woman">Perempuan</option>
            </select>
          </div>

          {(filterGender || searchName) && (
            <button
              onClick={() => { setSearchName(''); setFilterGender(''); }}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-sm
                         hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                         dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-900 w-full sm:w-auto"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Memuat daftar siswa...</p>
      ) : error ? (
        <p className="text-center text-red-600">Error memuat siswa: {error.message || 'Terjadi kesalahan.'}</p>
      ) : (
        <StudentTable
          students={filteredStudents}
          onEdit={handleEditStudent}
          onViewDetail={handleViewDetail}
          onDelete={handleDeleteClick}
        />
      )}

      <StudentFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={currentStudent}
        isSubmitting={isSubmittingForm}
        apiErrors={formApiErrors}
      />

      <StudentDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        student={currentStudent}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus"
        message="Apakah Anda yakin ingin menghapus siswa ini?"
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

export default StudentsPage;