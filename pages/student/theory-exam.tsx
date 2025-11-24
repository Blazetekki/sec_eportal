// pages/student/theory-exam.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/shared/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { DUMMY_DATA } from '@/data/dummyData';
import styles from './TheoryExam.module.css';

// 1. Get all theory questions from our dummy data
const theoryQuestions = DUMMY_DATA.questions.filter(
  (q) => q.type === 'theory'
);

export default function TheoryExamPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 2. Create state to hold the student's answers
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // --- Auth Guard ---
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // 3. Handle changes to any textarea
  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // 4. Handle the final submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send `answers` to your backend API
    console.log('Submitting Theory Answers:', answers);
    alert(
      'Theory Exam Submitted!\nYour teacher will grade your answers shortly.'
    );
    router.push('/student/dashboard');
  };

  // --- Loading State ---
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <Layout title="Theory Exam">
      <div className={styles.wrapper}>
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Theory Exam - All Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Answer all questions in the space provided. Your answers will be
                saved and submitted for grading.
              </p>

              {/* 5. The Scrollable Container */}
              <div className={styles.scrollContainer}>
                <ul className={styles.questionList}>
                  {theoryQuestions.map((q, index) => (
                    <li key={q.id} className={styles.questionItem}>
                      <h3 className={styles.questionHeader}>
                        Question {index + 1} {/* Pagination/Numbering */}
                      </h3>
                      <p className={styles.questionText}>{q.question}</p>
                      <textarea
                        className={styles.answerTextarea}
                        placeholder="Type your answer here..."
                        value={answers[q.id] || ''}
                        onChange={(e) =>
                          handleAnswerChange(q.id, e.target.value)
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>

              {/* 6. The Submit Button */}
              <div className={styles.submitWrapper}>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-full md:w-auto" // Responsive width
                >
                  Submit All Answers
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Layout>
  );
}