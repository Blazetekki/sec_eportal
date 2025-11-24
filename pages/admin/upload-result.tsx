// pages/admin/upload-result.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Icons } from '@/components/shared/Icons';
import { DUMMY_DATA } from '@/data/dummyData';
import { StudentRecord, ExamResult } from '@/data/types';
import { ResultEntryTable, ScoreState } from '@/components/admin/ResultEntryTable';
import { getRemark } from '@/utils/helpers';
import styles from './UploadResult.module.css';

// --- Create filter options ---
const CLASS_OPTIONS = [ 'Select Class', 'JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3' ];
const TERM_OPTIONS = [ 'Select Term', 'First Term', 'Second Term', 'Third Term' ];
const SUBJECT_OPTIONS = [
  'Select Subject',
  ...new Set(DUMMY_DATA.allExamBank.map(e => e.subject))
];

export default function UploadResultPage() {
  const { user, loading, logout, showNotification } = useAuth();
  const router = useRouter();

  // --- State for filters ---
  const [selectedClass, setSelectedClass] = useState(CLASS_OPTIONS[0]);
  const [selectedTerm, setSelectedTerm] = useState(TERM_OPTIONS[0]);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_OPTIONS[0]);
  const [searchTerm, setSearchTerm] = useState('');

  // --- State for the table ---
  const [studentsForGrading, setStudentsForGrading] = useState<StudentRecord[]>([]);
  const [allResults, setAllResults] = useState<ExamResult[]>(DUMMY_DATA.studentResults);
  const [scores, setScores] = useState<ScoreState>({});

  // --- Auth Guard ---
  useEffect(() => {
    if (!loading && (!user || user.type !== 'admin')) {
      logout();
      router.push('/login');
    }
  }, [user, loading, router, logout]);

  // --- Main Logic Functions ---
  const handleLoadStudents = () => {
    if (selectedClass === CLASS_OPTIONS[0] ||
        selectedTerm === TERM_OPTIONS[0] ||
        selectedSubject === SUBJECT_OPTIONS[0])
    {
      showNotification('Error', 'Please select a Class, Term, and Subject.', 'error');
      setStudentsForGrading([]);
      return;
    }

    const studentsInClass = DUMMY_DATA.allStudents.filter(
      s => s.class === selectedClass
    );
    setStudentsForGrading(studentsInClass);

    // Pre-load existing scores for this group
    const newScores: ScoreState = {};
    for (const student of studentsInClass) {
      const existingResult = allResults.find(
        r => r.studentId === student.id &&
             r.class === selectedClass &&
             r.term === selectedTerm &&
             r.subject === selectedSubject
      );
      if (existingResult) {
        newScores[student.id] = {
          ca: String(existingResult.ca),
          exam: String(existingResult.exam),
        };
      } else {
        newScores[student.id] = { ca: '', exam: '' };
      }
    }
    setScores(newScores);
  };

  const handleScoreChange = (studentId: string, field: 'ca' | 'exam', value: string) => {
    const numValue = Number(value);
    if (field === 'ca' && (numValue > 40 || numValue < 0)) return;
    if (field === 'exam' && (numValue > 60 || numValue < 0)) return;

    setScores(prevScores => ({
      ...prevScores,
      [studentId]: {
        ...prevScores[studentId],
        [field]: value,
      }
    }));
  };

  const handleSaveRow = (studentId: string) => {
    const student = studentsForGrading.find(s => s.id === studentId);
    if (!student) return;

    const studentScores = scores[studentId];
    if (!studentScores || (studentScores.ca === '' && studentScores.exam === '')) {
      showNotification('Error', 'No scores entered for this student.', 'error');
      return;
    }

    const ca = Number(studentScores.ca) || 0;
    const exam = Number(studentScores.exam) || 0;
    const total = ca + exam;
    const remark = getRemark(total);

    const newResult: ExamResult = {
      id: crypto.randomUUID(),
      studentId: student.id,
      class: selectedClass as ExamResult['class'],
      term: selectedTerm as ExamResult['term'],
      subject: selectedSubject,
      ca,
      exam,
      total,
      remark,
    };

    let updatedResults;
    const existingResultIndex = allResults.findIndex(
      r => r.studentId === student.id &&
           r.class === selectedClass &&
           r.term === selectedTerm &&
           r.subject === selectedSubject
    );

    if (existingResultIndex > -1) {
      newResult.id = allResults[existingResultIndex].id;
      updatedResults = allResults.map((r, index) =>
        index === existingResultIndex ? newResult : r
      );
    } else {
      updatedResults = [...allResults, newResult];
    }

    DUMMY_DATA.studentResults = updatedResults;
    setAllResults(updatedResults);

    showNotification('Success', `Score for ${student.name} has been saved!`, 'success');
  };

  // --- Filter students based on search ---
  const filteredStudents = useMemo(() => {
    return studentsForGrading.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [studentsForGrading, searchTerm]);

  // --- ★★★ THIS IS THE FIX ★★★ ---
  if (loading || !user || user.type !== 'admin') {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        Access Denied. Redirecting...
      </div>
    );
  }
  // --- END OF FIX ---

  return (
    <AdminLayout title="Upload Results">
      <Card>
        <CardHeader>
          <CardTitle>Upload Student Results</CardTitle>
        </CardHeader>
        <CardContent>
          {/* --- Filter Bar --- */}
          <div className={styles.filterBar}>
            <select
              className={styles.selectInput}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {CLASS_OPTIONS.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
            <select
              className={styles.selectInput}
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              {TERM_OPTIONS.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
            <select
              className={styles.selectInput}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              {SUBJECT_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
            <Button
              variant="primary"
              className={styles.loadButton}
              onClick={handleLoadStudents}
            >
              Load Students
            </Button>
          </div>
        </CardContent>
      </Card>

      {studentsForGrading.length > 0 && (
        <Card>
          <CardHeader>
            {/* --- Search Bar --- */}
            <div className={styles.searchWrapper}>
              <div className={styles.searchInputWrapper}>
                <div className={styles.searchIconWrapper}>
                  <Icons.Search className={styles.searchIcon} />
                </div>
                <input
                  type="text"
                  placeholder="Search loaded students by name or Reg. No..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResultEntryTable
              students={filteredStudents}
              scores={scores}
              onScoreChange={handleScoreChange}
              onSaveRow={handleSaveRow}
              getRemark={getRemark}
            />
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}