// components/admin/StudentModal.tsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import { Button } from '../shared/Button';
import styles from './StudentModal.module.css';
import { useAuth } from '@/contexts/AuthContext';
import { StudentRecord } from '@/data/types';
import { Icons } from '../shared/Icons';

type StudentModalProps = {
  onClose: () => void;
  onAddStudent: (newStudent: StudentRecord) => void;
  onEditStudent: (updatedStudent: StudentRecord) => void; // <-- NEW
  studentToEdit: StudentRecord | null; // <-- NEW
};

const CLASS_OPTIONS = [
  'JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3'
];

export const StudentModal = ({
  onClose,
  onAddStudent,
  onEditStudent,
  studentToEdit,
}: StudentModalProps) => {
  const { showNotification } = useAuth();

  const [name, setName] = useState('');
  const [regNo, setRegNo] = useState('');
  const [className, setClassName] = useState(CLASS_OPTIONS[0]);
  const [address, setAddress] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // --- NEW: Check for "Edit Mode" ---
  const isEditMode = studentToEdit !== null;

  // --- NEW: Pre-fill form if in Edit Mode ---
  useEffect(() => {
    if (isEditMode) {
      setName(studentToEdit.name);
      setRegNo(studentToEdit.regNo);
      setClassName(studentToEdit.class);
      setAddress(studentToEdit.address || '');
      setParentPhone(studentToEdit.parentPhone || '');
      setImagePreview(studentToEdit.photo || null);
    }
  }, [studentToEdit, isEditMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !regNo) {
      showNotification('Error', 'Please fill out Name and Registration No.', 'error');
      return;
    }

    // --- NEW: Handle both Edit and Add ---
    if (isEditMode) {
      // We are Editing
      const updatedStudent: StudentRecord = {
        ...studentToEdit, // This preserves the original ID
        name,
        regNo,
        class: className,
        address: address || undefined,
        parentPhone: parentPhone || undefined,
        photo: imagePreview || undefined,
      };
      onEditStudent(updatedStudent);
    } else {
      // We are Adding
      const newStudent: StudentRecord = {
        id: crypto.randomUUID(),
        name,
        regNo,
        class: className,
        address: address || undefined,
        parentPhone: parentPhone || undefined,
        photo: imagePreview || undefined,
      };
      onAddStudent(newStudent);
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name" className={styles.label}>
          Student Name *
        </label>
        <input
          id="name"
          type="text"
          className={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Peter Adenugba"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="regNo" className={styles.label}>
          Registration Number *
        </label>
        <input
          id="regNo"
          type="text"
          className={styles.input}
          value={regNo}
          onChange={(e) => setRegNo(e.target.value)}
          placeholder="e.g., SS2A003"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="class" className={styles.label}>
          Class
        </label>
        <select
          id="class"
          className={styles.select}
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        >
          {CLASS_OPTIONS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="parentPhone" className={styles.label}>
          Parent's Phone Number
        </label>
        <input
          id="parentPhone"
          type="tel"
          className={styles.input}
          value={parentPhone}
          onChange={(e) => setParentPhone(e.target.value)}
          placeholder="e.g., 08012345678"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="address" className={styles.label}>
          Address
        </label>
        <textarea
          id="address"
          className={styles.textarea}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Student's home address"
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>
          Student Photo (Optional)
        </label>
        <div className={styles.fileInputWrapper}>
          <div className={styles.fileInputPreview}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" />
            ) : (
              <Icons.User className="w-5 h-5" />
            )}
          </div>
          <label htmlFor="photo" className={styles.fileInputLabel}>
            Choose File
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <span className={styles.fileName}>
            {imageFile ? imageFile.name : 'No file selected...'}
          </span>
        </div>
      </div>

      <div className={styles.buttonWrapper}>
        <Button type="submit" variant="primary" className="w-auto">
          {/* --- NEW: Dynamic Button Text --- */}
          {isEditMode ? 'Update Student' : 'Save Student'}
        </Button>
      </div>
    </form>
  );
};