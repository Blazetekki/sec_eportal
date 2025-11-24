// pages/login.tsx
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/shared/Button';
import { Icons } from '@/components/shared/Icons';
import styles from './login.module.css'; // Import our new CSS Module

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [regNo, setRegNo] = useState("");
  const [role, setRole] = useState<'student' | 'admin'>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role, regNo);
  };

  const RoleToggle = () => (
    <div className={styles.roleToggle}>
      <button
        type="button"
        onClick={() => setRole('student')}
        className={`${styles.roleButton} ${
          role === 'student' ? styles.roleButtonActive : ''
        }`}
      >
        Student
      </button>
      <button
        type="button"
        onClick={() => setRole('admin')}
        className={`${styles.roleButton} ${
          role === 'admin' ? styles.roleButtonActive : ''
        }`}
      >
        Teacher / Admin
      </button>
    </div>
  );

  const Logo = () => (
    <div className={styles.logo}>
      <div className={styles.logoIcon}>
        <Icons.BookOpen className="w-8 h-8 text-white" />
      </div>
    </div>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <Logo />

        <div className={styles.header}>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Sign in to access your ePortal</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <RoleToggle />

          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              {role === 'student' ? (
                <Icons.User className="w-5 h-5" />
              ) : (
                <Icons.Key className="w-5 h-5" />
              )}
            </div>
            <input
              id="regNo"
              type="text"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              placeholder={
                role === 'student'
                  ? 'Registration No. (SS2A001)'
                  : 'Admin ID (ADMIN-001)'
              }
              className={styles.inputField}
            />
          </div>

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}