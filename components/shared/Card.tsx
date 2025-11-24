// components/shared/Card.tsx
import React, { ReactNode } from 'react';
import styles from './Card.module.css';

export const Card = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
};

export const CardHeader = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={`${styles.header} ${className}`}>{children}</div>;
};

export const CardTitle = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <h2 className={`${styles.title} ${className}`}>{children}</h2>;
};

export const CardContent = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => {
  return <div className={`${styles.content} ${className}`}>{children}</div>;
};