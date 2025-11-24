// pages/admin/dashboard.tsx
import React, { useState, useEffect } from 'react'; // <-- 1. IMPORT useState, useEffect
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { StatCard } from '@/components/admin/StatCard';
import { LiveExamControl } from '@/components/admin/LiveExamControl';
import { Modal } from '@/components/shared/Modal'; // <-- 2. IMPORT MODAL
import { GoLiveModal } from '@/components/admin/GoLiveModal'; // <-- 3. IMPORT GOLIVEMODAL
import { Icons } from '@/components/shared/Icons';
import { DUMMY_DATA } from '@/data/dummyData';
import { Exam } from '@/data/types'; // <-- 4. IMPORT EXAM
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // --- 5. NEW STATE FOR THE MODAL ---
  const [isGoLiveModalOpen, setIsGoLiveModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  // --- END NEW STATE ---

  // --- Auth Guard ---
  useEffect(() => {
    if (!loading && (!user || user.type !== 'admin')) {
      logout();
      router.push('/login');
    }
  }, [user, loading, router, logout]);

  if (loading || !user || user.type !== 'admin') {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        Access Denied. Redirecting...
      </div>
    );
  }

  // --- 6. NEW MODAL HANDLERS ---
  const openGoLiveModal = (exam: Exam) => {
    setSelectedExam(exam);
    setIsGoLiveModalOpen(true);
  };
  const closeGoLiveModal = () => {
    setSelectedExam(null);
    setIsGoLiveModalOpen(false);
  };
  // --- END NEW HANDLERS ---

  const totalStudents = DUMMY_DATA.allStudents.length;
  const totalExams = DUMMY_DATA.allExamBank.length;
  const totalResults = DUMMY_DATA.studentResults.length;

  return (
    <AdminLayout title="Dashboard">
      <div className={styles.wrapper}>
        {/* --- Quick Stats Section --- */}
        <div className={styles.statsGrid}>
          <StatCard
            title="Total Students"
            value={totalStudents.toString()}
            icon={<Icons.UsersGroup />}
            color="orange"
          />
          <StatCard
            title="Exam Bank"
            value={totalExams.toString()}
            icon={<Icons.AcademicCap />}
            color="blue"
          />
          <StatCard
            title="Results Graded"
            value={totalResults.toString()}
            icon={<Icons.ClipboardList />}
            color="green"
          />
        </div>

        {/* --- "Go Live" Control Panel --- */}
        <Card>
          <CardHeader>
            <CardTitle>Live Exam Control Center</CardTitle>
          </CardHeader>
          <CardContent>
            {/* --- 7. PASS THE NEW HANDLER --- */}
            <LiveExamControl onGoLive={openGoLiveModal} />
          </CardContent>
        </Card>
      </div>

      {/* --- 8. RENDER THE NEW MODAL --- */}
      <Modal
        isOpen={isGoLiveModalOpen}
        onClose={closeGoLiveModal}
        title="Publish Exam"
      >
        {selectedExam && (
          <GoLiveModal exam={selectedExam} onClose={closeGoLiveModal} />
        )}
      </Modal>
    </AdminLayout>
  );
}