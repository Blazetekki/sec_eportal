// components/admin/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icons } from '../shared/Icons';
import styles from './Sidebar.module.css';
import { useAuth } from '@/contexts/AuthContext';

const adminLinks = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Icons.Home },
  { name: 'Manage Students', href: '/admin/students', icon: Icons.UsersGroup },
  { name: 'Exam Bank', href: '/admin/questions', icon: Icons.BookOpen },
  // --- HERE IS THE LINK YOU REQUESTED ---
  { name: 'Upload Result', href: '/admin/upload-result', icon: Icons.UploadCloud },
  // --- END OF LINK ---
  { name: 'View Results', href: '/admin/results', icon: Icons.Award },
];

export const Sidebar = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const NavLink = ({ name, href, icon: Icon }: { name: string; href: string; icon: any; }) => (
    <Link href={href} legacyBehavior>
      <a
        className={`${styles.navLink} ${
          router.pathname === href ? styles.navLinkActive : ''
        }`}
      >
        <Icon className={styles.icon} />
        {name}
      </a>
    </Link>
  );

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.navHeading}>Navigation</h3>
      <nav className={styles.nav}>
        {adminLinks.map((link) => (
          <NavLink key={link.name} {...link} />
        ))}
      </nav>

      <div className={styles.logoutNav}>
        <button className={styles.logoutButton} onClick={logout}>
          <Icons.LogOut className={styles.icon} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};