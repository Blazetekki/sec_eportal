// pages/student/dashboard.tsx
import React, { useEffect, useState, useMemo } from 'react'; // Import useMemo
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext'; // Import the new context
import { ProfileCard } from '@/components/shared/ProfileCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Student, Exam, ExamResult } from '@/data/types';
import { Layout } from '@/components/shared/Layout';
import { DUMMY_DATA } from '@/data/dummyData';
import { Icons } from '@/components/shared/Icons';

// --- INLINE STYLES (from our previous step) ---
const pageStyles = {
  wrapper: {
    maxWidth: '64rem',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem',
  },
  profileColumn: {
    gridColumn: 'span 1',
  },
  mainColumn: {
    gridColumn: 'span 1',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  examCardContent: {
    textAlign: 'center' as 'center',
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  icon: {
    width: '2.5rem', // 40px
    height: '2.5rem', // 40px
    color: '#15803d', // Updated to green theme
  },
  examTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
  },
  examSubtitle: {
    color: '#6b7280',
    marginBottom: '1.5rem',
    lineHeight: 1.6,
  },
  idleMessage: {
    fontSize: '1.125rem',
    color: '#111827',
    fontWeight: 500,
    textAlign: 'center' as 'center',
    marginBottom: '1rem',
  },
  actions: {
    gridTemplateColumns: '1fr',
  },
  statsContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    gap: '1rem',
  },
  statBox: {
    backgroundColor: '#f9fafb',
    padding: '1rem',
    borderRadius: '0.75rem',
    border: '1px solid #f3f4f6',
  },
  statTitle: {
    fontSize: '0.875rem',
    fontWeight: 500,
    color: '#6b7280',
    marginBottom: '0.25rem',
  },
  statValue: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#15803d', // Updated to green theme
  },
};
// --- END OF STYLES ---

export default function StudentDashboard() {
  // --- UPDATED TO USE GLOBAL "liveExams" (plural) ---
  const { user, loading, logout, liveExams } = useAuth();
  const router = useRouter();

  const [dataLoaded, setDataLoaded] = useState(false);
  const [lastResult, setLastResult] = useState<ExamResult | null>(null);
  const [totalExams, setTotalExams] = useState(0);

  // --- Auth Guard ---
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // --- UPDATED: This no longer SETS the live exam (admin does) ---
  // It just fetches the student's personal stats
  useEffect(() => {
    if (user && user.type === 'student') {
      // Get Quick Stats (for Idle Mode)
      const allResults = DUMMY_DATA.studentResults;
      if (allResults.length > 0) {
        setLastResult(allResults[allResults.length - 1]);
        setTotalExams(allResults.length);
      }
      setDataLoaded(true);
    }
  }, [user]); // Removed setLiveExam from dependency array

  // --- NEW LOGIC: Filter live exams for this student's class ---
  const myLiveExams = useMemo(() => {
    if (!user || user.type !== 'student') return [];
    const studentClass = (user as Student).class;

    // In a real app, this would also check the exemption list
    // that the admin set in the "GoLiveModal".
    return liveExams.filter(exam => exam.class === studentClass);
  }, [liveExams, user]);
  // --- END OF NEW LOGIC ---

  // --- Loading States ---
  if (loading || !dataLoaded || !user || user.type !== 'student') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Loading...
      </div>
    );
  }

  const studentUser = user as Student;

  const handleStartExam = (exam: Exam) => { // Now takes the exam to start
    router.push(`/student/take-exam?id=${exam.id}`);
  };

  // --- RENDER "EXAM MODE" (Now renders a LIST of exams) ---
  if (myLiveExams.length > 0) {
    return (
      <Layout title="Exam Ready">
        <div style={pageStyles.wrapper as React.CSSProperties}>
          <div style={pageStyles.profileColumn}>
            <ProfileCard user={studentUser} onLogout={logout} />
          </div>
          <div style={pageStyles.mainColumn}>

            {/* --- NEW: Map over all live exams for this student --- */}
            {myLiveExams.map(exam => (
              <Card key={exam.id}>
                <CardHeader>
                  <CardTitle>Exam is Now Live</CardTitle>
                </CardHeader>
                <CardContent style={pageStyles.examCardContent}>
                  <div style={pageStyles.iconWrapper}>
                    <Icons.Clipboard style={pageStyles.icon} />
                  </div>
                  <h2 style={pageStyles.examTitle}>
                    {exam.subject}
                  </h2>
                  <p style={pageStyles.examSubtitle}>
                    Your exam is ready to begin. You will have {exam.durationMinutes} minutes.
                    <br />
                    You cannot pause or leave once you start.
                  </p>
                  <Button variant="primary" onClick={() => handleStartExam(exam)}>
                    START EXAM NOW
                  </Button>
                </CardContent>
              </Card>
            ))}
            {/* --- END OF MAP --- */}

          </div>
        </div>
      </Layout>
    );
  }

  // --- RENDER "IDLE MODE" (Reads from global liveExam) ---
  return (
    <Layout title="Student Dashboard">
      <div style={pageStyles.wrapper as React.CSSProperties}>
        <div style={pageStyles.profileColumn}>
          <ProfileCard user={studentUser} onLogout={logout} />
        </div>
        <div style={pageStyles.mainColumn}>

          <Card>
            <CardHeader>
              <CardTitle>Welcome, {studentUser.name}!</CardTitle>
            </CardHeader>
            <CardContent>
              <p style={pageStyles.idleMessage}>
                No exams are currently active.
              </p>
              <div style={pageStyles.actions}>
                <Link href="/student/results" passHref legacyBehavior>
                  <a className="w-full">
                    <Button variant="secondary" className="w-full">
                      View My Past Results
                    </Button>
                  </a>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              {lastResult ? (
                <div style={pageStyles.statsContainer}>
                  <div style={pageStyles.statBox}>
                    <h3 style={pageStyles.statTitle}>Most Recent Score</h3>
                    <p style={pageStyles.statValue}>
                      {lastResult.total}% <span style={{fontSize: '1rem', color: '#6b7280'}}>in {lastResult.subject}</span>
                    </p>
                  </div>
                  <div style={pageStyles.statBox}>
                    <h3 style={pageStyles.statTitle}>Total Exams Taken</h3>
                    <p style={pageStyles.statValue}>
                      {totalExams}
                    </p>
                  </div>
                </div>
              ) : (
                <p>No results found yet.</p>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </Layout>
  );
}