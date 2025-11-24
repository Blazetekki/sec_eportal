// pages/student/results.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/shared/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { ResultTable } from '@/components/shared/ResultTable';
import { DUMMY_DATA } from '@/data/dummyData';
import styles from './Results.module.css';

// --- UPDATED CLASS OPTIONS ---
const CLASS_OPTIONS = [
  'All Classes',
  'JSS 1',
  'JSS 2',
  'JSS 3',
  'SS 1',
  'SS 2',
  'SS 3',
];
// --- END OF UPDATE ---

const TERM_OPTIONS = ['All Results', 'First Term', 'Second Term', 'Third Term'];

export default function StudentResultsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [selectedClass, setSelectedClass] = useState(CLASS_OPTIONS[0]);
  const [selectedTerm, setSelectedTerm] = useState(TERM_OPTIONS[0]);

  // --- Auth Guard ---
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // --- FILTER LOGIC ---
  const filteredResults = useMemo(() => {
    const allResults = DUMMY_DATA.studentResults;

    return allResults.filter(result => {
      const classMatch = selectedClass === 'All Classes' || result.class === selectedClass;
      const termMatch = selectedTerm === 'All Results' || result.term === selectedTerm;
      return classMatch && termMatch;
    });
  }, [selectedClass, selectedTerm]);

  // --- Loading State ---
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Layout title="My Results">
      <div className={styles.wrapper}>

        {/* --- FILTER BAR --- */}
        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            <label htmlFor="class-filter" className={styles.filterLabel}>
              Class
            </label>
            <select
              id="class-filter"
              className={styles.filterSelect}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {CLASS_OPTIONS.map((c) => ( // This will now include SS 2 and SS 3
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="term-filter" className={styles.filterLabel}>
              Term
            </label>
            <select
              id="term-filter"
              className={styles.filterSelect}
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              {TERM_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        {/* --- END OF FILTER BAR --- */}

        <Card>
          <CardHeader>
            <CardTitle>My Past Results</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredResults.length > 0 ? (
              <ResultTable results={filteredResults} />
            ) : (
              <p>No results found for the selected filters.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}