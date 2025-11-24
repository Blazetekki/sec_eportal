// components/admin/StatCard.tsx
import React, { ReactNode } from 'react';
import styles from './StatCard.module.css';

type StatCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  color: 'orange' | 'blue' | 'green';
};

export const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  const colorClass = styles[color] || styles.orange;

  return (
    <div className={styles.card}>
      <div className={`${styles.iconWrapper} ${colorClass}`}>
        <div className={styles.icon}>{icon}</div>
      </div>
      <div className={styles.content}>
        <p className={styles.value}>{value}</p>
        <p className={styles.title}>{title}</p>
      </div>
    </div>
  );
};