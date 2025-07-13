import React, { useState, useEffect, useCallback } from 'react';
import studentJournalApi from '../../api/student/journalApi';
import JournalTable from '../../components/journals/JournalTable';
import JournalFormModal from '../../components/journals/JournalFormModal';
import JournalDetailModal from '../../components/journals/JournalDetailModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import ToastNotification from '../../components/common/ToastNotification';

const StudentJournalView = () => {
  const [journals, setJournals] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await studentJournalApi.getJournals();
      setJournals(data);
    } catch {
      setToast({ message: 'Gagal memuat jurnal.', type: 'error' });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (formData) => {
    try {
      if (selected) {
        await studentJournalApi.updateJournal(selected.id, formData);
        setToast({ message: 'Jurnal berhasil diperbarui.', type: 'success' });
      } else {
        await studentJournalApi.storeJournal(formData);
        setToast({ message: 'Jurnal berhasil ditambahkan.', type: 'success' });
      }
      setIsFormOpen(false);
      fetchData();
    } catch (err) {
      setToast({ message: 'Gagal menyimpan jurnal.', type: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      await studentJournalApi.deleteJournal(selected.id);
      setToast({ message: 'Jurnal dihapus.', type: 'success' });
      setIsConfirmOpen(false);
      fetchData();
    } catch {
      setToast({ message: 'Gagal menghapus jurnal.', type: 'error' });
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Jurnal Saya</h2>
        <button onClick={() => { setSelected(null); setIsFormOpen(true); }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Tambah
        </button>
      </div>

      <JournalTable
        journals={journals}
        onEdit={(j) => { setSelected(j); setIsFormOpen(true); }}
        onViewDetail={(j) => { setSelected(j); setIsDetailOpen(true); }}
        onDelete={(j) => { setSelected(j); setIsConfirmOpen(true); }}
      />

      <JournalFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={selected}
      />

      <JournalDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        journal={selected}
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Jurnal"
        message="Yakin ingin menghapus jurnal ini?"
      />

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

export default StudentJournalView;
