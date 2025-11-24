// pages/student/take-exam.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Icons } from '@/components/shared/Icons';
import { DUMMY_DATA } from '@/data/dummyData';
import { Exam, Question, TheoryQuestion } from '@/data/types';
import { useTimer } from '@/hooks/useTimer';
import styles from './TakeExam.module.css';

// --- NEW: Fisher-Yates Shuffle Function ---
// This is the standard, most effective algorithm for shuffling an array.
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};
// --- END OF NEW FUNCTION ---

export default function TakeExamPage() {
  const { user, loading, logout, showNotification } = useAuth();
  const router = useRouter();

  // --- Page State ---
  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timerPaused, setTimerPaused] = useState(false);
  const [examPhase, setExamPhase] = useState<'objectives' | 'checkpoint' | 'theory'>('objectives');

  // --- NEW: State for shuffled questions ---
  const [shuffledObjectives, setShuffledObjectives] = useState<Question[]>([]);
  // --- END OF NEW STATE ---

  // --- Objective State ---
  const [currentObjectiveIndex, setCurrentObjectiveIndex] = useState(0);
  const [objectiveAnswers, setObjectiveAnswers] = useState<Record<number, string>>({});

  // --- Theory State ---
  const [theoryAnswers, setTheoryAnswers] = useState<Record<number, string>>({});

  // --- Auth & Data Loading Effect ---
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (router.isReady && user) {
      const { id } = router.query;
      const foundExam = DUMMY_DATA.allExamBank.find((e) => e.id === id);
      if (foundExam) {
        setExam(foundExam);

        // --- THIS IS THE FIX ---
        // We create a new, shuffled copy of the questions
        // We use [...array] to avoid mutating the original dummy data
        const questionsToShuffle = [...foundExam.objectiveQuestions];
        setShuffledObjectives(shuffleArray(questionsToShuffle));
        // --- END OF FIX ---

      } else {
        showNotification(
          'Error',
          'Invalid or missing exam link.',
          'error'
        );
        router.push('/student/dashboard');
      }
      setIsLoading(false);
    }
  }, [router.isReady, router.query, user, loading, router, showNotification]);

  // --- Step 1: Submit Objectives ---
  const submitObjectives = useCallback(() => {
    if (examPhase !== 'objectives') return;
    setTimerPaused(true);
    setExamPhase('checkpoint');
    console.log('--- OBJECTIVES LOCKED IN ---');
    console.log(objectiveAnswers);
  }, [examPhase, objectiveAnswers]);

  // ... (handleProceedToTheory and handleFinalSubmit are unchanged) ...
  const handleProceedToTheory = () => { /* ... */ };
  const handleFinalSubmit = useCallback(() => { /* ... */ }, [logout, theoryAnswers, showNotification]);

  // --- Timer Hook ---
  const examDuration = exam ? exam.durationMinutes * 60 : 0;
  const { formattedTime, secondsLeft } = useTimer(
    examDuration,
    submitObjectives,
    isLoading || timerPaused
  );

  // --- Event Handlers (Objectives) ---
  const handleSelectAnswer = (questionId: number, option: string) => {
    setObjectiveAnswers((prev) => ({ ...prev, [questionId]: option }));
  };
  const handleNext = () => {
    // --- UPDATED: Use shuffledObjectives ---
    if (exam && currentObjectiveIndex < shuffledObjectives.length - 1) {
      setCurrentObjectiveIndex((prev) => prev + 1);
    }
  };
  const handleBack = () => {
    if (currentObjectiveIndex > 0) {
      setCurrentObjectiveIndex((prev) => prev - 1);
    }
  };

  // ... (handleTheoryChange is unchanged) ...
  const handleTheoryChange = (questionId: number, answer: string) => { /* ... */ };

  // --- Render Handlers ---
  if (isLoading || !exam) {
    return (
      <div className={styles.lockdownWrapper}>
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          Loading Exam...
        </div>
      </div>
    );
  }

  // --- Header: ONLY for Objectives ---
  const ExamHeader = () => (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <span>{exam.subject} (Objectives)</span>
        <div className={styles.timer}>
          <Icons.Clock className="w-5 h-5" />
          <span>{formattedTime}</span>
        </div>
      </div>
      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${(secondsLeft / examDuration) * 100}%` }}
        />
      </div>
    </header>
  );

  // --- Page: Phase 1 (Objectives) ---
  const renderObjectives = () => {
    // --- UPDATED: Use shuffledObjectives ---
    if (shuffledObjectives.length === 0) {
      return <div>Loading questions...</div>;
    }
    const currentQuestion = shuffledObjectives[currentObjectiveIndex];
    // --- END OF UPDATE ---

    return (
      <>
        <ExamHeader />
        <Card>
          <CardHeader>
            <CardTitle>
              {/* --- UPDATED: Use shuffledObjectives --- */}
              Objective Question {currentObjectiveIndex + 1} / {shuffledObjectives.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={styles.questionText}>{currentQuestion.question}</p>
            <ul className={styles.optionsList}>
              {currentQuestion.options.map((option) => (
                <li key={option}>
                  <button
                    onClick={() => handleSelectAnswer(currentQuestion.id, option)}
                    className={`${styles.optionButton} ${
                      objectiveAnswers[currentQuestion.id] === option
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
                disabled={currentObjectiveIndex === 0}
                className="w-auto"
              >
                <Icons.ChevronLeft className="w-5 h-5 mr-1" />
                Back
              </Button>
              {/* --- UPDATED: Use shuffledObjectives --- */}
              {currentObjectiveIndex === shuffledObjectives.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={submitObjectives}
                  className="w-auto"
                >
                  Submit Objectives
                </Button>
              ) : (
                <Button variant="primary" onClick={handleNext} className="w-auto">
                  Next
                  <Icons.ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </>
    );
  };

  // --- Page: Phase 2 (Checkpoint) ---
  const renderCheckpoint = () => (
    <Card>
      <CardContent className={styles.checkpointCard}>
        <div className={styles.checkpointIconWrapper}>
          <Icons.CheckCircle className="w-8 h-8" />
        </div>
        <h2 className={styles.checkpointTitle}>Objectives Submitted!</h2>
        <p className={styles.checkpointSubtitle}>
          Your objective answers have been saved.
          <br />
          You may now proceed to the theory section. This part is not timed.
        </p>
        <Button
          variant="primary"
          onClick={handleProceedToTheory}
          className="w-full md:w-auto"
        >
          Proceed to Theory
        </Button>
      </CardContent>
    </Card>
  );

  // --- Page: Phase 3 (Theory) ---
  const renderTheory = () => (
    <Card>
      <CardHeader>
        <CardTitle>{exam.subject} - Theory Section</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={styles.questionText}>
          Answer all questions. This section is not timed.
          <br />
          Click the button at the bottom when you are finished.
        </p>
        <ul className={styles.theoryList}>
          {exam.theoryQuestions.map((q, index) => (
            <li key={q.id} className={styles.theoryItem}>
              <h3 className={styles.theoryHeader}>
                Question {index + 1}
              </h3>
              <p className={styles.questionText}>{q.question}</p>
              <textarea
                className={styles.theoryTextarea}
                placeholder="Type your answer here..."
                value={theoryAnswers[q.id] || ''}
                onChange={(e) => handleTheoryChange(q.id, e.target.value)}
              />
            </li>
          ))}
        </ul>
        <div className={styles.finalSubmitWrapper}>
          <Button
            variant="danger"
            onClick={handleFinalSubmit}
            className="w-full md:w-auto"
          >
            Submit Final Answers & Log Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  // --- Main Page Render Logic ---
  return (
    <div className={styles.lockdownWrapper}>
      <div className={styles.content}>
        {examPhase === 'objectives' && renderObjectives()}
        {examPhase === 'checkpoint' && renderCheckpoint()}
        {examPhase === 'theory' && renderTheory()}
      </div>
    </div>
  );
}