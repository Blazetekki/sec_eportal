// components/admin/DeleteModal.tsx
import React from 'react';
import { Button } from '../shared/Button';
import { Icons } from '../shared/Icons';
import styles from './DeleteModal.module.css';

type DeleteModalProps = {
  studentName: string;
  onClose: () => void;
  onConfirm: () => void;
};

export const DeleteModal = ({
  studentName,
  onClose,
  onConfirm,
}: DeleteModalProps) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.iconWrapper}>
        <Icons.Trash className={styles.icon} />
      </div>
      <h3 className={styles.title}>Delete Student?</h3>
      <p className={styles.message}>
        Are you sure you want to delete **{studentName}**? This action cannot be
        undone.
      </p>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose} className="w-full">
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} className="w-full">
          Yes, Delete
        </Button>
      </div>
    </div>
  );
};