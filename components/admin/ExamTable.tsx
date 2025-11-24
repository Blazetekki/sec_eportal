// components/admin/ExamTable.tsx
import React from 'react';
import Link from 'next/link';
import { Exam } from '@/data/types';
import { Icons } from '../shared/Icons';
import { Switch } from '../shared/Switch'; // <-- 1. IMPORT SWITCH
import styles from './ExamTable.module.css';

type ExamTableProps = {
  exams: Exam[];
  onEditExam: (exam: Exam) => void;
  onDeleteExam: (exam: Exam) => void;
  onStatusChange: (exam: Exam, newStatus: boolean) => void; // <-- 2. NEW PROP
};

export const ExamTable = ({
  exams,
  onEditExam,
  onDeleteExam,
  onStatusChange, // <-- 3. GET NEW PROP
}: ExamTableProps) => {

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Subject</th>
            <th className={styles.th}>Class</th>
            <th className={styles.th}>Status (Draft/Published)</th>
            <th className={styles.th}>Questions (Obj/Theory)</th>
            <th className={styles.th}>Duration</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {exams.map((exam) => (
            <tr key={exam.id} className={styles.tr}>
              <td className={styles.td}>{exam.subject}</td>
              <td className={styles.td}>{exam.class}</td>
              <td className={styles.td}>
                {/* --- 4. REPLACE TEXT WITH SWITCH --- */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Switch
                    checked={exam.status === 'Published'}
                    onChange={(isChecked) => onStatusChange(exam, isChecked)}
                  />
                  <span
                    className={`${styles.status} ${
                      exam.status === 'Published'
                        ? styles.statusPublished
                        : styles.statusDraft
                    }`}
                  >
                    {exam.status}
                  </span>
                </div>
                {/* --- END OF UPDATE --- */}
              </td>
              <td className={styles.td}>
                {exam.objectiveQuestions.length} / {exam.theoryQuestions.length}
              </td>
              <td className={styles.td}>{exam.durationMinutes} mins</td>
              <td className={styles.td}>
                <div className={styles.actions}>
                  <Link
                    href={`/admin/questions/${exam.id}`}
                    passHref
                    legacyBehavior
                  >
                    <a
                      className={`${styles.actionButton} ${styles.manageButton}`}
                      title="Manage Questions"
                    >
                      <Icons.ClipboardList className={styles.icon} />
                    </a>
                  </Link>
                  <button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    title="Edit Exam"
                    onClick={() => onEditExam(exam)}
                  >
                    <Icons.Pencil className={styles.icon} />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    title="Delete Exam"
                    onClick={() => onDeleteExam(exam)}
                  >
                    <Icons.Trash className={styles.icon} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};