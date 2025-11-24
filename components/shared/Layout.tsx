// components/shared/Layout.tsx
import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';
import Head from 'next/head';
import styles from './Layout.module.css';

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

export const Layout = ({ children, title = 'School ePortal' }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <Head>
        <title>{title}</title>
      </Head>
      <Navbar />
      <main className={styles.main}>{children}</main>
    </div>
  );
};