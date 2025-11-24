// components/shared/Switch.tsx
import React from 'react';
import styles from './Switch.module.css';

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export const Switch = ({ checked, onChange }: SwitchProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={handleChange}
      />
      <span className={styles.slider}></span>
    </label>
  );
};