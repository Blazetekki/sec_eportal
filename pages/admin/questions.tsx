// pages/admin/questions.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { ExamTable } from '@/components/admin/ExamTable';
import { ExamModal } from '@/components/admin/ExamModal';
import { DeleteModal } from '@/components/admin/DeleteModal';
import { Pagination } from '@/components/shared/Pagination';
import { Icons } from '@/components/shared/Icons';
import { Exam } from '@/data/types';
import styles from './Questions.module.css';

const CLASS_OPTIONS = [
  'All Classes', 'JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3'
];
const EXAMS_PER_PAGE = 10;

export default function ExamBankPage() {
  const { user, loading, logout, showNotification, allExams, setAllExams } = useAuth();
  const router = useRouter();

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const [selectedClass, setSelectedClass] = useState(CLASS_OPTIONS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // --- Auth Guard ---
  useEffect(() => {
    if (!loading && (!user || user.type !== 'admin')) {
      logout();
      router.push('/login');
    }
  }, [user, loading, router, logout]);

  // --- Filter Logic ---
  const filteredExams = useMemo(() => {
    return allExams.filter(exam => {
      const classMatch = selectedClass === 'All Classes' || exam.class === selectedClass;
      const searchMatch = exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
      return classMatch && searchMatch;
    });
  }, [allExams, selectedClass, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClass, searchTerm]);

  // --- Pagination Logic ---
  const paginatedExams = useMemo(() => {
    const startIndex = (currentPage - 1) * EXAMS_PER_PAGE;
    const endIndex = startIndex + EXAMS_PER_PAGE;
    return filteredExams.slice(startIndex, endIndex);
  }, [filteredExams, currentPage]);

  if (loading || !user || user.type !== 'admin') {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        Access Denied. Redirecting...
      </div>
    );
  }

  // --- Modal Control ---
  const openAddModal = () => {
    setSelectedExam(null);
    setIsAddEditModalOpen(true);
  };
  const openEditModal = (exam: Exam) => {
    setSelectedExam(exam);
    setIsAddEditModalOpen(true);
  };
  const openDeleteModal = (exam: Exam) => {
    setSelectedExam(exam);
    setIsDeleteModalOpen(true);
  };
  const closeModal = () => {
    setIsAddEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedExam(null);
  };

  // --- CRUD Functions ---
  const handleAddExam = (newExam: Exam) => {
    setAllExams(prevExams => [newExam, ...prevExams]);
    showNotification('Success', `${newExam.subject} has been created.`, 'success');
  };

  const handleEditExam = (updatedExam: Exam) => {
    setAllExams(prevExams =>
      prevExams.map(e => e.id === updatedExam.id ? updatedExam : e)
    );
    showNotification('Success', `${updatedExam.subject} has been updated.`, 'success');
  };

  const handleDeleteExam = () => {
    if (!selectedExam) return;
    setAllExams(prevExams =>
      prevExams.filter(e => e.id !== selectedExam.id)
    );
    showNotification('Success', `${selectedExam.subject} has been deleted.`, 'success');
    closeModal();
  };

  const handleStatusChange = (exam: Exam, isPublished: boolean) => {
    const newStatus = isPublished ? 'Published' : 'Draft';
    const updatedExam = { ...exam, status: newStatus };

    setAllExams(prevExams =>
      prevExams.map(e => e.id === updatedExam.id ? updatedExam : e)
    );

    showNotification(
      'Status Updated',
      `${exam.subject} is now ${newStatus}.`,
      'success'
    );
  };

  return (
    <AdminLayout title="Exam Bank">
      <Card>
        <CardHeader>
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <CardTitle>Exam Bank ({filteredExams.length})</CardTitle>
              <Button
                variant="primary"
                className={styles.addButton}
                onClick={openAddModal}
              >
                <Icons.Plus className={styles.addButtonIcon} />
                Add New Exam
              </Button>
            </div>
            <div className={styles.filterBar}>
              <div className={styles.searchInputWrapper}>
                <div className={styles.searchIconWrapper}>
                  <Icons.Search className={styles.searchIcon} />
                </div>
                <input
                  type="text"
                  placeholder="Search by subject..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className={styles.selectInput}
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                {CLASS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ExamTable
            exams={paginatedExams}
            onEditExam={openEditModal}
            onDeleteExam={openDeleteModal}
            onStatusChange={handleStatusChange} // <-- ★★★ THIS WAS THE MISSING LINE ★★★
          />
          <Pagination
            totalItems={filteredExams.length}
            itemsPerPage={EXAMS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* --- Add/Edit Modal --- */}
      <Modal
        isOpen={isAddEditModalOpen}
        onClose={closeModal}
        title={selectedExam ? 'Edit Exam' : 'Add New Exam'}
      >
        <ExamModal
          onClose={closeModal}
          onAddExam={handleAddExam}
          onEditExam={handleEditExam}
          examToEdit={selectedExam}
        />
      </Modal>

      {/* --- Delete Modal --- */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        title="Confirm Deletion"
      >
        {selectedExam && (
          <DeleteModal
            studentName={selectedExam.subject} // We reuse this, just passing in the subject
            onClose={closeModal}
            onConfirm={handleDeleteExam}
          />
        )}
      </Modal>
    </AdminLayout>
  );
}