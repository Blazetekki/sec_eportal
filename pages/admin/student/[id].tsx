// pages/admin/student/[id].tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { ResultTable } from '@/components/shared/ResultTable';
import { Icons } from '@/components/shared/Icons';
import { DUMMY_DATA } from '@/data/dummyData';
import { StudentRecord, ExamResult, Achievement } from '@/data/types';
import styles from './StudentProfile.module.css';

const CLASS_OPTIONS = [ 'All Classes', 'JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3' ];
const TERM_OPTIONS = [ 'All Results', 'First Term', 'Second Term', 'Third Term' ];

// --- NEW: Color array for achievements ---
const COLOR_VARIANTS = [styles.itemGreen, styles.itemBlue, styles.itemOrange];

// Helper component for the Profile section
const DetailItem = ({ label, value }: { label: string; value?: string }) => (
  <div className={styles.detailItem}>
    <h4 className={styles.detailLabel}>{label}</h4>
    <p className={styles.detailValue}>{value || 'N/A'}</p>
  </div>
);

export default function StudentProfilePage() {
  const router = useRouter();
  const { id } = router.query;

  // --- State for this page ---
  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedClass, setSelectedClass] = useState(CLASS_OPTIONS[0]);
  const [selectedTerm, setSelectedTerm] = useState(TERM_OPTIONS[0]);

  // --- Data Fetching (Simulated) ---
  useEffect(() => {
    if (id) {
      // 1. Fetch Student Profile
      const foundStudent = DUMMY_DATA.allStudents.find(s => s.id === id);
      setStudent(foundStudent || null);

      // 2. Fetch Student Results (we filter by student regNo, not ID, for this dummy data)
      const foundResults = DUMMY_DATA.studentResults;
      setResults(foundResults);

      // 3. Fetch Student Achievements
      const foundAchievements = DUMMY_DATA.allAchievements.filter(a => a.studentId === id);
      setAchievements(foundAchievements);
    }
  }, [id]);

  // --- Filter Logic for Results ---
  const filteredResults = useMemo(() => {
    return results.filter(result => {
      const classMatch = selectedClass === 'All Classes' || result.class === selectedClass;
      const termMatch = selectedTerm === 'All Results' || result.term === selectedTerm;
      return classMatch && termMatch;
    });
  }, [results, selectedClass, selectedTerm]);

  if (!student) {
    return (
      <AdminLayout title="Loading...">
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          Loading student profile...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Profile: ${student.name}`}>
      <div className={styles.pageWrapper}>

        {/* --- Section 1: Profile --- */}
        <div className={styles.profileCard}>
          <Card>
            <CardContent className={styles.profileContent}>
              <img
                src={student.photo || 'https://placehold.co/100x100/F0FDF4/15803D?text=N/A'}
                alt={student.name}
                className={styles.profileImage}
              />
              <h2 className={styles.profileName}>{student.name}</h2>
              <div className={styles.detailList}>
                <DetailItem label="Registration No." value={student.regNo} />
                <DetailItem label="Current Class" value={student.class} />
                <DetailItem label="Parent's Phone" value={student.parentPhone} />
                <DetailItem label="Home Address" value={student.address} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- Sections 2 & 3: Main Content --- */}
        <div className={styles.mainContent}>

          {/* --- Section 2: Results --- */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.filterBar}>
                <div className={styles.filterGroup}>
                  <label htmlFor="class-filter" className={styles.filterLabel}>Class</label>
                  <select
                    id="class-filter"
                    className={styles.filterSelect}
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    {CLASS_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.filterGroup}>
                  <label htmlFor="term-filter" className={styles.filterLabel}>Term</label>
                  <select
                    id="term-filter"
                    className={styles.filterSelect}
                    value={selectedTerm}
                    onChange={(e) => setSelectedTerm(e.target.value)} // <-- PROACTIVE BUG FIX (was e.g.value)
                  >
                    {TERM_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.resultsTableContainer}>
                {filteredResults.length > 0 ? (
                  <ResultTable results={filteredResults} />
                ) : (
                  <p style={{textAlign: 'center', padding: '1rem'}}>No results found for these filters.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* --- Section 3: Achievements --- */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements & Awards</CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? (
                // --- THIS IS THE UPDATE ---
                <ul className={styles.achievementList}>
                  {achievements.map((ach, index) => {
                    // Get a repeating color based on the index
                    const colorClass = COLOR_VARIANTS[index % COLOR_VARIANTS.length];
                    return (
                      <li key={ach.id} className={`${styles.achievementItem} ${colorClass}`}>
                        <Icons.Award className={styles.achievementIcon} />
                        <div>
                          <p className={styles.achievementAward}>{ach.award}</p>
                          <p className={styles.achievementDate}>
                            Awarded on: {new Date(ach.date).toLocaleDateString()}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                // --- END OF UPDATE ---
              ) : (
                <p>No achievements recorded for this student.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}