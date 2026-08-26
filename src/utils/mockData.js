export const INITIAL_COMPLAINTS = [
  {
    id: "CFMS-2026-00125",
    category: "Library",
    subject: "Library timing issue",
    description: "The main reading room closes at 8 PM instead of the official 10 PM timing.",
    priority: "Medium",
    status: "Pending",
    date: "2026-08-25",
    attachmentName: null
  },
  {
    id: "CFMS-2026-00126",
    category: "Hostel",
    subject: "Water supply issue",
    description: "Frequent water shortage on the 3rd floor of Block-B during morning hours.",
    priority: "High",
    status: "In Progress",
    date: "2026-08-24",
    attachmentName: "water_issue_photo.jpg"
  },
  {
    id: "CFMS-2026-00127",
    category: "Canteen",
    subject: "Food quality complaint",
    description: "Uncooked food served during afternoon lunch session.",
    priority: "Low",
    status: "Resolved",
    date: "2026-08-22",
    attachmentName: null
  }
];

export const getStoredComplaints = () => {
  const data = localStorage.getItem('cfms_complaints');
  if (!data) {
    localStorage.setItem('cfms_complaints', JSON.stringify(INITIAL_COMPLAINTS));
    return INITIAL_COMPLAINTS;
  }
  return JSON.parse(data);
};

export const saveComplaint = (newComplaint) => {
  const current = getStoredComplaints();
  const updated = [newComplaint, ...current];
  localStorage.setItem('cfms_complaints', JSON.stringify(updated));
  return updated;
};