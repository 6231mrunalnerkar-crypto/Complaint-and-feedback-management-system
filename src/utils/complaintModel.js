// src/utils/complaintModel.js

export const COMPLAINT_STATUS = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  REJECTED: 'Rejected',
  CLOSED: 'Closed',
};

export const COMPLAINT_PRIORITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

export const COMPLAINT_CATEGORY = {
  ACADEMIC: 'Academic',
  INFRASTRUCTURE: 'Infrastructure',
  HOSTEL: 'Hostel',
  LIBRARY: 'Library',
  CANTEEN: 'Canteen',
  TRANSPORTATION: 'Transportation',
  TECHNICAL: 'Technical',
  FACULTY: 'Faculty',
  ADMINISTRATION: 'Administration',
  OTHER: 'Other',
};

export function generateReferenceId() {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `CMP-${year}-${randomNum}`;
}

export function createComplaint(data = {}) {
  const now = new Date().toISOString();
  const refId = data.id || data.referenceId || generateReferenceId();

  return {
    id: refId,
    title: data.title || data.subject || '',
    description: data.description || '',
    category: data.category || COMPLAINT_CATEGORY.OTHER,
    priority: data.priority || COMPLAINT_PRIORITY.MEDIUM,
    status: data.status || COMPLAINT_STATUS.SUBMITTED,
    submitterType: data.submitterType || (data.isAnonymous ? 'anonymous' : 'student'),
    isAnonymous: Boolean(data.isAnonymous),
    submittedBy: {
      name: data.isAnonymous ? 'Anonymous' : (data.submittedBy?.name || data.studentName || 'Guest User'),
      email: data.isAnonymous ? '' : (data.submittedBy?.email || data.email || ''),
      rollNumber: data.submittedBy?.rollNumber || data.rollNumber || '',
      phone: data.submittedBy?.phone || data.phone || '',
    },
    assignedDepartment: data.assignedDepartment || 'Unassigned',
    assignedStaff: data.assignedStaff || null,
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now,
    resolvedAt: data.resolvedAt || null,
    responses: data.responses || [],
    statusHistory: data.statusHistory || [
      {
        status: data.status || COMPLAINT_STATUS.SUBMITTED,
        changedAt: data.createdAt || now,
        changedBy: data.isAnonymous ? 'Anonymous' : (data.submittedBy?.name || 'System'),
        notes: 'Complaint registered in system.',
      },
    ],
    resolutionDetails: data.resolutionDetails || {
      resolvedBy: null,
      resolutionSummary: '',
      feedbackRating: null,
      feedbackComments: '',
    },
  };
}