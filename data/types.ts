// data/types.ts

export type Student = {
  id: string;
  name: string;
  regNo: string;
  class: string;
  photo: string;
};

export type Admin = {
  id: string;
  name: string;
  role: 'Admin' | 'Teacher';
  photo: string;
};

export type User = (Student & { type: 'student' }) | (Admin & { type: 'admin' });

export type Question = {
  id: number;
  class: string;
  subject: string;
  question: string;
  options: string[];
  correct: string;
  type: 'objective' | 'theory';
};

// --- THIS IS THE UPDATED TYPE ---
export type ExamResult = {
  subject: string;
  class: 'JSS 1' | 'JSS 2' | 'JSS 3' | 'SS 1' | 'SS 2' | 'SS 3'; // Added class history
  term: 'First Term' | 'Second Term' | 'Third Term'; // Added term
  ca: number; // Continuous Assessment (e.g., out of 40)
  exam: number; // Exam Score (e.g., out of 60)
  total: number; // Total Score (ca + exam)
  remark: string;
};
// --- END OF UPDATE ---

// --- THIS IS THE UPDATED TYPE ---
export type StudentRecord = {
  id: string;
  name: string;
  regNo: string;
  class: string;
  address?: string;      // <-- NEW
  parentPhone?: string;  // <-- NEW
  photo?: string;        // <-- NEW (will store image URL or preview)
};
// --- END OF UPDATE ---

export type License = {
  key: string;
  valid: boolean;
  expiryDate: string;
  schoolName: string;
};

// --- NEW TYPE ---
export type Achievement = {
  id: string;
  studentId: string; // Links to StudentRecord
  award: string;
  date: string;
};

// --- THIS IS THE UPDATED TYPE ---
export type ExamResult = {
  id: string; // Added a unique ID for the result itself
  studentId: string; // <-- THIS IS THE NEW, CRITICAL FIELD
  subject: string;
  class: 'JSS 1' | 'JSS 2' | 'JSS 3' | 'SS 1' | 'SS 2' | 'SS 3';
  term: 'First Term' | 'Second Term' | 'Third Term';
  ca: number;
  exam: number;
  total: number;
  remark: string;
};
// --- END OF UPDATE ---