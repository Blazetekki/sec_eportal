// pages/admin/results.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { Pagination } from '@/components/shared/Pagination';
import { Icons } from '@/components/shared/Icons';
import { DUMMY_DATA } from '@/data/dummyData';
import { AdminResultTable } from '@/components/admin/AdminResultTable';
import styles from './ViewResults.module.css';

// --- Create filter options ---
const CLASS_OPTIONS = [ 'All Classes', 'JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3' ];
const TERM_OPTIONS = [ 'All Terms', 'First Term', 'Second Term', 'Third Term' ];
// Get all unique subjects from the exam bank
const SUBJECT_OPTIONS = [
  'All Subjects',
  ...new Set(DUMMY_DATA.allExamBank.map(e => e.subject))
];
const RESULTS_PER_PAGE = 15;

export default function ViewResultsPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // --- State for filters ---
  const [selectedClass, setSelectedClass] = useState(CLASS_OPTIONS[0]);
  const [selectedTerm, setSelectedTerm] = useState(TERM_OPTIONS[0]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_OPTIONS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // --- Auth Guard ---
  useEffect(() => {
    if (!loading && (!user || user.type !== 'admin')) {
      logout();
      router.push('/login');
    }
  }, [user, loading, router, logout]);

  // --- "Database Join" and Filter Logic ---
  const filteredResults = useMemo(() => {
    // 1. Join the data
    const allResults = DUMMY_DATA.studentResults;
    const allStudents = DUMMY_DATA.allStudents;

    const joinedResults = allResults.map(result => {
      const student = allStudents.find(s => s.id === result.studentId);
      return {
        ...result,
        studentName: student ? student.name : 'Unknown',
        regNo: student ? student.regNo : 'N/A',
      };
    });

    // 2. Filter the joined data
    return joinedResults.filter(result => {
      const classMatch = selectedClass === 'All Classes' || result.class === selectedClass;
      const termMatch = selectedTerm === 'All Terms' || result.term === selectedTerm;
      const subjectMatch = selectedSubject === 'All Subjects' || result.subject === selectedSubject;

      const searchMatch = result.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          result.regNo.toLowerCase().includes(searchTerm.toLowerCase());

      return classMatch && termMatch && subjectMatch && searchMatch;
    });
  }, [selectedClass, selectedTerm, selectedSubject, searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedClass, selectedTerm, selectedSubject, searchTerm]);

  // --- Pagination Logic ---
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    const endIndex = startIndex + RESULTS_PER_PAGE;
    return filteredResults.slice(startIndex, endIndex);
  }, [filteredResults, currentPage]);


  if (loading || !user || user.type !== 'admin') {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        Access Denied. Redirecting...
      </div>
    );
  }

  return (
    <AdminLayout title="View All Results">
      <Card>
        <CardHeader>
          <div className={styles.header}>
            <div className={styles.headerTop}>
              <CardTitle>All Student Results ({filteredResults.length})</CardTitle>
            </div>
            {/* --- Filter Bar --- */}
            <div className={styles.filterBar}>
              <div className={styles.searchInputWrapper}>
                <div className={styles.searchIconWrapper}>
                  <Icons.Search className={styles.searchIcon} />
                </div>
                <input
                  type="text"
                  placeholder="Search by Student Name or Reg. No..."
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
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                className={styles.selectInput}
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
              >
                {TERM_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <select
                className={styles.selectInput}
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {SUBJECT_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AdminResultTable results={paginatedResults} />
          <Pagination
            totalItems={filteredResults.length}
            itemsPerPage={RESULTS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}