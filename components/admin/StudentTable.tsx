// components/admin/StudentTable.tsx
import React from 'react';
import Link from 'next/link';
import { StudentRecord } from '@/data/types';
import { Icons } from '../shared/Icons';
import styles from './StudentTable.module.css';

type StudentTableProps = {
  students: StudentRecord[];
  onEditStudent: (student: StudentRecord) => void; // <-- NEW PROP
  onDeleteStudent: (student: StudentRecord) => void; // <-- NEW PROP
};

export const StudentTable = ({
  students,
  onEditStudent,
  onDeleteStudent,
}: StudentTableProps) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Reg. Number</th>
            <th className={styles.th}>Class</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {students.map((student) => (
            <tr key={student.id} className={styles.tr}>
              <td className={styles.td}>{student.name}</td>
              <td className={styles.td}>{student.regNo}</td>
              <td className={styles.td}>{student.class}</td>
              <td className={styles.td}>
                <div className={styles.actions}>
                  <Link
                    href={`/admin/student/${student.id}`}
                    passHref
                    legacyBehavior
                  >
                    <a
                      className={`${styles.actionButton} ${styles.viewButton}`}
                      title="View Student"
                    >
                      <Icons.Eye className={styles.icon} />
                    </a>
                  </Link>
                  {/* --- NEW ACTIONS --- */}
                  <button
                    className={`${styles.actionButton} ${styles.editButton}`}
                    title="Edit Student"
                    onClick={() => onEditStudent(student)}
                  >
                    <Icons.Pencil className={styles.icon} />
                  </button>
                  <button
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    title="Delete Student"
                    onClick={() => onDeleteStudent(student)}
                  >
                    <Icons.Trash className={styles.icon} />
                  </button>
                  {/* --- END OF NEW ACTIONS --- */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};