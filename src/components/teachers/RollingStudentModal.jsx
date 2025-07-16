import React, { useState, useEffect, useCallback } from 'react';
import { FixedSizeList } from 'react-window';
import { useAuthStore } from '../../store/authStore';
import studentApi from '../../api/studentApi';
import teacherApi from '../../api/teacherApi';

const RollingStudentsModal = ({ isOpen, onClose, teacher, onSave }) => {
    const [availableStudents, setAvailableStudents] = useState([]);
    const [assignedStudents, setAssignedStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [selectedOnLeft, setSelectedOnLeft] = useState([]);
    const [selectedOnRight, setSelectedOnRight] = useState([]);

    const [leftSearchTerm, setLeftSearchTerm] = useState('');
    const [rightSearchTerm, setRightSearchTerm] = useState('');

    const user = useAuthStore(state => state.user);

    useEffect(() => {
        const fetchData = async () => {
            if (!isOpen || !teacher) return;

            setIsLoading(true);
            setIsError(false);

            try {
                const [allStudentsResponse, assignedStudentsResponse] = await Promise.all([
                    studentApi.getStudents(),
                    studentApi.getStudentsByTeacherId(teacher.id)
                ]);

                const assignedIds = new Set(assignedStudentsResponse.map(s => s.id));
                const availableList = allStudentsResponse.filter(s => !assignedIds.has(s.id));
                const assignedList = allStudentsResponse.filter(s => assignedIds.has(s.id));

                setAvailableStudents(availableList);
                setAssignedStudents(assignedList);

            } catch (error) {
                console.error("Gagal mengambil data siswa:", error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [isOpen, teacher]);

    const handleMoveToRight = useCallback(() => {
        const toMove = availableStudents.filter(s => selectedOnLeft.includes(s.id));
        setAvailableStudents(availableStudents.filter(s => !selectedOnLeft.includes(s.id)));
        setAssignedStudents([...assignedStudents, ...toMove]);
        setSelectedOnLeft([]);
    }, [availableStudents, selectedOnLeft, assignedStudents]);

    const handleMoveAllToRight = useCallback(() => {
        setAssignedStudents([...assignedStudents, ...availableStudents]);
        setAvailableStudents([]);
        setSelectedOnLeft([]);
    }, [availableStudents, assignedStudents]);

    const handleMoveToLeft = useCallback(() => {
        const toMove = assignedStudents.filter(s => selectedOnRight.includes(s.id));
        setAssignedStudents(assignedStudents.filter(s => !selectedOnRight.includes(s.id)));
        setAvailableStudents([...availableStudents, ...toMove]);
        setSelectedOnRight([]);
    }, [assignedStudents, selectedOnRight, availableStudents]);

    const handleMoveAllToLeft = useCallback(() => {
        setAvailableStudents([...availableStudents, ...assignedStudents]);
        setAssignedStudents([]);
        setSelectedOnRight([]);
    }, [availableStudents, assignedStudents]);

    const handleFinalSave = async () => {
        setIsSaving(true);
        try {
            const studentIds = assignedStudents.map(s => s.id);
            await onSave(teacher.id, studentIds);
        } catch (error) {
            console.log("Gagal menyimpan data:", error)
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
                    <p className="text-gray-800 dark:text-gray-200 text-lg font-semibold">Memuat data siswa...</p>
                    <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500 mx-auto"></div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
                    <p className="text-red-500 text-lg font-semibold">Gagal memuat data.</p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Terjadi kesalahan saat mengambil data dari server.</p>
                    <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md">Tutup</button>
                </div>
            </div>
        );
    }

    const filteredAvailable = availableStudents.filter(s =>
        (s.name || '').toLowerCase().includes(leftSearchTerm.toLowerCase())
    ).sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    const filteredAssigned = assignedStudents.filter(s =>
        (s.name || '').toLowerCase().includes(rightSearchTerm.toLowerCase())
    ).sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    const listItemHeight = 48;

    const LeftRow = ({ index, style }) => {
        const student = filteredAvailable[index];
        if (!student) return null;
        return (
            <div
                style={style}
                className={`p-2 cursor-pointer ${selectedOnLeft.includes(student.id) ? 'bg-red-200 dark:bg-red-700' : 'hover:bg-gray-200 dark:hover:bg-gray-600'} text-gray-800 dark:text-gray-200 transition-colors duration-100`}
                onClick={() => setSelectedOnLeft(prev => prev.includes(student.id) ? prev.filter(id => id !== student.id) : [...prev, student.id])}
            >
                <div className="flex items-center gap-3">
                    <img src={student.image} alt={student.name} className="w-9 h-9 rounded-full object-cover" />
                    <span>{student.name || 'Nama Tidak Tersedia'}</span>
                </div>
            </div>
        );
    };

    const RightRow = ({ index, style }) => {
        const student = filteredAssigned[index];
        if (!student) return null;
        return (
            <div
                style={style}
                className={`p-2 cursor-pointer ${selectedOnRight.includes(student.id) ? 'bg-red-200 dark:bg-red-700' : 'hover:bg-gray-200 dark:hover:bg-gray-600'} text-gray-800 dark:text-gray-200 transition-colors duration-100`}
                onClick={() => setSelectedOnRight(prev => prev.includes(student.id) ? prev.filter(id => id !== student.id) : [...prev, student.id])}
            >
                <div className="flex items-center gap-3">
                    <img src={student.image} alt={student.name} className="w-9 h-9 rounded-full object-cover" />
                    <span>{student.name || 'Nama Tidak Tersedia'}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl p-6">
                <div className="flex justify-between items-center mb-4 border-b pb-4 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Rolling Siswa untuk Guru: {teacher?.name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-center md:items-stretch">
                    {/* Daftar Siswa Tersedia (Kiri) */}
                    <div className="w-full md:w-5/12 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Siswa Tersedia ({filteredAvailable.length})</h3>
                        <input
                            type="text"
                            placeholder="Cari..."
                            value={leftSearchTerm}
                            onChange={(e) => setLeftSearchTerm(e.target.value)}
                            className="w-full p-2 mb-3 rounded-md text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <div className="h-96 border border-gray-300 dark:border-gray-600 rounded-md">
                            <FixedSizeList
                                height={384}
                                itemCount={filteredAvailable.length}
                                itemSize={listItemHeight}
                                width="100%"
                            >
                                {LeftRow}
                            </FixedSizeList>
                        </div>
                    </div>

                    {/* Tombol Kontrol (Tengah) */}
                    <div className="w-full md:w-2/12 flex md:flex-col justify-center items-center gap-2">
                        <button onClick={handleMoveToRight} disabled={selectedOnLeft.length === 0} className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 disabled:opacity-50 transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button onClick={handleMoveAllToRight} disabled={availableStudents.length === 0} className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 disabled:opacity-50 transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" />
                                <path d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" />
                            </svg>
                        </button>
                        <button onClick={handleMoveToLeft} disabled={selectedOnRight.length === 0} className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 disabled:opacity-50 transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9.707 4.293a1 1 0 010 1.414L5.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button onClick={handleMoveAllToLeft} disabled={assignedStudents.length === 0} className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 disabled:opacity-50 transition-colors duration-200 hover:bg-gray-300 dark:hover:bg-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.707 4.293a1 1 0 010 1.414L5.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" />
                                <path d="M15.707 4.293a1 1 0 010 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" />
                            </svg>
                        </button>
                    </div>

                    {/* Daftar Siswa Terpilih (Kanan) */}
                    <div className="w-full md:w-5/12 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-inner">
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Siswa Terpilih ({filteredAssigned.length})</h3>
                        <input
                            type="text"
                            placeholder="Cari..."
                            value={rightSearchTerm}
                            onChange={(e) => setRightSearchTerm(e.target.value)}
                            className="w-full p-2 mb-3 rounded-md text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                        <div className="h-96 border border-gray-300 dark:border-gray-600 rounded-md">
                            <FixedSizeList
                                height={384}
                                itemCount={filteredAssigned.length}
                                itemSize={listItemHeight}
                                width="100%"
                            >
                                {RightRow}
                            </FixedSizeList>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleFinalSave}
                        disabled={isSaving}
                        className={`px-4 py-2 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 
                            ${isSaving ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:focus:ring-offset-gray-900'}`}
                    >
                        {isSaving ? (
                            <span className="flex items-center">
                                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Menyimpan...
                            </span>
                        ) : (
                            'Simpan'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RollingStudentsModal;