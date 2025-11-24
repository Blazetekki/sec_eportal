// pages/admin/students.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { StudentTable } from '@/components/admin/StudentTable';
import { StudentModal } from '@/components/admin/StudentModal';
import { DeleteModal } from '@/components/admin/DeleteModal';
import { Pagination } from '@/components/shared/Pagination';
import { Icons } from '@/components/shared/Icons';
import { DUMMY_DATA } from '@/data/dummyData';
import { StudentRecord } from '@/data/types';
import styles from './Students.module.css';

const CLASS_OPTIONS = [
  'All Classes', 'JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3'
];
const STUDENTS_PER_PAGE = 10;

export default function ManageStudentsPage() {
  const { user, loading, logout, showNotification } = useAuth();
  const router = useRouter();

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);
  const [students, setStudents] = useState<StudentRecord[]>(DUMMY_DATA.allStudents);
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
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const classMatch = selectedClass === 'All Classes' || student.class === selectedClass;
      const searchMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.regNo.toLowerCase().includes(searchTerm.toLowerCase());
      return classMatch && searchMatch;
    });
  }, [students, selectedClass, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClass, searchTerm]);

  // --- Pagination Logic ---
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * STUDENTS_PER_PAGE;
    const endIndex = startIndex + STUDENTS_PER_PAGE;
    return filteredStudents.slice(startIndex, endIndex);
  }, [filteredStudents, currentPage]);


  if (loading || !user || user.type !== 'admin') {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        Access Denied. Redirecting...
      </div>
    );
  }

  // --- CRUD Functions ---
  const openAddModal = () => {
    setSelectedStudent(null);
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (student: StudentRecord) => {
    setSelectedStudent(student);
    setIsAddEditModalOpen(true);
  };

  const openDeleteModal = (student: StudentRecord) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const closeModal = () => {
    setIsAddEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedStudent(null);
  };

  const handleAddStudent = (newStudent: StudentRecord) => {
    setStudents([newStudent, ...students]);
    showNotification('Success', `${newStudent.name} has been added.`, 'success');
  };

  const handleEditStudent = (updatedStudent: StudentRecord) => {
    setStudents(students.map(s =>
      s.id === updatedStudent.id ? updatedStudent : s
    ));
    showNotification('Success', `${updatedStudent.name} has been updated.`, 'success');
  };

  const handleDeleteStudent = () => {
    if (!selectedStudent) return;
    setStudents(students.filter(s => s.id !== selectedStudent.id));
    showNotification('Success', `${selectedStudent.name} has been deleted.`, 'success');
    closeModal();
  };
  // --- END OF FUNCTIONS ---

  return (
    <AdminLayout title="Manage Students">
      <Card>
        <CardHeader>
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <CardTitle>Student List ({filteredStudents.length})</CardTitle>
              <Button
                variant="primary"
                className={styles.addButton}
                onClick={openAddModal}
              >
                <Icons.Plus className={styles.addButtonIcon} />
                Add New Student
              </Button>
            </div>
            <div className={styles.filterBar}>
              <div className={styles.searchInputWrapper}>
                <div className={styles.searchIconWrapper}>
                  <Icons.Search className={styles.searchIcon} />
                </div>
                {/* --- THIS IS THE FIX --- */}
                <input
                  type="text"
                  placeholder="Search by name or Reg. No..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* --- END OF FIX --- */}
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
          <StudentTable
            students={paginatedStudents}
            onEditStudent={openEditModal}
            onDeleteStudent={openDeleteModal}
          />
          <Pagination
            totalItems={filteredStudents.length}
            itemsPerPage={STUDENTS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <Modal
        isOpen={isAddEditModalOpen}
        onClose={closeModal}
        title={selectedStudent ? 'Edit Student' : 'Add New Student'}
      >
        <StudentModal
          onClose={closeModal}
          onAddStudent={handleAddStudent}
          onEditStudent={handleEditStudent}
          studentToEdit={selectedStudent}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        title="Confirm Deletion"
      >
        {selectedStudent && (
          <DeleteModal
            studentName={selectedStudent.name}
            onClose={closeModal}
            onConfirm={handleDeleteStudent}
          />
        )}
      </Modal>
    </AdminLayout>
  );
}