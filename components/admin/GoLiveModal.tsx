// components/admin/GoLiveModal.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../shared/Button';
import styles from './GoLiveModal.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { Exam, StudentRecord } from '@/data/types';
import { DUMMY_DATA } from '@/data/dummyData';

type GoLiveModalProps = {
  exam: Exam;
  onClose: () => void;
};

export const GoLiveModal = ({ exam, onClose }: GoLiveModalProps) => {
  // --- THIS IS THE CHANGE ---
  const { setLiveExams, showNotification } = useAuth(); // Was: setLiveExam
  // --- END OF CHANGE ---

  const studentsInClass = DUMMY_DATA.allStudents.filter(
    (s) => s.class === exam.class
  );

  const allStudentIds = studentsInClass.map(s => s.id);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(allStudentIds);

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudentIds((prevIds) => {
      if (prevIds.includes(studentId)) {
        return prevIds.filter((id) => id !== studentId);
      } else {
        return [...prevIds, studentId];
      }
    });
  };

  const handleConfirmGoLive = () => {
    // ... (console logs) ...

    // --- THIS IS THE CHANGE ---
    // We now ADD to the array of live exams, not just set one
    setLiveExams(prevLiveExams => [...prevLiveExams, exam]);
    // --- END OF CHANGE ---

    showNotification(
      'Exam is LIVE!',
      `${exam.subject} is now live for ${selectedStudentIds.length} student(s).`,
      'success'
    );
    onClose();
  };

  return (
    <div className={styles.wrapper}>
      {/* ... (rest of the JSX is unchanged) ... */}
      <div className={styles.header}>
        <h3 className={styles.title}>Go Live: {exam.subject}</h3>
        <p className={styles.subtitle}>
          Uncheck students to exempt them from this exam (e.g., IRS students
          taking a CRS exam).
        </p>
      </div>

      <div className={styles.studentList}>
        {studentsInClass.map((student) => (
          <label key={student.id} className={styles.studentItem}>
            <input
              type="checkbox"
              checked={selectedStudentIds.includes(student.id)}
              onChange={() => handleToggleStudent(student.id)}
            />
            <div>
              <span className={styles.studentName}>{student.name}</span>
              <span className={styles.studentRegNo}>({student.regNo})</span>
            </div>
          </label>
        ))}
      </div>

      <p className={styles.summary}>
        {selectedStudentIds.length} / {studentsInClass.length} students selected.
      </p>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose} className="w-auto">
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirmGoLive} className="w-auto">
          Confirm & Go Live
        </Button>
      </div>
    </div>
  );
};