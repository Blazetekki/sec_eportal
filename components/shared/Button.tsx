// components/shared/Button.tsx
import React, { ReactNode } from 'react';
import styles from './Button.module.css'; // Import our new CSS Module

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string; // We keep this for extra custom classes
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
  // We build our class list from the CSS module
  const classNames = [
    styles.button,
    styles[variant], // e.g., styles.primary
    className,
  ].join(' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames} // Apply the generated class names
    >
      {children}
    </button>
  );
};