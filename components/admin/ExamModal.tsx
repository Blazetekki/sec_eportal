// components/admin/ExamModal.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../shared/Button';
import styles from './ExamModal.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { Exam } from '@/data/types';

type ExamModalProps = {
  onClose: () => void;
  onAddExam: (newExam: Exam) => void;
  onEditExam: (updatedExam: Exam) => void;
  examToEdit: Exam | null;
};

const CLASS_OPTIONS = [ 'JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3' ];

export const ExamModal = ({
  onClose,
  onAddExam,
  onEditExam,
  examToEdit,
}: ExamModalProps) => {
  const { showNotification } = useAuth();

  const [subject, setSubject] = useState('');
  const [className, setClassName] = useState(CLASS_OPTIONS[0]);
  const [duration, setDuration] = useState(40); // Default 40 mins

  const isEditMode = examToEdit !== null;

  useEffect(() => {
    if (isEditMode) {
      setSubject(examToEdit.subject);
      setClassName(examToEdit.class);
      setDuration(examToEdit.durationMinutes);
    }
  }, [examToEdit, isEditMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject) {
      showNotification('Error', 'Please enter a subject name.', 'error');
      return;
    }

    if (isEditMode) {
      const updatedExam: Exam = {
        ...examToEdit, // Preserves ID and existing questions
        subject,
        class: className as Exam['class'],
        durationMinutes: duration,
      };
      onEditExam(updatedExam);
    } else {
      const newExam: Exam = {
        id: crypto.randomUUID(),
        subject,
        class: className as Exam['class'],
        durationMinutes: duration,
        status: 'Draft', // New exams are always Drafts
        objectiveQuestions: [], // Start with empty questions
        theoryQuestions: [],
      };
      onAddExam(newExam);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="subject" className={styles.label}>
          Subject Name *
        </label>
        <input
          id="subject"
          type="text"
          className={styles.input}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g., Mathematics"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="class" className={styles.label}>
          Class
        </label>
        <select
          id="class"
          className={styles.select}
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        >
          {CLASS_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="duration" className={styles.label}>
          Objective Duration (Minutes)
        </label>
        <input
          id="duration"
          type="number"
          className={styles.input}
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value, 10))}
        />
      </div>

      <div className={styles.buttonWrapper}>
        <Button type="submit" variant="primary" className="w-auto">
          {isEditMode ? 'Update Exam' : 'Save Exam'}
        </Button>
      </div>
    </form>
  );
};