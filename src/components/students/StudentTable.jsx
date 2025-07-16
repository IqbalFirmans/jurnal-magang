import React from 'react';
import { useAuthStore } from '../../store/authStore';

const StudentTable = ({ students, onEdit, onViewDetail, onDelete, startIndex = 0 }) => {
  const user = useAuthStore((state) => state.user);

  const mapGenderToIndonesian = (gender) => {
    if (gender === 'man') return 'Laki-laki';
    if (gender === 'woman') return 'Perempuan';
    return gender;
  };

  return (
    <div className="w-full overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Foto
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Nama Lengkap
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              NISN
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Jenis Kelamin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {students.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-4 text-sm text-center text-gray-500 dark:text-gray-400">
                Belum ada data siswa.
              </td>
            </tr>
          ) : (
            students.map((student, index) => (
              <tr key={student.id}>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {startIndex + index + 1}.
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {student.fotoSiswaUrl ? (
                    <img
                      src={student.fotoSiswaUrl}
                      alt={student.namaLengkap}
                      className="h-16 w-16 object-cover rounded-full"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                      Tidak ada foto
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {student.namaLengkap}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {student.nisn}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {mapGenderToIndonesian(student.jenisKelamin)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {student.email}
                </td>
                <td className="px-6 py-4 text-center text-sm font-medium">
                  <button
                    onClick={() => onViewDetail(student)}
                    className="px-4 py-2 bg-blue-600 rounded-md text-white hover:text-blue-900 dark:hover:text-blue-600 mr-3"
                    title="Detail"
                  >
                    Detail
                  </button>
                  {user?.role === 'admin' && (
                    <>
                      <button
                        onClick={() => onEdit(student)}
                        className="px-4 py-2 bg-yellow-300 rounded-md text-white hover:text-yellow-900 dark:hover:text-yellow-600 mr-3"
                        title="Edit Data Siswa"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(student.id)}
                        className="px-4 py-2 rounded-md bg-red-600 text-white hover:text-red-900 dark:hover:text-red-900"
                        title="Hapus Data Siswa"
                      >
                        Hapus
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
