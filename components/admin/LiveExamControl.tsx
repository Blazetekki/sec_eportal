// components/admin/LiveExamControl.tsx
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DUMMY_DATA } from '@/data/dummyData';
import { Exam } from '@/data/types';
import { Button } from '@/components/shared/Button';
import styles from './LiveExamControl.module.css';
import { Icons } from '../shared/Icons';

type LiveExamControlProps = {
  onGoLive: (exam: Exam) => void;
};

export const LiveExamControl = ({ onGoLive }: LiveExamControlProps) => {
  // --- THIS IS THE CHANGE ---
  const { liveExams, setLiveExams, showNotification } = useAuth();
  // --- END OF CHANGE ---

  // Show exams that are "Published" and NOT already in the liveExams array
  const publishedExams = DUMMY_DATA.allExamBank.filter(
    (exam) =>
      exam.status === 'Published' &&
      !liveExams.some((live) => live.id === exam.id) // <-- NEW LOGIC
  );

  // --- UPDATED: Now takes the specific exam to stop ---
  const handleStopLive = (examToStop: Exam) => {
    showNotification(
      'Exam Stopped',
      `${examToStop.subject} is no longer live.`,
      'error'
    );
    // Remove the exam from the live array
    setLiveExams((prevExams) =>
      prevExams.filter((e) => e.id !== examToStop.id)
    );
  };

  return (
    <div>
      {/* --- UPDATED: Now maps over all live exams --- */}
      {liveExams.length > 0 &&
        liveExams.map((liveExam) => (
          <div
            key={liveExam.id}
            className={`${styles.examItem} ${styles.liveItem}`}
          >
            <div className={styles.examDetails}>
              <div className={styles.liveSubject}>
                <Icons.Broadcast className={styles.liveIcon} />
                <h3>LIVE: {liveExam.subject}</h3>
              </div>
              <p className={styles.examMeta}>
                Class {liveExam.class} | {liveExam.durationMinutes} mins
              </p>
            </div>
            <Button
              variant="danger"
              onClick={() => handleStopLive(liveExam)} // <-- PASS EXAM
              className={styles.actionButton}
            >
              Stop Live Exam
            </Button>
          </div>
        ))}
      {/* --- END OF UPDATE --- */}

      {/* 2. Show the list of "Awaiting" exams */}
      {publishedExams.length === 0 && liveExams.length === 0 ? (
        <p className={styles.noExams}>
          No exams are "Published".
          <br />
          Go to the Exam Bank to publish an exam first.
        </p>
      ) : (
        <ul className={styles.examList}>
          {publishedExams.map((exam) => (
            <li key={exam.id} className={styles.examItem}>
              <div className={styles.examDetails}>
                <h3 className={styles.examSubject}>{exam.subject}</h3>
                <p className={styles.examMeta}>
                  Class {exam.class} | {exam.objectiveQuestions.length} Obj. |{' '}
                  {exam.theoryQuestions.length} Theory
                </p>
                <p
                  className={`${styles.examStatus} ${styles.statusPublished}`}
                >
                  Status: Published (Awaiting)
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => onGoLive(exam)}
                className={styles.actionButton}
              >
                Go Live
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};