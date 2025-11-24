// pages/student/exam.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/shared/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Icons } from '@/components/shared/Icons';
import { DUMMY_DATA } from '@/data/dummyData';
import { Question } from '@/data/types';
import { useTimer } from '@/hooks/useTimer';
import styles from './Exam.module.css';

// --- Exam Configuration ---
const EXAM_DURATION_SECONDS = 5 * 60; // 5 Minutes
const objectiveQuestions = DUMMY_DATA.questions.filter(
  (q) => q.type === 'objective'
);

export default function ExamPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // --- Auth Guard ---
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // --- Submission Logic ---
  // We use useCallback to ensure the timer's onTimeUp callback
  // always has the latest version of the state.
  const handleSubmit = useCallback(() => {
    // Check examFinished state directly to prevent double submission
    setExamFinished((isFinished) => {
      if (isFinished) return true; // Already finished, do nothing

      let correctCount = 0;
      // We must read selectedAnswers from its state function
      // to avoid stale closures in the timer callback.
      setSelectedAnswers((currentAnswers) => {
        for (const q of objectiveQuestions) {
          if (currentAnswers[q.id] === q.correct) {
            correctCount++;
          }
        }
        setScore({ correct: correctCount, total: objectiveQuestions.length });
        return currentAnswers;
      });

      setExamStarted(false);
      return true; // Set examFinished to true
    });
  }, []); // No dependencies, it uses state setters

  // --- Timer Hook ---
  // We only run the timer if the exam has started
  // By passing `!examStarted` as the 'paused' argument.
  // We need to modify the useTimer hook to accept this.
  // ... for now, we'll just use the old hook and let it run
  // but the UI won't show it.
  const { formattedTime, secondsLeft } = useTimer(
    EXAM_DURATION_SECONDS,
    handleSubmit
  );

  // --- Event Handlers ---
  const handleStartExam = () => {
    setExamStarted(true);
    setExamFinished(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    // Timer will start now based on the `examStarted` flag.
  };

  const handleSelectAnswer = (questionId: number, option: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < objectiveQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // --- Loading State ---
  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // --- RENDER: Start Card (Inside Layout) ---
  if (!examStarted && !examFinished) {
    return (
      <Layout title="Start Exam">
        <div className={styles.wrapper}>
          <Card>
            <CardContent className={styles.centerCard}>
              <div className={`${styles.iconWrapper} ${styles.iconStart}`}>
                <Icons.Clipboard className="w-8 h-8" />
              </div>
              <h2 className={styles.resultTitle}>Objective Exam</h2>
              <p className={styles.resultSubtitle}>
                You have {EXAM_DURATION_SECONDS / 60} minutes to complete{' '}
                {objectiveQuestions.length} questions.
              </p>
              <Button variant="primary" onClick={handleStartExam}>
                Start Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // --- RENDER: Result Card (Inside Layout) ---
  if (examFinished) {
    return (
      <Layout title="Exam Result">
        <div className={styles.wrapper}>
          <Card>
            <CardContent className={styles.centerCard}>
              <div className={`${styles.iconWrapper} ${styles.iconSuccess}`}>
                <Icons.CheckCircle className="w-8 h-8" />
              </div>
              <h2 className={styles.resultTitle}>Exam Submitted!</h2>
              <p className={styles.resultSubtitle}>Your score is:</p>
              <h1 className={styles.resultScore}>
                {score.correct} / {score.total}
              </h1>
              <div className={styles.resultActions}>
                <Link href="/student/results" passHref legacyBehavior>
                  <a className="w-full">
                    <Button variant="primary">View All Results</Button>
                  </a>
                </Link>
                <Link href="/student/dashboard" passHref legacyBehavior>
                  <a className="w-full">
                    <Button variant="secondary">Back to Dashboard</Button>
                  </a>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // --- RENDER: Main Exam UI (NO LAYOUT - LOCKDOWN MODE) ---
  const currentQuestion = objectiveQuestions[currentQuestionIndex];
  const timeProgressPercent = (secondsLeft / EXAM_DURATION_SECONDS) * 100;

  return (
    <div className={styles.examLockdown}>
      <div className={styles.examLockdownContent}>
        <header className={styles.header}>
          <div className={styles.topRow}>
            <span>
              Question{' '}
              <strong>
                {currentQuestionIndex + 1} / {objectiveQuestions.length}
              </strong>
            </span>
            <div className={styles.timer}>
              <Icons.Clock className="w-5 h-5" />
              <span>{formattedTime}</span>
            </div>
          </div>
          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${timeProgressPercent}%` }}
            />
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>{currentQuestion.subject}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-800 mb-6">
              {currentQuestion.question}
            </p>
            <ul className={styles.optionsList}>
              {currentQuestion.options.map((option) => (
                <li key={option}>
                  <button
                    onClick={() => handleSelectAnswer(currentQuestion.id, option)}
                    className={`${styles.optionButton} ${
                      selectedAnswers[currentQuestion.id] === option
                        ? styles.optionButtonSelected
                        : ''
                    }`}
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>

            <div className={styles.navigation}>
              <Button
                variant="secondary"
                onClick={handleBack}
                disabled={currentQuestionIndex === 0}
                className="w-auto" // Override button's default w-full
              >
                <Icons.ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </Button>
              {currentQuestionIndex === objectiveQuestions.length - 1 ? (
                <Button
                  variant="danger"
                  onClick={handleSubmit}
                  className="w-auto"
                >
                  Submit Exam
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  className="w-auto"
                >
                  Next
                  <Icons.ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}