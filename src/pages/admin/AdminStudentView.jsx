// AdminStudentView.jsx
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import StudentTable from '../../components/students/StudentTable';
import StudentFormModal from '../../components/students/StudentFormModal';
import StudentDetailModal from '../../components/students/StudentDetailModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import ToastNotification from '../../components/common/ToastNotification';
import InputField from '../../components/common/InputField';
import SelectField from '../../components/common/SelectField';
import studentApi from '../../api/studentApi';

const AdminStudentView = () => {
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;


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
            const mapped = (Array.isArray(res) ? res : []).map(item => ({
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
            console.error('Error fetching students:', err.response?.data || err.message);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const filteredStudents = useMemo(() => {
        let temp = students;
        if (filterGender) temp = temp.filter(s => s.jenisKelamin === filterGender);
        if (searchName) {
            const q = searchName.toLowerCase();
            temp = temp.filter(s =>
                s.namaLengkap?.toLowerCase().includes(q) ||
                s.nisn?.toLowerCase().includes(q) ||
                s.email?.toLowerCase().includes(q)
            );
        }
        return temp;
    }, [students, filterGender, searchName]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchName, filterGender]);


    const paginatedStudents = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredStudents.slice(start, start + itemsPerPage);
    }, [filteredStudents, currentPage]);

    const handleAddStudent = () => {
        setCurrentStudent(null);
        setIsFormModalOpen(true);
    };

    const handleEditStudent = (student) => {
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
    };

    const handleViewDetail = (student) => {
        setCurrentStudent(student);
        setIsDetailModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        setStudentToDelete(id);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!studentToDelete) return;
        try {
            await studentApi.deleteStudent(studentToDelete);
            setStudents(prev => prev.filter(s => s.id !== studentToDelete));
            showToast('Data siswa berhasil dihapus!', 'success');
        } catch (err) {
            showToast('Gagal menghapus siswa: ' + (err.response?.data?.message || err.message), 'error');
        } finally {
            handleCloseModal();
        }
    };

    const handleFormSubmit = async (formData) => {
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
                showToast('Validasi gagal. Mohon periksa kembali.', 'error');
            } else {
                showToast('Gagal menyimpan siswa.', 'error');
            }
        } finally {
            setIsSubmittingForm(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <button onClick={handleAddStudent} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700">
                    Tambah Siswa
                </button>

                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <InputField
                        id="searchName"
                        type="text"
                        placeholder="Cari nama, NISN, atau email..."
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                    />
                    <SelectField
                        id="filterGender"
                        value={filterGender}
                        onChange={e => setFilterGender(e.target.value)}
                        options={[
                            { label: 'Semua Jenis Kelamin', value: '' },
                            { label: 'Laki-laki', value: 'man' },
                            { label: 'Perempuan', value: 'woman' },
                        ]}
                    />
                </div>
            </div>

            {loading ? (
                <p className="text-center">Memuat data siswa...</p>
            ) : (
                <>
                    <StudentTable
                        students={paginatedStudents}
                        onEdit={handleEditStudent}
                        onViewDetail={handleViewDetail}
                        onDelete={handleDeleteClick}
                    />
                    <div className="flex justify-end mt-4 gap-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span className="px-4 py-2 text-gray-700 dark:text-gray-200">
                            Page {currentPage} of {Math.ceil(filteredStudents.length / itemsPerPage)}
                        </span>
                        <button
                            disabled={currentPage >= Math.ceil(filteredStudents.length / itemsPerPage)}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
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

export default AdminStudentView;
