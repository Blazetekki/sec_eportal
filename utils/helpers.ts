// utils/helpers.ts

// This logic can be shared by the entire app
export const getRemark = (total: number): string => {
  if (total >= 75) return 'Excellent';
  if (total >= 60) return 'Good';
  if (total >= 45) return 'Pass';
  return 'Poor';
};