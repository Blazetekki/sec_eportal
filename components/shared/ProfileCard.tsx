// components/shared/ProfileCard.tsx
import React from 'react';
import { Student } from '@/data/types';
import { Card, CardContent } from './Card';
import { Button } from './Button'; // Import the Button
import styles from './ProfileCard.module.css';

// Add onLogout to the props
type ProfileCardProps = {
  user: Student;
  onLogout: () => void; // Add this prop
};

export const ProfileCard = ({ user, onLogout }: ProfileCardProps) => {
  // We'll update the placeholder to match the new theme
  const themedPhoto = user.photo.replace('EBF4FF/4A90E2', 'FFF7ED/FB923C');

  return (
    <Card className={styles.card}>
      <CardContent className={styles.content}>
        <img src={themedPhoto} alt={user.name} className={styles.image} />
        <h2 className={styles.name}>{user.name}</h2>
        <p className={styles.regNo}>{user.regNo}</p>
        <p className={styles.class}>{user.class}</p>

        {/* --- NEW LOGOUT BUTTON --- */}
        <div className={styles.logoutWrapper}>
          <Button variant="danger" onClick={onLogout}>
            Log Out
          </Button>
        </div>
        {/* --- END OF NEW BUTTON --- */}
      </CardContent>
    </Card>
  );
};