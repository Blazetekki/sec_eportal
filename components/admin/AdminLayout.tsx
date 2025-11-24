// components/admin/AdminLayout.tsx
import React, { ReactNode } from 'react';
import Head from 'next/head';
import { Navbar } from '../shared/Navbar';
import { Sidebar } from './Sidebar';
import styles from './AdminLayout.module.css';

type AdminLayoutProps = {
  children: ReactNode;
  title: string;
};

export const AdminLayout = ({ children, title }: AdminLayoutProps) => {
  return (
    <div className={styles.layout}>
      <Head>
        <title>{title} | Admin Portal</title>
      </Head>

      {/* Navbar is at the top, spanning full width */}
      <div className={styles.navbar}>
        <Navbar hideNavLinks={true} />
      </div>

      {/* Sidebar is on the left */}
      <div className={styles.sidebar}>
        <Sidebar />
      </div>

      {/* Content is on the right */}
      <main className={styles.content}>
        {children}
      </main>
    </div>
  );
};