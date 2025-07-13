import React from 'react';

const TeacherTable = ({ teachers, onEdit, onViewDetail, onDelete }) => {
  const mapGenderToIndonesian = (gender) => {
    if (gender === 'man') {
      return 'Laki-laki';
    } else if (gender === 'woman') {
      return 'Perempuan';
    }
    return gender;
  };

  console.log("Teacher table: ",teachers)
  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Foto
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Nama Lengkap
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              NUPTK
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Jenis Kelamin
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {teachers.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center dark:text-gray-400">
                Belum ada data guru.
              </td>
            </tr>
          ) : (
            teachers.map((teacher) => (
              <tr key={teacher.id}>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {teacher.namaLengkap}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {teacher.nuptk}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {mapGenderToIndonesian(teacher.jenisKelamin)} 
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {teacher.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <button
                    onClick={() => onViewDetail(teacher)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-600 mr-3"
                    title="Lihat Detail"
                  >
                    Lihat
                  </button>
                  <button
                    onClick={() => onEdit(teacher)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-600 mr-3"
                    title="Edit Data Siswa"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(teacher.id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600"
                    title="Hapus Data Siswa"
                  >
                    Hapus
                  </button>
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