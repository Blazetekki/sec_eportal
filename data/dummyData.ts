import {
  Student,
  Admin,
  Exam,
  ExamResult,
  StudentRecord,
  License,
  Achievement,
} from './types';

// We just define this data so it can be in the allExamBank
const SS2_MATHEMATICS_EXAM: Exam = {
  id: 'EXAM-MATH-SS2',
  subject: 'Mathematics',
  class: 'SS 2',
  status: 'Published',
  durationMinutes: 45,
  objectiveQuestions: [
    { id: 1, question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correct: '4' },
    { id: 2, question: 'Solve for x: 2x = 10', options: ['2', '10', '5', '8'], correct: '5' },
    { id: 3, question: 'What is the area of a square with side 3?', options: ['6', '9', '12', '3'], correct: '9' },
  ],
  theoryQuestions: [
    { id: 6, question: "Explain Pythagoras' theorem with an example." },
    { id: 11, question: "Define 'quadratic equation' and provide the formula." },
  ],
};

export const DUMMY_DATA = {
  studentProfile: {
    id: 'S-123',
    name: 'Peter Adenugba',
    regNo: 'SS2A001',
    class: 'SS 2',
    photo: 'https://placehold.co/100x100/EBF4FF/4A90E2?text=PA',
  } as Student,

  adminProfile: {
    id: 'T-001',
    name: 'Mrs. Okonjo',
    role: 'Admin',
    photo: 'https://placehold.co/100x100/FFF6E5/FFA500?text=AD',
  } as Admin,

  // This is our "database table" for live exams.
  // We start with it empty.
  liveExams: [] as Exam[],

  // 1. Used by "Upload Result" for the Subject dropdown
  // We cast this array as Exam[] to fix the TypeScript error
  allExamBank: [
    SS2_MATHEMATICS_EXAM,
    {
      id: 'EXAM-ENG-SS2',
      subject: 'English Language',
      class: 'SS 2',
      status: 'Published',
      durationMinutes: 30,
      objectiveQuestions: [
        { id: 4, question: 'What is the capital of Nigeria?', options: ['Abuja', 'Lagos', 'Kano', 'Ibadan'], correct: 'Abuja' },
        { id: 5, question: 'Which of these is a verb?', options: ['Quickly', 'Run', 'Heavy', 'Blue'], correct: 'Run' },
      ],
      theoryQuestions: [
        { id: 7, question: 'Write a letter to the Principal...' },
      ],
    } as Exam,
    {
      id: 'EXAM-PHY-SS2',
      subject: 'Physics',
      class: 'SS 2',
      status: 'Draft',
      durationMinutes: 40,
      objectiveQuestions: [],
      theoryQuestions: [],
    } as Exam,
    {
      id: 'EXAM-CHEM-SS1',
      subject: 'Chemistry',
      class: 'SS 1',
      status: 'Published',
      durationMinutes: 40,
      objectiveQuestions: [],
      theoryQuestions: [],
    } as Exam,
  ] as Exam[],

  // 2. Used by "Upload Result" to save/load scores from
  studentResults: [
    { id: 'R1', studentId: 'S-123', subject: "Mathematics", class: 'JSS 1', term: 'First Term', ca: 30, exam: 50, total: 80, remark: "Excellent" },
    { id: 'R2', studentId: 'S-123', subject: "English Language", class: 'JSS 1', term: 'First Term', ca: 25, exam: 40, total: 65, remark: "Good" },
    { id: 'R3', studentId: 'S-123', subject: "Mathematics", class: 'JSS 2', term: 'First Term', ca: 35, exam: 55, total: 90, remark: "Excellent" },
    { id: 'R4', studentId: 'S-123', subject: "Physics", class: 'JSS 2', term: 'First Term', ca: 20, exam: 30, total: 50, remark: "Good" },
    { id: 'R5', studentId: 'S-123', subject: "Mathematics", class: 'SS 1', term: 'First Term', ca: 38, exam: 55, total: 93, remark: "Excellent" },
    { id: 'R6', studentId: 'S-123', subject: "Physics", class: 'SS 1', term: 'First Term', ca: 15, exam: 22, total: 37, remark: "Poor" },
    { id: 'R7', studentId: 'S-123', subject: 'Mathematics', class: 'SS 2', term: 'First Term', ca: 32, exam: 58, total: 90, remark: 'Excellent' },
    { id: 'R8', studentId: 'S-124', subject: "English Language", class: 'SS 1', term: 'First Term', ca: 30, exam: 45, total: 75, remark: "Good" },
    { id: 'R9', studentId: 'S-124', subject: "Chemistry", class: 'SS 1', term: 'First Term', ca: 25, exam: 35, total: 60, remark: "Good" },
    { id: 'R10', studentId: 'S-124', subject: 'English Language', class: 'SS 2', term: 'First Term', ca: 35, exam: 40, total: 75, remark: 'Good' },
    { id: 'R11', studentId: 'S-124', subject: 'Physics', class: 'SS 2', term: 'First Term', ca: 30, exam: 42, total: 72, remark: 'Good' },
  ] as ExamResult[],

  // 3. Used by "Upload Result" to list students
  allStudents: [
    { id: 'S-123', name: 'Peter Adenugba', regNo: 'SS2A001', class: 'SS 2', address: '123 Kado Estate, Abuja', parentPhone: '08012345678', photo: 'https://placehold.co/100x100/F0FDF4/15803D?text=PA' },
    { id: 'S-124', name: 'Foyin Ademi', regNo: 'SS2A002', class: 'SS 2', address: '456 Gwarinpa, Abuja', parentPhone: '08098765432' },
    { id: 'S-125', name: 'Chika Nwosu', regNo: 'SS1A001', class: 'SS 1', address: '789 Maitama, Abuja', parentPhone: '08011112222' },
  ] as StudentRecord[],

  allAchievements: [
    { id: 'A-1', studentId: 'S-123', award: 'Best in Mathematics (SS 1)', date: '2024-07-20' },
    { id: 'A-2', studentId: 'S-123', award: '1st Place, School Debate', date: '2024-05-10' },
    { id: 'A-3', studentId: 'S-123', award: 'Best Student in Sport 2024', date: '2024-03-15' },
    { id: 'A-4', studentId: 'S-124', award: 'Best in English Language (SS 1)', date: '2024-07-20' },
  ] as Achievement[],

  validLicense: {
    key: 'VALID-KEY-12345',
    valid: true,
    expiryDate: '2026-10-31',
    schoolName: 'Springfield High School',
  } as License,
  expiredLicense: {
    key: 'EXPIRED-KEY-67890',
    valid: false,
    expiryDate: '2023-10-31',
    schoolName: 'Old Creek Academy',
  } as License,
};