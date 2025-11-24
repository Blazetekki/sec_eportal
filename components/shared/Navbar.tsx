// components/shared/Navbar.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Icons } from './Icons';
import { User, Student, Admin } from '@/data/types';
import styles from './Navbar.module.css';

type NavbarProps = {
  hideNavLinks?: boolean;
};

export const Navbar = ({ hideNavLinks = false }: NavbarProps) => {
  const { user, logout, liveExam } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  // --- Student Links Logic ---
  const studentLinks = [
    { name: 'Dashboard', href: '/student/dashboard', icon: Icons.Home },
  ];
  if (!liveExam) {
    studentLinks.push({
      name: 'View Results',
      href: '/student/results',
      icon: Icons.Award,
    });
  }

  // --- Admin Links (for Sidebar) ---
  const adminLinks = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Icons.Home },
    { name: 'Students', href: '/admin/students', icon: Icons.Users },
    { name: 'Questions', href: '/admin/questions', icon: Icons.BookOpen },
    { name: 'Results', href: '/admin/results', icon: Icons.Award },
  ];

  const links =
    user.type === 'student'
      ? studentLinks
      : hideNavLinks
      ? []
      : adminLinks;

  const NavLink = ({ name, href, icon: Icon }: { name: string, href: string, icon: any }) => (
    <Link href={href} legacyBehavior>
      <a
        onClick={() => setMobileMenuOpen(false)}
        className={`${styles.navLink} ${
          router.pathname === href ? styles.navLinkActive : ''
        }`}
      >
        <Icon className="w-5 h-5 mr-2" />
        {name}
      </a>
    </Link>
  );

  // --- ADDED TERNARY FOR STYLE ---
  const navStyle = hideNavLinks ? `${styles.nav} ${styles.navWhite}` : styles.nav;

  return (
    <nav className={navStyle}>
      <div className={styles.wrapper}>
        {/* ... (rest of component is unchanged) ... */}
        <div className={styles.leftContainer}>
          <div className={styles.logo}>ePortal</div>
          <div className={styles.desktopMenu}>
            {links.map((link) => (
              <NavLink key={link.name} {...link} />
            ))}
          </div>
        </div>
        <div className={styles.rightContainer}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user.name}</span>
            <img src={user.photo} alt={user.name} className={styles.userImage} />
            <button
              onClick={logout}
              className={styles.logoutButton}
              title="Log Out"
            >
              <Icons.LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
        {!hideNavLinks && (
          <div className={styles.mobileMenuToggle}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={styles.mobileMenuToggle}
            >
              {mobileMenuOpen ? (
                <Icons.X className="w-6 h-6" />
              ) : (
                <Icons.Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        )}
      </div>
      {mobileMenuOpen && !hideNavLinks && (
        <div className={styles.mobileMenu}>
          <div className="space-y-1">
            {links.map((link) => (
              <NavLink key={link.name} {...link} />
            ))}
          </div>
          <div className={styles.mobileUserInfo}>
            <img src={user.photo} alt={user.name} className={styles.userImage} />
            <div className={styles.mobileUserDetails}>
              <div className={styles.mobileUserName}>{user.name}</div>
              <div className={styles.mobileUserRole}>
                {user.type === 'student'
                  ? (user as Student).regNo
                  : (user as Admin).role}
              </div>
            </div>
          </div>
          <button onClick={logout} className={styles.mobileLogoutButton}>
            <Icons.LogOut className="w-5 h-5 mr-2" />
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
};