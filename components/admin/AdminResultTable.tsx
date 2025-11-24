// components/admin/AdminResultTable.tsx
import React from 'react';
import { ExamResult, StudentRecord } from '@/data/types';
import styles from './AdminResultTable.module.css';

// --- THIS IS THE FIX ---
// We explicitly add 'id' to the type definition here to ensure TypeScript sees it.
type JoinedResult = ExamResult & {
  id: string;
  studentName: string;
  regNo: string;
};
// --- END OF FIX ---

type AdminResultTableProps = {
  results: JoinedResult[];
};

export const AdminResultTable = ({ results }: AdminResultTableProps) => {
  const getRemarkClass = (remark: string) => {
    const lowerRemark = remark.toLowerCase();
    if (lowerRemark === 'excellent') {
      return styles.remarkExcellent;
    }
    if (lowerRemark === 'good') {
      return styles.remarkGood;
    }
    return styles.remarkPoor;
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Student Name</th>
            <th className={styles.th}>Reg. No</th>
            <th className={styles.th}>Class</th>
            <th className={styles.th}>Term</th>
            <th className={styles.th}>Subject</th>
            <th className={styles.th}>CA (40)</th>
            <th className={styles.th}>Exam (60)</th>
            <th className={styles.th}>Total (100)</th>
            <th className={styles.th}>Remark</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {results.map((result) => (
            <tr key={result.id} className={styles.tr}>
              <td className={`${styles.td} ${styles.name}`}>{result.studentName}</td>
              <td className={styles.td}>{result.regNo}</td>
              <td className={styles.td}>{result.class}</td>
              <td className={styles.td}>{result.term}</td>
              <td className={styles.td}>{result.subject}</td>
              <td className={styles.td}>{result.ca}</td>
              <td className={styles.td}>{result.exam}</td>
              <td className={styles.td}>{result.total}</td>
              <td className={styles.td}>
                <span className={`${styles.remark} ${getRemarkClass(result.remark)}`}>
                  {result.remark}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};