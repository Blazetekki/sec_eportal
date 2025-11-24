// components/shared/Pagination.tsx
import React from 'react';
import { Icons } from './Icons';
import styles from './Pagination.module.css';

type PaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) {
      return; // Do nothing if page is out of bounds
    }
    onPageChange(page);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className={styles.pagination}>
      <button
        className={styles.button}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Icons.ChevronLeft className={styles.icon} />
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`${styles.button} ${
            currentPage === page ? styles.active : ''
          }`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      <button
        className={styles.button}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Icons.ChevronRight className={styles.icon} />
      </button>
    </nav>
  );
};