const COMPLAINT_STORAGE_KEY = "cfms_complaints";

const initialComplaints = [
  {
    id: "CMP-1001",
    subject: "Wi-Fi connectivity issue in Hostel B",
    category: "Hostel",
    status: "Pending",
    date: "2026-08-25",
    priority: "High",
    description: "No internet connection on the 3rd floor.",
  },
];

// Fetch all complaints from localStorage
export const getStoredComplaints = () => {
  const stored = localStorage.getItem(COMPLAINT_STORAGE_KEY);

  // First time opening the application
  if (!stored) {
    localStorage.setItem(
      COMPLAINT_STORAGE_KEY,
      JSON.stringify(initialComplaints)
    );

    return initialComplaints;
  }

  try {
    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    // Remove duplicate complaints by ID
    const map = new Map();

    parsed.forEach((item) => {
      if (item?.id && !map.has(item.id)) {
        map.set(item.id, item);
      }
    });

    return Array.from(map.values());
  } catch (error) {
    console.error("Error reading complaints:", error);

    return [];
  }
};

// Save a new complaint
export const saveComplaint = (newComplaint) => {
  const current = getStoredComplaints();

  const updated = [newComplaint, ...current];

  localStorage.setItem(
    COMPLAINT_STORAGE_KEY,
    JSON.stringify(updated)
  );

  return newComplaint;
};

// Update complaint status
export const updateComplaintStatus = (id, newStatus) => {
  const current = getStoredComplaints();

  const updated = current.map((complaint) =>
    complaint.id === id
      ? {
          ...complaint,
          status: newStatus,
        }
      : complaint
  );

  localStorage.setItem(
    COMPLAINT_STORAGE_KEY,
    JSON.stringify(updated)
  );

  return updated;
};

// Delete complaint - Admin use
export const deleteComplaint = (id) => {
  const current = getStoredComplaints();

  const updated = current.filter(
    (complaint) => complaint.id !== id
  );

  localStorage.setItem(
    COMPLAINT_STORAGE_KEY,
    JSON.stringify(updated)
  );

  return updated;
};