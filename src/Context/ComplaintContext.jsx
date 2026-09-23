import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  COMPLAINT_STATUS,
  COMPLAINT_PRIORITY,
  COMPLAINT_CATEGORY,
} from "../utils/complaintModel";

import api from "../services/api";

const ComplaintContext = createContext(null);

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD COMPLAINTS FROM BACKEND
  // --------------------------------------------------

  const loadComplaints = useCallback(async () => {
    const token = localStorage.getItem("cfms_token");

    // Guest users do not have access to the protected
    // complaints list endpoint.
    if (!token) {
      setComplaints([]);
      return [];
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.get("/complaints?limit=100");

      const list = response?.data?.complaints || [];

      setComplaints(list);

      return list;
    } catch (err) {
      console.error("Failed to load complaints:", err);
      setError(err.message || "Failed to load complaints");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load complaints when provider starts
  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  // --------------------------------------------------
  // ADD COMPLAINT
  // Guest + Student
  // --------------------------------------------------

  const addComplaint = useCallback(async (complaintRawData) => {
    try {
      setError("");

      const response = await api.post("/complaints", {
        title:
          complaintRawData.title ||
          complaintRawData.subject ||
          "Complaint",

        description: complaintRawData.description || "",

        category:
          complaintRawData.category ||
          COMPLAINT_CATEGORY.OTHER ||
          "Other",

        priority:
          complaintRawData.priority ||
          COMPLAINT_PRIORITY.MEDIUM ||
          "Medium",

        isAnonymous:
          Boolean(
            complaintRawData.isAnonymous ||
              complaintRawData.anonymous
          ),

        submittedBy: complaintRawData.submittedBy || undefined,

        studentName:
          complaintRawData.studentName ||
          complaintRawData.name ||
          "",

        email:
          complaintRawData.email ||
          complaintRawData.submittedBy?.email ||
          "",

        rollNumber:
          complaintRawData.rollNumber ||
          complaintRawData.submittedBy?.rollNumber ||
          "",

        phone:
          complaintRawData.phone ||
          "",
      });

      const newComplaint = response?.data?.complaint;

      if (newComplaint) {
        setComplaints((prev) => [
          newComplaint,
          ...prev,
        ]);
      }

      return newComplaint;
    } catch (err) {
      console.error("Failed to add complaint:", err);
      setError(err.message || "Failed to submit complaint");
      throw err;
    }
  }, []);

  // --------------------------------------------------
  // GET COMPLAINT BY ID / REFERENCE ID
  // --------------------------------------------------

  const getComplaintById = useCallback(async (id) => {
    if (!id || typeof id !== "string") {
      return null;
    }

    try {
      setError("");

      const cleanId = id.trim();

      // Public tracking using reference ID
      if (cleanId.toUpperCase().startsWith("CMP-")) {
        const response = await api.get(
          `/complaints/track/${encodeURIComponent(cleanId)}`
        );

        return response?.data?.complaint || null;
      }

      // Authenticated complaint lookup
      const response = await api.get(
        `/complaints/${encodeURIComponent(cleanId)}`
      );

      return response?.data?.complaint || null;
    } catch (err) {
      console.error("Failed to get complaint:", err);
      setError(err.message || "Complaint not found");
      return null;
    }
  }, []);

  // --------------------------------------------------
  // GET COMPLAINTS OF CURRENT USER
  // --------------------------------------------------

  const getComplaintsByUser = useCallback(async () => {
    try {
      const token = localStorage.getItem("cfms_token");

      if (!token) {
        return [];
      }

      setError("");

      const response = await api.get(
        "/complaints?limit=100"
      );

      const list = response?.data?.complaints || [];

      setComplaints(list);

      return list;
    } catch (err) {
      console.error(
        "Failed to get user complaints:",
        err
      );

      setError(
        err.message || "Failed to load your complaints"
      );

      return [];
    }
  }, []);

  // --------------------------------------------------
  // GET COMPLAINTS ASSIGNED TO STAFF
  // --------------------------------------------------

  const getComplaintsByStaff = useCallback(async () => {
    try {
      const token = localStorage.getItem("cfms_token");

      if (!token) {
        return [];
      }

      setError("");

      const response = await api.get(
        "/complaints?limit=100"
      );

      const list = response?.data?.complaints || [];

      setComplaints(list);

      return list;
    } catch (err) {
      console.error(
        "Failed to get staff complaints:",
        err
      );

      setError(
        err.message || "Failed to load staff complaints"
      );

      return [];
    }
  }, []);

  // --------------------------------------------------
  // UPDATE STATUS
  // Staff + Admin
  // --------------------------------------------------

  const updateStatus = useCallback(
    async (
      id,
      newStatus,
      changedBy = "Admin",
      notes = ""
    ) => {
      if (
        !id ||
        !Object.values(COMPLAINT_STATUS).includes(
          newStatus
        )
      ) {
        console.warn(
          "Invalid ID or Status:",
          id,
          newStatus
        );

        return false;
      }

      try {
        setError("");

        const response = await api.patch(
          `/complaints/${encodeURIComponent(id)}/status`,
          {
            status: newStatus,
            notes:
              notes ||
              `Status changed to ${newStatus}`,
          }
        );

        const updatedComplaint =
          response?.data?.complaint;

        if (updatedComplaint) {
          setComplaints((prev) =>
            prev.map((complaint) =>
              complaint.id === id ||
              complaint._id === id ||
              complaint.referenceId === id
                ? updatedComplaint
                : complaint
            )
          );
        }

        return updatedComplaint || true;
      } catch (err) {
        console.error(
          "Failed to update status:",
          err
        );

        setError(
          err.message || "Failed to update status"
        );

        throw err;
      }
    },
    []
  );

  // --------------------------------------------------
  // UPDATE PRIORITY
  // Admin
  // --------------------------------------------------

  const updatePriority = useCallback(
    async (id, newPriority) => {
      if (
        !id ||
        !Object.values(COMPLAINT_PRIORITY).includes(
          newPriority
        )
      ) {
        console.warn(
          "Invalid ID or Priority:",
          id,
          newPriority
        );

        return false;
      }

      try {
        setError("");

        const response = await api.patch(
          `/complaints/${encodeURIComponent(id)}/priority`,
          {
            priority: newPriority,
          }
        );

        const updatedComplaint =
          response?.data?.complaint;

        if (updatedComplaint) {
          setComplaints((prev) =>
            prev.map((complaint) =>
              complaint.id === id ||
              complaint._id === id ||
              complaint.referenceId === id
                ? updatedComplaint
                : complaint
            )
          );
        }

        return updatedComplaint || true;
      } catch (err) {
        console.error(
          "Failed to update priority:",
          err
        );

        setError(
          err.message || "Failed to update priority"
        );

        throw err;
      }
    },
    []
  );

  // --------------------------------------------------
  // ASSIGN STAFF / DEPARTMENT
  // Admin
  // --------------------------------------------------

  const assignComplaint = useCallback(
    async (
      id,
      department,
      staffObject = null
    ) => {
      if (!id) {
        return false;
      }

      try {
        setError("");

        const staffId =
          staffObject?.id ||
          staffObject?._id ||
          staffObject?.userId ||
          null;

        const response = await api.patch(
          `/complaints/${encodeURIComponent(id)}/assign`,
          {
            staffId,
            department:
              department || undefined,
          }
        );

        const updatedComplaint =
          response?.data?.complaint;

        if (updatedComplaint) {
          setComplaints((prev) =>
            prev.map((complaint) =>
              complaint.id === id ||
              complaint._id === id ||
              complaint.referenceId === id
                ? updatedComplaint
                : complaint
            )
          );
        }

        return updatedComplaint || true;
      } catch (err) {
        console.error(
          "Failed to assign complaint:",
          err
        );

        setError(
          err.message || "Failed to assign complaint"
        );

        throw err;
      }
    },
    []
  );

  // --------------------------------------------------
  // ADD COMPLAINT UPDATE / RESPONSE
  // Staff + Admin
  // --------------------------------------------------

  const addComplaintUpdate = useCallback(
    async (id, responseData) => {
      if (
        !id ||
        !responseData ||
        !responseData.message
      ) {
        return false;
      }

      try {
        setError("");

        const response = await api.post(
          `/complaints/${encodeURIComponent(id)}/updates`,
          {
            message: responseData.message,
            isInternal:
              Boolean(responseData.isInternal),
          }
        );

        const updatedComplaint =
          response?.data?.complaint;

        if (updatedComplaint) {
          setComplaints((prev) =>
            prev.map((complaint) =>
              complaint.id === id ||
              complaint._id === id ||
              complaint.referenceId === id
                ? updatedComplaint
                : complaint
            )
          );
        }

        return updatedComplaint || true;
      } catch (err) {
        console.error(
          "Failed to add complaint update:",
          err
        );

        setError(
          err.message ||
            "Failed to add complaint update"
        );

        throw err;
      }
    },
    []
  );

  // --------------------------------------------------
  // RESOLVE COMPLAINT
  // Staff + Admin
  // --------------------------------------------------

  const resolveComplaint = useCallback(
    async (
      id,
      resolvedBy = "Staff",
      resolutionSummary = ""
    ) => {
      if (!id) {
        return false;
      }

      try {
        setError("");

        const response = await api.post(
          `/complaints/${encodeURIComponent(id)}/resolve`,
          {
            resolutionSummary:
              resolutionSummary ||
              "Resolved by department staff.",
          }
        );

        const updatedComplaint =
          response?.data?.complaint;

        if (updatedComplaint) {
          setComplaints((prev) =>
            prev.map((complaint) =>
              complaint.id === id ||
              complaint._id === id ||
              complaint.referenceId === id
                ? updatedComplaint
                : complaint
            )
          );
        }

        return updatedComplaint || true;
      } catch (err) {
        console.error(
          "Failed to resolve complaint:",
          err
        );

        setError(
          err.message || "Failed to resolve complaint"
        );

        throw err;
      }
    },
    []
  );

  // --------------------------------------------------
  // CLOSE COMPLAINT
  // Admin
  // --------------------------------------------------

  const closeComplaint = useCallback(
    async (
      id,
      closedBy = "Admin",
      notes = ""
    ) => {
      return updateStatus(
        id,
        COMPLAINT_STATUS.CLOSED,
        closedBy,
        notes || "Complaint closed"
      );
    },
    [updateStatus]
  );

  // --------------------------------------------------
  // FEEDBACK
  // --------------------------------------------------

  const addFeedback = useCallback(
    async (feedbackData) => {
      try {
        setError("");

        const response = await api.post(
          "/feedback",
          {
            rating: feedbackData.rating || 5,
            comment: feedbackData.comment || "",
            category:
              feedbackData.category || "General",
          }
        );

        const newFeedback =
          response?.data?.feedback;

        if (newFeedback) {
          setFeedback((prev) => [
            newFeedback,
            ...prev,
          ]);
        }

        return newFeedback;
      } catch (err) {
        console.error(
          "Failed to submit feedback:",
          err
        );

        setError(
          err.message || "Failed to submit feedback"
        );

        throw err;
      }
    },
    []
  );

  // --------------------------------------------------
  // CONTEXT VALUE
  // --------------------------------------------------

  const value = {
    complaints,
    feedback,
    loading,
    error,

    loadComplaints,

    addComplaint,
    getComplaintById,
    getComplaintsByUser,
    getComplaintsByStaff,

    updateStatus,
    updatePriority,
    assignComplaint,
    addComplaintUpdate,
    resolveComplaint,
    closeComplaint,

    addFeedback,

    COMPLAINT_STATUS,
    COMPLAINT_PRIORITY,
    COMPLAINT_CATEGORY,
  };

  return (
    <ComplaintContext.Provider value={value}>
      {children}
    </ComplaintContext.Provider>
  );
};

// --------------------------------------------------
// CUSTOM HOOK
// --------------------------------------------------

export const useComplaints = () => {
  const context = useContext(ComplaintContext);

  if (!context) {
    throw new Error(
      "useComplaints must be used within a ComplaintProvider"
    );
  }

  return context;
};

export default ComplaintContext;