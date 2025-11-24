// components/shared/Button.tsx
import React, { ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  children: ReactNode;
  // --- THIS IS THE FIX ---
  // We updated the type to accept the MouseEvent
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  // --- END OF FIX ---
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
};

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}: ButtonProps) => {
  const classNames = [
    styles.button,
    styles[variant],
    className,
  ].join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames}
    >
      {children}
    </button>
  );
};