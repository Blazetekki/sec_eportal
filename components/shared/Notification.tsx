// components/shared/Notification.tsx
import React from 'react';
import { Icons } from './Icons';
import styles from './Notification.module.css';

type NotificationProps = {
  title: string;
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
};

export const Notification = ({
  title,
  message,
  type,
  onClose,
}: NotificationProps) => {
  const Icon =
    type === 'success' ? Icons.CheckCircleSolid : Icons.XCircleSolid;
  const variantClass = type === 'success' ? styles.success : styles.error;

  return (
    <div className={`${styles.wrapper} ${variantClass}`}>
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <Icon className={`${styles.icon} w-6 h-6`} />
        </div>
        <div className={styles.textWrapper}>
          <p className={styles.title}>{title}</p>
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.closeWrapper}>
          <button className={styles.closeButton} onClick={onClose}>
            <Icons.X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};