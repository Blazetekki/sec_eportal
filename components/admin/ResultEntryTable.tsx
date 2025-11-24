// components/admin/ResultEntryTable.tsx
import React from 'react';
import { StudentRecord } from '@/data/types';
import styles from './ResultEntryTable.module.css';
import { Button } from '../shared/Button';
import { Icons } from '../shared/Icons';

export type ScoreInput = {
  ca: string;
  exam: string;
};
export type ScoreState = Record<string, ScoreInput>;

type ResultEntryTableProps = {
  students: StudentRecord[];
  scores: ScoreState;
  onScoreChange: (studentId: string, field: 'ca' | 'exam', value: string) => void;
  onSaveRow: (studentId: string) => void; // <-- NEW: Saves one row
  getRemark: (total: number) => string;
};

export const ResultEntryTable = ({
  students,
  scores,
  onScoreChange,
  onSaveRow,
  getRemark,
}: ResultEntryTableProps) => {

  const calculateTotal = (ca: string, exam: string) => {
    return (Number(ca) || 0) + (Number(exam) || 0);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Student Name</th>
            <th className={styles.th}>Reg. No</th>
            <th className={styles.th}>CA (40)</th>
            <th className={styles.th}>Exam (60)</th>
            <th className={styles.th}>Total (100)</th>
            <th className={styles.th}>Remark</th>
            <th className={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {students.map((student) => {
            const currentScore = scores[student.id] || { ca: '', exam: '' };
            const total = calculateTotal(currentScore.ca, currentScore.exam);
            const remark = getRemark(total);

            return (
              <tr key={student.id} className={styles.tr}>
                <td className={`${styles.td} ${styles.nameCell}`}>{student.name}</td>
                <td className={styles.td}>{student.regNo}</td>
                <td className={styles.inputCell}>
                  <input
                    type="number"
                    className={styles.inputField}
                    value={currentScore.ca}
                    onChange={(e) => onScoreChange(student.id, 'ca', e.target.value)}
                    max={40}
                    min={0}
                    placeholder="e.g. 30"
                  />
                </td>
                <td className={styles.inputCell}>
                  <input
                    type="number"
                    className={styles.inputField}
                    value={currentScore.exam}
                    onChange={(e) => onScoreChange(student.id, 'exam', e.target.value)}
                    max={60}
                    min={0}
                    placeholder="e.g. 50"
                  />
                </td>
                <td className={`${styles.td} ${styles.totalCell}`}>{total}</td>
                <td className={styles.td}>{remark}</td>
                {/* --- NEW: Action button per row --- */}
                <td className={styles.td}>
                  <Button
                    variant="primary"
                    className={styles.actionButton}
                    onClick={() => onSaveRow(student.id)}
                  >
                    <Icons.UploadCloud className={styles.actionIcon} />
                    Upload
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};