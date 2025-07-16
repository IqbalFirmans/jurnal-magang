import React, { useState, useCallback, useEffect, useMemo } from 'react';
import JournalFormModal from '../../components/journals/JournalFormModal';
import JournalDetailModal from '../../components/journals/JournalDetailModal';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import ToastNotification from '../../components/common/ToastNotification';
import journalApi from '../../api/journalApi';
import JournalTable from '../../components/journals/JournalTable';
import { useAuthStore } from '../../store/authStore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExportModal from '../../components/journals/ExportJournalModal';

const StudentJournalView = () => {
  const [journals, setJournals] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const [currentJournal, setCurrentJournal] = useState(null);
  const [journalToDelete, setJournalToDelete] = useState(null);
  const [formApiErrors, setFormApiErrors] = useState(null);

  const [toast, setToast] = useState({ message: '', type: '', id: null });
  const [filterDate, setFilterDate] = useState('');
  const [selectedExportMonth, setSelectedExportMonth] = useState('');
  const [loadingJournals, setLoadingJournals] = useState(true);
  const [errorJournals, setErrorJournals] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const user = useAuthStore((state) => state.user);

  const handleCloseModal = useCallback(() => {
    setIsFormModalOpen(false);
    setIsDetailModalOpen(false);
    setIsConfirmModalOpen(false);
    setIsExportModalOpen(false);
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
        student_id: journal.student_id,
        createdAt: `${journal.created_date}T${journal.created_time}Z`,
        updatedAt: `${journal.updated_date ? journal.updated_date + 'T' + journal.updated_time + 'Z' : `${journal.created_date}T${journal.created_time}Z`}`,
      }));
      setJournals(mappedJournals);
    } catch (err) {
      setErrorJournals(err);
      showToast(`Error memuat jurnal: ${err.message}`, 'error');
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
    if (!filterDate) return journals;
    const selected = new Date(filterDate).setHours(0, 0, 0, 0);
    return journals.filter(j =>
      new Date(j.createdAt).setHours(0, 0, 0, 0) === selected
    );
  }, [journals, filterDate]);

  const paginatedJournals = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredJournals.slice(start, start + itemsPerPage);
  }, [filteredJournals, currentPage]);

  const handleAddJournal = () => {
    setCurrentJournal(null);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmittingForm(true);
    setFormApiErrors(null);
    try {
      let result;
      if (currentJournal) {
        result = await journalApi.updateJournal(currentJournal.id, formData);
        showToast('Jurnal diperbarui!', 'success');
      } else {
        result = await journalApi.storeJournal(formData);
        showToast('Jurnal ditambahkan!', 'success');
      }
      handleCloseModal();
      fetchJournals();
    } catch (err) {
      if (err.response?.status === 422) {
        setFormApiErrors(err.response.data.errors);
        showToast('Validasi gagal atau anda sudah manambah jurnal hari ini', 'error');
      } else {
        showToast('Gagal menyimpan jurnal.', 'error');
      }
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleExportPDF = async () => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text(`Laporan Jurnal Bulan ${selectedExportMonth}`, 14, 20);

    const filtered = journals.filter(journal => {
      const date = new Date(journal.createdAt);
      return date.toISOString().startsWith(selectedExportMonth);
    });

    const tableData = await Promise.all(
      filtered.map(async (j, idx) => {
        return [
          idx + 1,
          j.name || '-',
          j.judulJurnal,
          j.deskripsi,
          new Date(j.createdAt).toLocaleDateString()
        ];
      })
    );

    autoTable(pdf, {
      head: [['No', 'Nama', 'Judul', 'Deskripsi', 'Tanggal']],
      body: tableData.map(row => [
        row[0], row[1], row[2], row[3], row[4],
      ]),
      startY: 30,
    });

    pdf.save(`jurnal-${selectedExportMonth}.pdf`);
    handleCloseModal();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
        <div className="flex gap-2">

          <button onClick={handleAddJournal} className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md shadow hover:bg-red-700">
            Tambah
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Export PDF
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={filterDate}
            onChange={handleFilterDateChange}
            className="border p-2 rounded dark:bg-gray-700 dark:text-white"
          />
          {filterDate && (
            <button onClick={() => setFilterDate('')} className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-sm
                                       hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                                       dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-900 w-full sm:w-auto">
              Reset
            </button>
          )}

        </div>
      </div>

      {loadingJournals ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Memuat daftar jurnal...</p>
      ) : (
        <JournalTable
          journals={paginatedJournals}
          onEdit={j => { setCurrentJournal(j); setIsFormModalOpen(true); }}
          onViewDetail={j => { setCurrentJournal(j); setIsDetailModalOpen(true); }}
          onDelete={id => { setJournalToDelete(id); setIsConfirmModalOpen(true); }}
          startIndex={(currentPage - 1) * itemsPerPage}
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
        onConfirm={async () => {
          try {
            await journalApi.deleteJournal(journalToDelete);
            setJournals(prev => prev.filter(j => j.id !== journalToDelete));
            showToast('Jurnal berhasil dihapus', 'success');
          } catch (err) {
            showToast('Gagal hapus jurnal', 'error');
          } finally {
            handleCloseModal();
          }
        }}
        title="Konfirmasi Penghapusan"
        message="Yakin ingin menghapus jurnal ini?"
      />

      {isExportModalOpen && (
        <ExportModal
          isOpen={isExportModalOpen}
          onClose={handleCloseModal}
          onExport={handleExportPDF}
          selectedMonth={selectedExportMonth}
          setSelectedMonth={setSelectedExportMonth}
        />

      )}

      <ToastNotification
        key={toast.id}
        message={toast.message}
        type={toast.type}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default StudentJournalView;
