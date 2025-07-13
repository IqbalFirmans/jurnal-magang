import React, { useEffect, useState, useMemo, useCallback } from 'react';
import StudentTable from '../../components/students/StudentTable';
import StudentDetailModal from '../../components/students/StudentDetailModal';
import ToastNotification from '../../components/common/ToastNotification';
import InputField from '../../components/common/InputField';
import SelectField from '../../components/common/SelectField';
import studentApi from '../../api/studentApi';

const TeacherStudentView = () => {
    const [students, setStudents] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [filterGender, setFilterGender] = useState('');
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '', id: null });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;


    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);

    const handleViewDetail = useCallback((student) => {
        setCurrentStudent(student);
        setIsDetailModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsDetailModalOpen(false);
        setCurrentStudent(null);
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const res = await studentApi.getTeacherStudents();
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
                setToast({ message: 'Gagal memuat siswa.', type: 'error', id: Date.now() });
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

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
    }, [students, searchName, filterGender]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchName, filterGender]);


    const paginatedStudents = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredStudents.slice(start, start + itemsPerPage);
    }, [filteredStudents, currentPage]);


    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                <h4 className=" text-black font-semibold ">
                    Daftar Siswa
                </h4>
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
                        onEdit={null}
                        onViewDetail={handleViewDetail}
                        onDelete={null}
                    />

                    {filteredStudents.length > itemsPerPage && (
                        <div className="flex justify-center mt-4 gap-2">
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
                    )}
                </>
            )}



            <StudentDetailModal
                isOpen={isDetailModalOpen}
                onClose={handleCloseModal}
                student={currentStudent}
            />

            <ToastNotification
                key={toast.id}
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: '', type: '', id: null })}
            />
        </div>
    );
};

export default TeacherStudentView;
