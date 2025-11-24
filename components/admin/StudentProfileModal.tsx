// components/admin/StudentProfileModal.tsx
import React from 'react';
import { StudentRecord } from '@/data/types';
import { Icons } from '../shared/Icons';
import styles from './StudentProfileModal.module.css';

type StudentProfileModalProps = {
  student: StudentRecord;
};

const DetailItem = ({ label, value }: { label: string; value?: string }) => (
  <div className={styles.detailItem}>
    <h4 className={styles.detailLabel}>{label}</h4>
    <p className={styles.detailValue}>{value || 'N/A'}</p>
  </div>
);

export const StudentProfileModal = ({ student }: StudentProfileModalProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <img
          src={student.photo || 'https://placehold.co/100x100/F0FDF4/15803D?text=N/A'}
          alt={student.name}
          className={styles.image}
        />
        <h3 className={styles.name}>{student.name}</h3>
      </div>
      <div className={styles.detailsGrid}>
        <DetailItem label="Registration No." value={student.regNo} />
        <DetailItem label="Class" value={student.class} />
        <DetailItem label="Parent's Phone" value={student.parentPhone} />
        <DetailDatailItem label="Home Address" value={student.address} />
      </div>
    </div>
  );
};