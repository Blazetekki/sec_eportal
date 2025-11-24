// components/admin/ObjectiveQuestionForm.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../shared/Button';
import styles from './ObjectiveQuestionForm.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { Question } from '@/data/types';

type ObjectiveQuestionFormProps = {
  onClose: () => void;
  onSubmit: (question: Question) => void;
  questionToEdit: Question | null;
};

export const ObjectiveQuestionForm = ({
  onClose,
  onSubmit,
  questionToEdit,
}: ObjectiveQuestionFormProps) => {
  const { showNotification } = useAuth();
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');

  const isEditMode = questionToEdit !== null;

  useEffect(() => {
    if (isEditMode) {
      setQuestionText(questionToEdit.question);
      setOptions(questionToEdit.options);
      setCorrectAnswer(questionToEdit.correct);
    }
  }, [questionToEdit, isEditMode]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const resetForm = () => {
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
  };

  // --- FIX: Make 'e' optional (?) so it satisfies the strict Button type ---
  const handleSave = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) e.preventDefault();

    if (!questionText || options.some(opt => !opt) || !correctAnswer) {
      showNotification('Error', 'Please fill all fields, including all 4 options and the correct answer.', 'error');
      return false;
    }
    if (!options.includes(correctAnswer)) {
      showNotification('Error', 'The correct answer must match one of the options.', 'error');
      return false;
    }

    const newQuestion: Question = {
      id: questionToEdit?.id || Date.now(),
      question: questionText,
      options,
      correct: correctAnswer,
    };

    onSubmit(newQuestion);
    return true;
  };

  // Mark e as optional here too
  const handleSaveAndAdd = (e?: React.MouseEvent<HTMLButtonElement>) => {
    const success = handleSave(e);
    if (success) {
      showNotification('Success', 'Question saved! Ready for next.', 'success');
      resetForm();
    }
  };

  // Mark e as optional here too
  const handleSaveAndClose = (e?: React.MouseEvent<HTMLButtonElement>) => {
    const success = handleSave(e);
    if (success) {
      onClose();
    }
  };
  // --- END OF FIX ---

  return (
    <form className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="questionText" className={styles.label}>
          Question
        </label>
        <textarea
          id="questionText"
          className={styles.textarea}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="e.g., What is the capital of Nigeria?"
        />
      </div>

      <div className={styles.optionsGrid}>
        {[0, 1, 2, 3].map((index) => (
          <div className={styles.formGroup} key={index}>
            <label htmlFor={`option-${index}`} className={styles.label}>
              Option {index + 1}
            </label>
            <input
              id={`option-${index}`}
              type="text"
              className={styles.input}
              value={options[index]}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="correctAnswer" className={styles.label}>
          Correct Answer
        </label>
        <input
          id="correctAnswer"
          type="text"
          className={styles.input}
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          placeholder="Type one of the options exactly"
        />
      </div>

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