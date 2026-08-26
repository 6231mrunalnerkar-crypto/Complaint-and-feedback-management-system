const COMPLAINT_STORAGE_KEY = 'cfms_complaints';

const initialComplaints = [
  {
    id: 'CMP-1001',
    subject: 'Wi-Fi connectivity issue in Hostel B',
    category: 'Hostel',
    status: 'Pending',
    date: '2026-08-25',
    priority: 'High',
    description: 'No internet connection on the 3rd floor.'
  }
];

export const getStoredComplaints = () => {
  const stored = localStorage.getItem(COMPLAINT_STORAGE_KEY);
  let list = initialComplaints;

  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Deduplicate by ID
      const map = new Map();
      [...parsed, ...initialComplaints].forEach((item) => {
        if (!map.has(item.id)) {
          map.set(item.id, item);
        }
      });
      list = Array.from(map.values());
    } catch (e) {
      list = initialComplaints;
    }
  } else {
    localStorage.setItem(COMPLAINT_STORAGE_KEY, JSON.stringify(initialComplaints));
  }

  return list;
};

export const saveComplaint = (newComplaint) => {
  const current = getStoredComplaints();
  const updated = [newComplaint, ...current];
  localStorage.setItem(COMPLAINT_STORAGE_KEY, JSON.stringify(updated));
};

export const updateComplaintStatus = (id, newStatus) => {
  const current = getStoredComplaints();
  const updated = current.map((c) =>
    c.id === id ? { ...c, status: newStatus } : c
  );
  localStorage.setItem(COMPLAINT_STORAGE_KEY, JSON.stringify(updated));
};