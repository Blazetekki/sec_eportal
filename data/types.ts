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

// Updated to use 'type' instead of 'role' to match your AuthContext usage
export type User = (Student & { type: 'student' }) | (Admin & { type: 'admin' });

export type Question = {
  id: number;
  question: string;
  options: string[];
  correct: string;
};

// --- NEW TYPE ---
export type TheoryQuestion = {
  id: number;
  question: string;
};

// --- NEW TYPE (Fixes your error) ---
export type Exam = {
  id: string;
  subject: string;
  class: 'JSS 1' | 'JSS 2' | 'JSS 3' | 'SS 1' | 'SS 2' | 'SS 3';
  status: 'Draft' | 'Published';
  durationMinutes: number;
  objectiveQuestions: Question[];
  theoryQuestions: TheoryQuestion[];
};

// Updated ExamResult to match the full results feature
export type ExamResult = {
  id: string;
  studentId: string;
  subject: string;
  class: 'JSS 1' | 'JSS 2' | 'JSS 3' | 'SS 1' | 'SS 2' | 'SS 3';
  term: 'First Term' | 'Second Term' | 'Third Term';
  ca: number;
  exam: number;
  total: number;
  remark: string;
};

export type StudentRecord = {
  id: string;
  name: string;
  regNo: string;
  class: string;
  address?: string;
  parentPhone?: string;
  photo?: string;
};

export type License = {
  key: string;
  valid: boolean;
  expiryDate: string;
  schoolName: string;
};

// --- NEW TYPE ---
export type Achievement = {
  id: string;
  studentId: string;
  award: string;
  date: string;
};