import React from 'react';
import { useAuthStore } from '../../store/authStore';

const JournalTable = ({ journals, onEdit, onViewDetail, onDelete, startIndex = 0 }) => {
    const user = useAuthStore((state) => state.user);
    return (
        <div className="w-full overflow-x-auto bg-white dark:bg-gray-800 rounded-md shadow">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Judul Jurnal
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Nama Siswa
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Deskripsi
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Bukti
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Tanggal Dibuat
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {journals.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                Belum ada jurnal yang tersedia.
                            </td>
                        </tr>
                    ) : (
                        journals.map((journal, index) => (
                            <tr key={journal.id}>
                                <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                                    {startIndex + index + 1}.
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {journal.judulJurnal}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-500 dark:text-gray-100 uppercase">
                                    {journal.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {journal.deskripsi.substring(0, 50)}{journal.deskripsi.length > 50 ? '...' : ''}
                                </td>
                                <td className="px-6 py-4">
                                    {journal.thumbnailUrl ? (
                                        <img src={journal.thumbnailUrl} alt={journal.judulJurnal} className="h-16 w-28 object-cover rounded-sm" />
                                    ) : (
                                        <div className="h-16 w-16 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                                            Tidak ada gambar
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(journal.createdAt).toLocaleDateString('id-ID', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        <button
                                            onClick={() => onViewDetail(journal)}
                                            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                                            title="Detail"
                                        >
                                            Detail
                                        </button>
                                        {user?.role === 'student' && (
                                            <>
                                                <button
                                                    onClick={() => onEdit(journal)}
                                                    className="px-4 py-2 rounded-md bg-yellow-400 text-white hover:bg-yellow-500"
                                                    title="Edit Jurnal"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => onDelete(journal.id)}
                                                    className="px-4 py-2 bg-red-500 rounded-md text-white hover:bg-red-600"
                                                    title="Hapus Jurnal"
                                                >
                                                    Hapus
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>

                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default JournalTable;
