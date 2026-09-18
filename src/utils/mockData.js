const COMPLAINT_STORAGE_KEY = "cfms_complaints";

const initialComplaints = [
  {
    id: "CMP-1001",
    subject: "Wi-Fi connectivity issue in Hostel B",
    title: "Wi-Fi connectivity issue in Hostel B",
    category: "Hostel",
    status: "Pending",
    date: "2026-08-25",
    priority: "High",

    description:
      "No internet connection on the 3rd floor.",

    // Staff assignment
    assignedTo: "",
    assignedStaffId: "",
    assignedBy: "",
    assignedDate: "",

    // Resolution information
    resolutionNote: "",
    proofImage: "",
    proofImageName: "",
    completedBy: "",
    completedById: "",
    completedDate: "",

    // Last update information
    lastUpdatedBy: "",
    lastUpdatedAt: "",
  },
];


/* =========================================================
   GET ALL COMPLAINTS
========================================================= */

export const getStoredComplaints = () => {
  const stored = localStorage.getItem(
    COMPLAINT_STORAGE_KEY
  );

  // First time opening application
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

    console.error(
      "Error reading complaints:",
      error
    );

    return [];
  }
};


/* =========================================================
   SAVE NEW COMPLAINT
========================================================= */

export const saveComplaint = (
  newComplaint
) => {

  const current =
    getStoredComplaints();

  const updated = [
    newComplaint,
    ...current,
  ];

  localStorage.setItem(
    COMPLAINT_STORAGE_KEY,
    JSON.stringify(updated)
  );

  // Notify other dashboard components
  window.dispatchEvent(
    new Event(
      "cfms-complaints-updated"
    )
  );

  return newComplaint;
};


/* =========================================================
   UPDATE COMPLETE COMPLAINT
========================================================= */

export const updateComplaint = (
  id,
  updates
) => {

  const current =
    getStoredComplaints();

  const updated = current.map(
    (complaint) =>
      complaint.id === id
        ? {
            ...complaint,
            ...updates,
            lastUpdatedAt:
              new Date().toISOString(),
          }
        : complaint
  );

  localStorage.setItem(
    COMPLAINT_STORAGE_KEY,
    JSON.stringify(updated)
  );

  window.dispatchEvent(
    new Event(
      "cfms-complaints-updated"
    )
  );

  return updated;
};


/* =========================================================
   UPDATE COMPLAINT STATUS
========================================================= */

export const updateComplaintStatus = (
  id,
  newStatus
) => {

  return updateComplaint(
    id,
    {
      status: newStatus,
    }
  );
};


/* =========================================================
   ASSIGN COMPLAINT TO STAFF
========================================================= */

export const assignComplaintToStaff = (
  id,
  staffName,
  staffId = "",
  assignedBy = "Admin"
) => {

  return updateComplaint(
    id,
    {
      assignedTo: staffName,
      assignedStaffId: staffId,
      assignedBy: assignedBy,
      assignedDate:
        new Date().toISOString(),
      status: "Pending",
    }
  );
};


/* =========================================================
   REMOVE STAFF ASSIGNMENT
========================================================= */

export const unassignComplaint = (
  id
) => {

  return updateComplaint(
    id,
    {
      assignedTo: "",
      assignedStaffId: "",
      assignedBy: "",
      assignedDate: "",
    }
  );
};


/* =========================================================
   UPDATE STAFF RESOLUTION
========================================================= */

export const updateComplaintResolution = (
  id,
  resolutionData
) => {

  return updateComplaint(
    id,
    {
      ...resolutionData,

      status:
        resolutionData.status ||
        "Completed",

      completedDate:
        resolutionData.completedDate ||
        new Date().toISOString(),
    }
  );
};


/* =========================================================
   DELETE COMPLAINT
========================================================= */

export const deleteComplaint = (
  id
) => {

  const current =
    getStoredComplaints();

  const updated =
    current.filter(
      (complaint) =>
        complaint.id !== id
    );

  localStorage.setItem(
    COMPLAINT_STORAGE_KEY,
    JSON.stringify(updated)
  );

  window.dispatchEvent(
    new Event(
      "cfms-complaints-updated"
    )
  );

  return updated;
};