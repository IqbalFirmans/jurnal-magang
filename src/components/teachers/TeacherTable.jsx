import React from 'react';
import ActionMenu from '../common/ActionMenu';

const TeacherTable = ({ teachers, onEdit, onViewDetail, onDelete, startIndex = 0, onRollingStudents }) => {
  const mapGenderToIndonesian = (gender) => {
    if (gender === 'man') return 'Laki-laki';
    if (gender === 'woman') return 'Perempuan';
    return gender;
  };

  return (
    <div className="relative overflow-visible bg-white dark:bg-gray-800 rounded-lg shadow">
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
              NUPTK
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Jenis Kelamin
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-center">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {teachers.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-6 py-4 text-sm text-gray-500 text-center dark:text-gray-400">
                Belum ada data guru.
              </td>
            </tr>
          ) : (
            teachers.map((teacher, index) => (
              <tr key={teacher.id}>
                <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {startIndex + index + 1}.
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {teacher.fotoGuruUrl ? (
                    <img
                      src={teacher.fotoGuruUrl}
                      alt={teacher.namaLengkap}
                      className="h-16 w-16 object-cover rounded-full"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                      Tidak ada foto
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                  {teacher.namaLengkap}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {teacher.nuptk}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {mapGenderToIndonesian(teacher.jenisKelamin)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {teacher.email}
                </td>
                <td className="px-6 py-4 text-center text-sm font-medium relative">
                  <ActionMenu
                    teacher={teacher}
                    onRollingStudents={onRollingStudents}
                    onViewDetail={onViewDetail}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherTable;
