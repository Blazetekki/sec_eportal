// contexts/AuthContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useRef,
} from 'react';
import { User, Exam } from '@/data/types';
import { DUMMY_DATA } from '@/data/dummyData';
import { useRouter } from 'next/router';

type NotificationState = {
  title: string;
  message: string;
  type: 'success' | 'error';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (role: 'student' | 'admin', regNo: string) => void;
  logout: () => void;
  liveExams: Exam[];
  setLiveExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  // --- NEW: The "database" for the exam bank ---
  allExams: Exam[];
  setAllExams: React.Dispatch<React.SetStateAction<Exam[]>>;
  // --- END NEW ---
  notification: NotificationState | null;
  showNotification: (
    title: string,
    message: string,
    type: 'success' | 'error'
  ) => void;
  hideNotification: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [liveExams, setLiveExams] = useState<Exam[]>([]);

  // --- NEW: We load the exam bank into our session ---
  const [allExams, setAllExams] = useState<Exam[]>(DUMMY_DATA.allExamBank);
  // --- END NEW ---

  const [notification, setNotification] =
    useState<NotificationState | null>(null);
  const notificationTimer = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  const hideNotification = () => { /* ... (no change) ... */ };
  const showNotification = (/* ... (no change) ... */) => { /* ... (no change) ... */ };

  const login = (role: 'student' | 'admin', regNo: string) => {
    setLoading(true);
    setTimeout(() => {
      if (role === 'student' && regNo === DUMMY_DATA.studentProfile.regNo) {
        setUser({ ...DUMMY_DATA.studentProfile, type: 'student' });
        router.push('/student/dashboard');
      } else if (role === 'admin' && regNo === 'ADMIN-001') {
        setUser({ ...DUMMY_DATA.adminProfile, type: 'admin' });
        // --- NEW: Load the database on admin login ---
        setAllExams(DUMMY_DATA.allExamBank);
        setLiveExams([]); // Clear live exams on login
        // --- END NEW ---
        router.push('/admin/dashboard');
      } else {
        showNotification(
          'Login Failed',
          'Invalid Registration Number.',
          'error'
        );
      }
      setLoading(false);
    }, 500);
  };

  const logout = () => {
    setUser(null);
    setLiveExams([]); // Reset session on logout
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        liveExams,
        setLiveExams,
        allExams, // <-- NEW
        setAllExams, // <-- NEW
        notification,
        showNotification,
        hideNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};