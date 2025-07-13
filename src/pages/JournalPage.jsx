import React, { useState, useCallback, useEffect, useMemo } from 'react';
import JournalTable from '../components/journals/JournalTable';
import JournalFormModal from '../components/journals/JournalFormModal';
import JournalDetailModal from '../components/journals/JournalDetailModal';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ToastNotification from '../components/common/ToastNotification';
import journalApi from '../api/journalApi';

const JournalsPage = () => {
  const [journals, setJournals] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentJournal, setCurrentJournal] = useState(null);

  const [filterDate, setFilterDate] = useState('');

  const [loadingJournals, setLoadingJournals] = useState(true);
  const [errorJournals, setErrorJournals] = useState(null);

  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formApiErrors, setFormApiErrors] = useState(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [journalToDelete, setJournalToDelete] = useState(null);

  const [toast, setToast] = useState({ message: '', type: '', id: null });

  const handleCloseModal = useCallback(() => {
    setIsFormModalOpen(false);
    setIsDetailModalOpen(false);
    setIsConfirmModalOpen(false);
    setCurrentJournal(null);
    setJournalToDelete(null);
    setFormApiErrors(null);
  }, []);

  const showToast = useCallback((message, type) => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const handleCloseToast = useCallback(() => {
    setToast({ message: '', type: '', id: null });
  }, []);
  const fetchJournals = useCallback(async () => {
    setLoadingJournals(true);
    setErrorJournals(null);
    try {
      const data = await journalApi.getJournals();
      const mappedJournals = data.map(journal => ({
        id: journal.id,
        judulJurnal: journal.title,
        deskripsi: journal.description,
        thumbnailUrl: journal.image,
        name: journal.name,
        createdAt: `${journal.created_date}T${journal.created_time}Z`,
        updatedAt: `${journal.updated_date ? journal.updated_date + 'T' + journal.updated_time + 'Z' : `${journal.created_date}T${journal.created_time}Z`}`,
      }));
      setJournals(mappedJournals);
    } catch (err) {
      console.error("Error fetching journals:", err.response?.data || err.message);
      setErrorJournals(err);
      showToast(`Error memuat jurnal: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setLoadingJournals(false);
    }
  }, []);

  useEffect(() => {
    fetchJournals();
  }, [fetchJournals]);

  const handleFilterDateChange = useCallback((e) => {
    setFilterDate(e.target.value);
  }, []);

  const filteredJournals = useMemo(() => {
    if (!filterDate) {
      return journals;
    }
    const selectedDateTime = new Date(filterDate).setHours(0, 0, 0, 0);
    return journals.filter(journal => {
      const journalCreationDate = new Date(journal.createdAt).setHours(0, 0, 0, 0);
      return journalCreationDate === selectedDateTime;
    });
  }, [journals, filterDate]);

  const handleAddJournal = useCallback(() => {
    setCurrentJournal(null);
    setIsFormModalOpen(true);
  }, []);

  const handleFormSubmit = useCallback(async (formDataFromModal) => {
    setIsSubmittingForm(true);
    setFormApiErrors(null);
    try {
      let resultJournal;
      if (currentJournal) {
        resultJournal = await journalApi.updateJournal(currentJournal.id, formDataFromModal);
        showToast('Jurnal berhasil diperbarui!', 'success');
      } else {
        resultJournal = await journalApi.storeJournal(formDataFromModal);
        showToast('Jurnal berhasil ditambahkan!', 'success');
      }

      const newOrUpdatedJournal = {
        id: resultJournal.id,
        judulJurnal: resultJournal.title,
        deskripsi: resultJournal.description,
        thumbnailUrl: resultJournal.image
          ? `${resultJournal.image}?updated=${Date.now()}`
          : null,
        name: resultJournal.name,
        createdAt: `${resultJournal.created_date}T${resultJournal.created_time}Z`,
        updatedAt: `${resultJournal.updated_date
            ? resultJournal.updated_date + 'T' + resultJournal.updated_time + 'Z'
            : `${resultJournal.created_date}T${resultJournal.created_time}Z`
          }`,
      };

      if (currentJournal) {
        setJournals((prevJournals) =>
          prevJournals.map((journal) =>
            journal.id === newOrUpdatedJournal.id ? newOrUpdatedJournal : journal
          )
        );
      } else {
        setJournals((prevJournals) => [newOrUpdatedJournal, ...prevJournals]);
      }

      handleCloseModal();
      await fetchJournals();
    } catch (err) {
      console.error('Error submitting form:', err.response?.data || err.message);
      if (err.response && err.response.status === 422 && err.response.data.errors) {
        setFormApiErrors(err.response.data.errors);
        showToast('Validasi gagal. Mohon periksa kembali input Anda.', 'error');
      } else {
        showToast('Terjadi kesalahan saat menyimpan jurnal: ' + (err.response?.data?.message || 'Terjadi kesalahan tidak dikenal.'), 'error');
      }
    } finally {
      setIsSubmittingForm(false);
    }
  }, [currentJournal, handleCloseModal, fetchJournals, showToast]);


  const handleEditJournal = useCallback((journal) => {
    setCurrentJournal({
      id: journal.id,
      judulJurnal: journal.judulJurnal,
      deskripsi: journal.deskripsi,
      thumbnailUrl: journal.thumbnailUrl,
      thumbnailFile: null,
    });
    setIsFormModalOpen(true);
  }, []);

  const handleViewDetail = useCallback((journal) => {
    setCurrentJournal(journal);
    setIsDetailModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((id) => {
    setJournalToDelete(id);
    setIsConfirmModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (journalToDelete) {
      try {
        await journalApi.deleteJournal(journalToDelete);
        setJournals(prevJournals => prevJournals.filter(journal => journal.id !== journalToDelete));
        showToast('Jurnal berhasil dihapus!', 'success');
      } catch (err) {
        console.error("Error deleting journal:", err.response?.data || err.message);
        showToast('Gagal menghapus jurnal: ' + (err.response?.data?.message || 'Terjadi kesalahan tidak dikenal.'), 'error'); // <-- Ganti alert
      } finally {
        handleCloseModal();
      }
    }
  }, [journalToDelete, handleCloseModal, showToast]);


  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
        <div className="flex-grow">
          <button
            onClick={handleAddJournal}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md shadow-md
                                       hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                                       dark:focus:ring-offset-gray-900 w-full sm:w-auto"
          >
            Tambah
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-end gap-3 w-full sm:w-auto">
          <div className="flex-1 w-full sm:w-auto">
            <input
              type="date"
              id="filterDate"
              value={filterDate}
              onChange={handleFilterDateChange}
              className="block w-full rounded-md border-gray-300 dark:border-gray-600
                                         shadow-sm focus:border-red-500 focus:ring-red-500
                                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-2.5"
            />
          </div>
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-sm
                                         hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                                         dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-900 w-full sm:w-auto"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {loadingJournals ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Memuat daftar jurnal...</p>
      ) : errorJournals ? (
        <p className="text-center text-red-600">Error memuat jurnal: {errorJournals.message || 'Terjadi kesalahan.'}</p>
      ) : (
        <JournalTable
          journals={filteredJournals}
          onEdit={handleEditJournal}
          onViewDetail={handleViewDetail}
          onDelete={handleDeleteClick}
        />
      )}

      <JournalFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        initialData={currentJournal}
        isSubmitting={isSubmittingForm}
        apiErrors={formApiErrors}
      />

      <JournalDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
        journal={currentJournal}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Penghapusan"
        message="Apakah Anda yakin ingin menghapus jurnal ini? Tindakan ini tidak bisa dibatalkan."
      />

      <ToastNotification
        key={toast.id}
        message={toast.message}
        type={toast.type}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default JournalsPage;