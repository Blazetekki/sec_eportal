// pages/admin/questions/[id].tsx
import React, { useState, useEffect, useMemo } from 'react'; // <-- Import useMemo
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { Modal } from '@/components/shared/Modal';
import { Icons } from '@/components/shared/Icons';
import { DUMMY_DATA } from '@/data/dummyData';
import { Exam, Question, TheoryQuestion } from '@/data/types';
import styles from './ManageQuestions.module.css';
import { ObjectiveQuestionForm } from '@/components/admin/ObjectiveQuestionForm';
import { TheoryQuestionForm } from '@/components/admin/TheoryQuestionForm';
import { DeleteModal } from '@/components/admin/DeleteModal';
import { Pagination } from '@/components/shared/Pagination'; // <-- 1. IMPORT PAGINATION

const QUESTIONS_PER_PAGE = 5; // <-- 2. Set questions per page

export default function ManageQuestionsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { showNotification } = useAuth();

  const [exam, setExam] = useState<Exam | null>(null);

  const [modalMode, setModalMode] = useState<'obj-add' | 'obj-edit' | 'theory-add' | 'theory-edit' | null>(null);
  const [deleteMode, setDeleteMode] = useState<'obj' | 'theory' | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | TheoryQuestion | null>(null);

  // --- 3. NEW PAGINATION STATE ---
  const [objCurrentPage, setObjCurrentPage] = useState(1);
  const [theoryCurrentPage, setTheoryCurrentPage] = useState(1);
  // --- END NEW STATE ---

  useEffect(() => {
    if (id) {
      const foundExam = DUMMY_DATA.allExamBank.find(e => e.id === id);
      if (foundExam) {
        setExam(foundExam);
      } else {
        showNotification('Error', 'Exam not found', 'error');
        router.push('/admin/questions');
      }
    }
  }, [id, router, showNotification]);

  // --- 4. PAGINATION LOGIC ---
  const paginatedObjectives = useMemo(() => {
    if (!exam) return [];
    const startIndex = (objCurrentPage - 1) * QUESTIONS_PER_PAGE;
    const endIndex = startIndex + QUESTIONS_PER_PAGE;
    return exam.objectiveQuestions.slice(startIndex, endIndex);
  }, [exam, objCurrentPage]);

  const paginatedTheory = useMemo(() => {
    if (!exam) return [];
    const startIndex = (theoryCurrentPage - 1) * QUESTIONS_PER_PAGE;
    const endIndex = startIndex + QUESTIONS_PER_PAGE;
    return exam.theoryQuestions.slice(startIndex, endIndex);
  }, [exam, theoryCurrentPage]);
  // --- END PAGINATION LOGIC ---

  // --- CRUD Handlers (modified to reset page) ---
  const handleObjectiveSubmit = (question: Question) => {
    if (!exam) return;
    if (modalMode === 'obj-edit') {
      const updatedQuestions = exam.objectiveQuestions.map(q =>
        q.id === question.id ? question : q
      );
      setExam({ ...exam, objectiveQuestions: updatedQuestions });
    } else {
      setExam({ ...exam, objectiveQuestions: [...exam.objectiveQuestions, question] });
      setObjCurrentPage(1); // Go to first page on add
    }
    showNotification('Success', 'Objective question saved!', 'success');
  };

  const handleDeleteObjective = () => {
    if (!exam || !selectedQuestion) return;
    setExam({
      ...exam,
      objectiveQuestions: exam.objectiveQuestions.filter(q => q.id !== selectedQuestion.id),
    });
    setObjCurrentPage(1); // Go to first page on delete
    showNotification('Success', 'Objective question deleted!', 'success');
    closeModals();
  };

  const handleTheorySubmit = (question: TheoryQuestion) => {
    if (!exam) return;
    if (modalMode === 'theory-edit') {
      const updatedQuestions = exam.theoryQuestions.map(q =>
        q.id === question.id ? question : q
      );
      setExam({ ...exam, theoryQuestions: updatedQuestions });
    } else {
      setExam({ ...exam, theoryQuestions: [...exam.theoryQuestions, question] });
      setTheoryCurrentPage(1); // Go to first page on add
    }
    showNotification('Success', 'Theory question saved!', 'success');
  };

  const handleDeleteTheory = () => {
    if (!exam || !selectedQuestion) return;
    setExam({
      ...exam,
      theoryQuestions: exam.theoryQuestions.filter(q => q.id !== selectedQuestion.id),
    });
    setTheoryCurrentPage(1); // Go to first page on delete
    showNotification('Success', 'Theory question deleted!', 'success');
    closeModals();
  };

  const closeModals = () => {
    setModalMode(null);
    setDeleteMode(null);
    setSelectedQuestion(null);
  };

  if (!exam) {
    return (
      <AdminLayout title="Loading...">
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          Loading Exam Bank...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Manage: ${exam.subject}`}>
      <div className={styles.pageGrid}>
        {/* --- Column 1: Objectives --- */}
        <Card>
          <CardHeader>
            <div className={styles.header}>
              <CardTitle>Objective Questions ({exam.objectiveQuestions.length})</CardTitle>
              <Button
                variant="primary"
                className={styles.addButton}
                onClick={() => setModalMode('obj-add')}
              >
                <Icons.Plus className={styles.addButtonIcon} /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ul className={styles.questionList}>
              {/* --- 5. UPDATED MAP --- */}
              {paginatedObjectives.map((q, index) => {
                const questionNumber = ((objCurrentPage - 1) * QUESTIONS_PER_PAGE) + index + 1;
                return (
                  <li key={q.id} className={styles.questionItem}>
                    <span className={styles.questionNumber}>{questionNumber}.</span>
                    <p className={styles.questionText}>{q.question}</p>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => { setSelectedQuestion(q); setModalMode('obj-edit'); }}
                      >
                        <Icons.Pencil className={styles.icon} />
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => { setSelectedQuestion(q); setDeleteMode('obj'); }}
                      >
                        <Icons.Trash className={styles.icon} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            {/* --- 6. ADD PAGINATION --- */}
            <div className={styles.paginationWrapper}>
              <Pagination
                totalItems={exam.objectiveQuestions.length}
                itemsPerPage={QUESTIONS_PER_PAGE}
                currentPage={objCurrentPage}
                onPageChange={setObjCurrentPage}
              />
            </div>
          </CardContent>
        </Card>

        {/* --- Column 2: Theory --- */}
        <Card>
          <CardHeader>
            <div className={styles.header}>
              <CardTitle>Theory Questions ({exam.theoryQuestions.length})</CardTitle>
              <Button
                variant="primary"
                className={styles.addButton}
                onClick={() => setModalMode('theory-add')}
              >
                <Icons.Plus className={styles.addButtonIcon} /> Add
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ul className={styles.questionList}>
              {/* --- 5. UPDATED MAP --- */}
              {paginatedTheory.map((q, index) => {
                const questionNumber = ((theoryCurrentPage - 1) * QUESTIONS_PER_PAGE) + index + 1;
                return (
                  <li key={q.id} className={styles.questionItem}>
                    <span className={styles.questionNumber}>{questionNumber}.</span>
                    <p className={styles.questionText}>{q.question}</p>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => { setSelectedQuestion(q); setModalMode('theory-edit'); }}
                      >
                        <Icons.Pencil className={styles.icon} />
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => { setSelectedQuestion(q); setDeleteMode('theory'); }}
                      >
                        <Icons.Trash className={styles.icon} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
            {/* --- 6. ADD PAGINATION --- */}
            <div className={styles.paginationWrapper}>
              <Pagination
                totalItems={exam.theoryQuestions.length}
                itemsPerPage={QUESTIONS_PER_PAGE}
                currentPage={theoryCurrentPage}
                onPageChange={setTheoryCurrentPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- Modals (unchanged) --- */}
      <Modal
        isOpen={modalMode === 'obj-add' || modalMode === 'obj-edit'}
        onClose={closeModals}
        title={modalMode === 'obj-edit' ? 'Edit Objective Question' : 'Add Objective Question'}
      >
        <ObjectiveQuestionForm
          onClose={closeModals}
          onSubmit={handleObjectiveSubmit}
          questionToEdit={modalMode === 'obj-edit' ? (selectedQuestion as Question) : null}
        />
      </Modal>

      <Modal
        isOpen={modalMode === 'theory-add' || modalMode === 'theory-edit'}
        onClose={closeModals}
        title={modalMode === 'theory-edit' ? 'Edit Theory Question' : 'Add Theory Question'}
      >
        <TheoryQuestionForm
          onClose={closeModals}
          onSubmit={handleTheorySubmit}
          questionToEdit={modalMode === 'theory-edit' ? (selectedQuestion as TheoryQuestion) : null}
        />
      </Modal>

      <Modal
        isOpen={deleteMode !== null}
        onClose={closeModals}
        title="Confirm Deletion"
      >
        <DeleteModal
          studentName="this question"
          onClose={closeModals}
          onConfirm={deleteMode === 'obj' ? handleDeleteObjective : handleDeleteTheory}
        />
      </Modal>
    </AdminLayout>
  );
}