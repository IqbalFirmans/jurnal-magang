import React, { useEffect, useState } from 'react';
import adminJournalApi from '../../api/admin/journalApi';
import JournalTable from '../../components/journals/JournalTable';
import ToastNotification from '../../components/common/ToastNotification';

const AdminJournalView = () => {
  const [journals, setJournals] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const data = await adminJournalApi.getAllJournals();
        setJournals(data);
      } catch (error) {
        setToast({ message: 'Gagal memuat data jurnal.', type: 'error' });
      }
    };
    fetchJournals();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Daftar Semua Jurnal</h2>
      <JournalTable journals={journals} />
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdminJournalView;
