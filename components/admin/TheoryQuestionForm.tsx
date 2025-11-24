// components/admin/TheoryQuestionForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../shared/Button';
import styles from './TheoryQuestionForm.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { TheoryQuestion } from '@/data/types';

type TheoryQuestionFormProps = {
  onClose: () => void;
  onSubmit: (question: TheoryQuestion) => void;
  questionToEdit: TheoryQuestion | null;
};

export const TheoryQuestionForm = ({
  onClose,
  onSubmit,
  questionToEdit,
}: TheoryQuestionFormProps) => {
  const { showNotification } = useAuth();
  const [questionText, setQuestionText] = useState('');
  const isEditMode = questionToEdit !== null;

  useEffect(() => {
    if (isEditMode) {
      setQuestionText(questionToEdit.question);
    }
  }, [questionToEdit, isEditMode]);

  // --- NEW: Function to clear the form ---
  const resetForm = () => {
    setQuestionText('');
  };

  // --- UPDATED: This function just handles the save logic ---
  const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!questionText) {
      showNotification('Error', 'Please enter the question text.', 'error');
      return false; // Indicate failure
    }

    const newQuestion: TheoryQuestion = {
      id: questionToEdit?.id || Date.now(),
      question: questionText,
    };

    onSubmit(newQuestion);
    return true; // Indicate success
  };

  // --- NEW: Handler for "Save & Add Another" ---
  const handleSaveAndAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    const success = handleSave(e);
    if (success) {
      showNotification('Success', 'Question saved! Ready for next.', 'success');
      resetForm();
    }
  };

  // --- NEW: Handler for "Save & Close" ---
  const handleSaveAndClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    const success = handleSave(e);
    if (success) {
      onClose();
    }
  };

  return (
    <form className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="questionText" className={styles.label}>
          Theory Question
        </label>
        <textarea
          id="questionText"
          className={styles.textarea}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="e.g., Explain the process of photosynthesis."
        />
      </div>

      {/* --- UPDATED: Two save buttons --- */}
      <div className={styles.buttonWrapper}>
        <Button
          type="button"
          variant="secondary"
          className="w-auto"
          onClick={handleSaveAndAdd}
          disabled={isEditMode}
        >
          Save & Add Another
        </Button>
        <Button
          type="button"
          variant="primary"
          className="w-auto"
          onClick={handleSaveAndClose}
        >
          {isEditMode ? 'Update & Close' : 'Save & Close'}
        </Button>
      </div>
    </form>
  );
};