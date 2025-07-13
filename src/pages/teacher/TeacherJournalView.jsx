import React, { useEffect, useState } from 'react';
import teacherJournalApi from '../../api/teacher/journalApi';
import JournalTable from '../../components/journals/JournalTable';
import ToastNotification from '../../components/common/ToastNotification';

const TeacherJournalView = () => {
  const [journals, setJournals] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const data = await teacherJournalApi.getMonitoredJournals();
        setJournals(data);
      } catch (error) {
        setToast({ message: 'Gagal memuat jurnal siswa.', type: 'error' });
      }
    };
    fetchJournals();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Jurnal Siswa Bimbingan</h2>
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

export default TeacherJournalView;
