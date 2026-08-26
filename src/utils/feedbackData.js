// Key used for storing feedback items in localStorage
const FEEDBACK_STORAGE_KEY = 'cfms_feedbacks';

// Initial dummy feedback data
const initialFeedbacks = [
  {
    id: 'FB-101',
    complaintId: 'CFMS-2026-001',
    rating: 5,
    category: 'Library',
    comment: 'Resolved very quickly! Great service.',
    anonymous: false,
    date: '2026-08-20',
  },
];

// Fetch all feedbacks from localStorage
export const getStoredFeedback = () => {
  const stored = localStorage.getItem(FEEDBACK_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(initialFeedbacks));
    return initialFeedbacks;
  }
  return JSON.parse(stored);
};

// Save a new feedback entry
export const saveFeedback = (newFeedback) => {
  const feedbacks = getStoredFeedback();
  const feedbackWithId = {
    id: `FB-${Date.now().toString().slice(-4)}`,
    ...newFeedback,
  };
  const updated = [feedbackWithId, ...feedbacks];
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updated));
  return feedbackWithId;
};

// Check if feedback already exists for a specific complaint ID
export const hasSubmittedFeedback = (complaintId) => {
  if (!complaintId) return false;
  const feedbacks = getStoredFeedback();
  return feedbacks.some(
    (fb) => fb.complaintId.toLowerCase() === complaintId.trim().toLowerCase()
  );
};