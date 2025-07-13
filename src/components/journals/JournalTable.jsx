import React from 'react';

const JournalTable = ({ journals, onEdit, onViewDetail, onDelete }) => {
    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-md shadow">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Judul Jurnal
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Deskripsi
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Bukti
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Tanggal Dibuat
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Aksi
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {journals.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center dark:text-gray-400">
                                Belum ada jurnal yang tersedia.
                            </td>
                        </tr>
                    ) : (
                        journals.map((journal) => (
                            <tr key={journal.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {journal.judulJurnal}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {journal.deskripsi.substring(0, 50)}{journal.deskripsi.length > 50 ? '...' : ''}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {journal.thumbnailUrl ? (
                                        <img
                                             key={journal.thumbnailUrl}
                                            src={journal.thumbnailUrl}
                                            alt={journal.judulJurnal}
                                            className="h-16 w-28 object-cover rounded-sm"
                                        />
                                    ) : (
                                        <div className="h-16 w-16 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                                            Tidak ada gambar
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(journal.createdAt).toLocaleDateString('id-ID', {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => onViewDetail(journal)}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-600 mr-3"
                                        title="Lihat Detail">
                                        Lihat
                                    </button>
                                    <button
                                        onClick={() => onEdit(journal)}
                                        className="text-yellow-400 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-400 mr-3"
                                        title="Edit Jurnal">
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(journal.id)}
                                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-600"
                                        title="Hapus Jurnal">
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

export default JournalTable;