// components/shared/ResultTable.tsx
import React from 'react';
import { ExamResult } from '@/data/types';
import styles from './ResultTable.module.css';

type ResultTableProps = {
  results: ExamResult[];
};

export const ResultTable = ({ results }: ResultTableProps) => {
  // Helper function to get the correct CSS class for the remark
  const getRemarkClass = (remark: string) => {
    const lowerRemark = remark.toLowerCase();
    if (lowerRemark === 'excellent') {
      return styles.remarkExcellent;
    }
    if (lowerRemark === 'good') {
      return styles.remarkGood;
    }
    // Default for "Poor" or any other value
    return styles.remarkPoor;
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Subject</th>
            <th className={styles.th}>CA (40)</th>
            <th className={styles.th}>Exam (60)</th>
            <th className={styles.th}>Total (100)</th>
            <th className={styles.th}>Remark</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {results.map((result) => (
            <tr key={result.subject} className={styles.tr}>
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