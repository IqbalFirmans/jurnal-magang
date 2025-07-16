import React, { useEffect, useState, useMemo, useCallback } from 'react';
import journalApi from '../../api/journalApi';
import JournalTable from '../../components/journals/JournalTable';
import ToastNotification from '../../components/common/ToastNotification';
import JournalDetailModal from '../../components/journals/JournalDetailModal';
import ExportModal from '../../components/journals/ExportJournalModal';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import InputField from '../../components/common/InputField';

const TeacherJournalView = () => {
  const [journals, setJournals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', id: null });
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [currentJournal, setCurrentJournal] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const showToast = useCallback((message, type) => {
    setToast({ message, type, id: Date.now() });
  }, []);

  useEffect(() => {
    const fetchJournals = async () => {
      setLoading(true);
      try {
        const data = await journalApi.getJournalTodayByTeacher();
        const mapped = data.map(j => ({
          id: j.id,
          judulJurnal: j.title,
          deskripsi: j.description,
          thumbnailUrl: j.image,
          name: j.name,
          createdAt: `${j.created_date}T${j.created_time}Z`,
          updatedAt: `${j.updated_date ?? j.created_date}T${j.updated_time ?? j.created_time}Z`,
        }));
        setJournals(mapped);
      } catch (err) {
        showToast('Gagal memuat jurnal.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchJournals();
  }, [showToast]);

  const filtered = useMemo(() => {
    if (!searchTerm) return journals;
    return journals.filter(j =>
      j.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [journals, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  const handleViewDetail = useCallback((journal) => {
    setCurrentJournal(journal);
    setIsDetailModalOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailModalOpen(false);
    setCurrentJournal(null);
  }, []);

  const handleExportPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text(`Laporan Jurnal Bulan ${selectedMonth}`, 14, 20);

    const filteredByMonth = journals.filter(journal =>
      new Date(journal.createdAt).toISOString().startsWith(selectedMonth)
    );

    autoTable(pdf, {
      head: [['No', 'Nama Siswa', 'Judul', 'Deskripsi', 'Tanggal']],
      body: filteredByMonth.map((j, i) => [
        i + 1,
        j.name,
        j.judulJurnal,
        j.deskripsi,
        new Date(j.createdAt).toLocaleDateString(),
      ]),
      startY: 30,
    });

    pdf.save(`jurnal-${selectedMonth}.pdf`);
    setIsExportModalOpen(false);
  };

  return (
    <div className="p-4">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
        <h4 className="text-black dark:text-white font-semibold">
          Daftar Jurnal Siswa
        </h4>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <InputField
            type="text"
            placeholder="Cari nama siswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md shadow-sm
                         hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
                         dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-900 w-full sm:w-auto"
            >
              Reset
            </button>
          )}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Export PDF
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Memuat jurnal...</p>
      ) : (
        <>
          <JournalTable
            journals={paginated}
            onEdit={null}
            onDelete={null}
            onViewDetail={handleViewDetail}
            startIndex={(currentPage - 1) * itemsPerPage}
          />

          {filtered.length > itemsPerPage && (
            <div className="flex justify-end mt-4 gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span className="px-4 py-2 text-gray-700 dark:text-gray-200">
                Page {currentPage} of {Math.ceil(filtered.length / itemsPerPage)}
              </span>
              <button
                disabled={currentPage >= Math.ceil(filtered.length / itemsPerPage)}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <JournalDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        journal={currentJournal}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportPDF}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      <ToastNotification
        key={toast.id}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: '', id: null })}
      />
    </div>
  );
};

export default TeacherJournalView;
