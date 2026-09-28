import React, { useEffect, useMemo, useState } from "react";
import api from "../utils/api";

const AdminFeedback = () => {
  console.log("🔥 ADMIN FEEDBACK PAGE LOADED");

  const [feedbackList, setFeedbackList] = useState([]);
  const [ratingFilter, setRatingFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD FEEDBACK
  // =====================================================

  useEffect(() => {
    const loadFeedback = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("🔥 Calling GET /feedback");

        const response = await api.get("/feedback");

        console.log("🔥 COMPLETE ADMIN FEEDBACK RESPONSE:", response);

        // -------------------------------------------------
        // BACKEND RESPONSE:
        //
        // {
        //   success: true,
        //   data: {
        //     feedback: [],
        //     analytics: {}
        //   }
        // }
        // -------------------------------------------------

       const feedbackData =
  response?.data?.data?.feedback ||
  response?.data?.feedback ||
  response?.feedback ||
  [];
        console.log(
          "🔥 EXTRACTED FEEDBACK LIST:",
          feedbackData
        );

        console.log(
          "🔥 FEEDBACK COUNT:",
          feedbackData.length
        );

        setFeedbackList(
          Array.isArray(feedbackData)
            ? feedbackData
            : []
        );
      } catch (error) {
        console.error(
          "❌ Unable to load admin feedback:",
          error
        );

        console.error(
          "❌ Error response:",
          error?.response
        );

        setFeedbackList([]);

        setError(
          error?.message ||
            "Unable to load feedback."
        );
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, []);

  // =====================================================
  // NORMALIZE BACKEND DATA
  // =====================================================

  const normalizedFeedback = useMemo(() => {
    return feedbackList.map((fb) => {
      return {
        id:
          fb.referenceId ||
          fb.id ||
          fb._id ||
          "N/A",

        complaintId:
          fb.complaintReferenceId ||
          fb.complaint?.referenceId ||
          fb.complaintId ||
          "N/A",

        rating: Number(fb.rating) || 0,

        category:
          fb.category ||
          fb.complaint?.category ||
          "General",

        comment:
          fb.comment ||
          "",

        anonymous:
          Boolean(fb.anonymous),

        date:
          fb.createdAt
            ? new Date(
                fb.createdAt
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )
            : fb.date || "N/A",

        submittedBy:
          fb.submittedBy?.name ||
          fb.submittedBy?.email ||
          (fb.anonymous
            ? "Anonymous"
            : "Registered User"),
      };
    });
  }, [feedbackList]);

  // =====================================================
  // ANALYTICS
  // =====================================================

  const totalFeedback =
    normalizedFeedback.length;

  const avgRating =
    totalFeedback > 0
      ? (
          normalizedFeedback.reduce(
            (sum, fb) =>
              sum + Number(fb.rating),
            0
          ) / totalFeedback
        ).toFixed(1)
      : "0.0";

  const anonymousCount =
    normalizedFeedback.filter(
      (fb) => fb.anonymous
    ).length;

  // =====================================================
  // FILTER
  // =====================================================

  const filteredFeedback =
    normalizedFeedback.filter((fb) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        fb.id
          .toLowerCase()
          .includes(searchText) ||
        fb.complaintId
          .toLowerCase()
          .includes(searchText) ||
        fb.comment
          .toLowerCase()
          .includes(searchText) ||
        fb.category
          .toLowerCase()
          .includes(searchText);

      const matchesRating =
        ratingFilter === "All" ||
        String(fb.rating) ===
          String(ratingFilter);

      const matchesCategory =
        categoryFilter === "All" ||
        fb.category === categoryFilter;

      return (
        matchesSearch &&
        matchesRating &&
        matchesCategory
      );
    });

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setRatingFilter("All");
    setCategoryFilter("All");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div
        style={{
          minHeight:
            "calc(100vh - 64px)",
          backgroundColor:
            "#030712",
          color: "#ffffff",
          padding: "60px 20px",
          fontFamily:
            "sans-serif",
          textAlign: "center",
        }}
      >
        <h2>
          Loading feedback...
        </h2>

        <p
          style={{
            color: "#9ca3af",
          }}
        >
          Please wait while feedback
          records are loaded.
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div
        style={{
          minHeight:
            "calc(100vh - 64px)",
          backgroundColor:
            "#030712",
          color: "#ffffff",
          padding: "60px 20px",
          fontFamily:
            "sans-serif",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            color: "#ef4444",
          }}
        >
          Unable to load feedback
        </h2>

        <p
          style={{
            color: "#9ca3af",
            marginBottom: "20px",
          }}
        >
          {error}
        </p>

        <button
          onClick={() =>
            window.location.reload()
          }
          style={{
            padding:
              "10px 18px",
            background:
              "#10b981",
            color: "#ffffff",
            border: "none",
            borderRadius:
              "8px",
            cursor: "pointer",
            fontWeight:
              "bold",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div
      style={{
        minHeight:
          "calc(100vh - 64px)",
        backgroundColor:
          "#030712",
        color: "#ffffff",
        padding:
          "32px 20px",
        fontFamily:
          "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth:
            "1200px",
          margin:
            "0 auto",
        }}
      >

        {/* =================================================
            TITLE
        ================================================= */}

        <div
          style={{
            marginBottom:
              "24px",
          }}
        >
          <span
            style={{
              fontSize:
                "11px",
              background:
                "rgba(16, 185, 129, 0.1)",
              color:
                "#10b981",
              border:
                "1px solid rgba(16, 185, 129, 0.3)",
              padding:
                "4px 10px",
              borderRadius:
                "4px",
              textTransform:
                "uppercase",
              fontWeight:
                "bold",
            }}
          >
            ADMIN ANALYTICS
          </span>

          <h1
            style={{
              fontSize:
                "28px",
              fontWeight:
                "bold",
              margin:
                "8px 0 0 0",
            }}
          >
            Student Feedback & Analytics
          </h1>

          <p
            style={{
              color:
                "#9ca3af",
              marginTop:
                "8px",
            }}
          >
            Review feedback submitted
            by students for resolved
            complaints.
          </p>
        </div>

        {/* =================================================
            ANALYTICS CARDS
        ================================================= */}

        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap:
              "16px",
            marginBottom:
              "32px",
          }}
        >

          {/* Average Rating */}

          <div
            style={{
              background:
                "#111827",
              border:
                "1px solid #1f2937",
              padding:
                "20px",
              borderRadius:
                "12px",
            }}
          >
            <span
              style={{
                color:
                  "#9ca3af",
                fontSize:
                  "12px",
                fontWeight:
                  "bold",
                textTransform:
                  "uppercase",
              }}
            >
              Average Rating
            </span>

            <div
              style={{
                fontSize:
                  "28px",
                fontWeight:
                  "bold",
                marginTop:
                  "4px",
                color:
                  "#10b981",
                display:
                  "flex",
                alignItems:
                  "center",
                gap:
                  "8px",
              }}
            >
              {avgRating}

              <span
                style={{
                  fontSize:
                    "20px",
                }}
              >
                ⭐
              </span>
            </div>
          </div>

          {/* Total */}

          <div
            style={{
              background:
                "#111827",
              border:
                "1px solid #1f2937",
              padding:
                "20px",
              borderRadius:
                "12px",
            }}
          >
            <span
              style={{
                color:
                  "#38bdf8",
                fontSize:
                  "12px",
                fontWeight:
                  "bold",
                textTransform:
                  "uppercase",
              }}
            >
              Total Submissions
            </span>

            <div
              style={{
                fontSize:
                  "28px",
                fontWeight:
                  "bold",
                marginTop:
                  "4px",
                color:
                  "#ffffff",
              }}
            >
              {totalFeedback}
            </div>
          </div>

          {/* Anonymous */}

          <div
            style={{
              background:
                "#111827",
              border:
                "1px solid #1f2937",
              padding:
                "20px",
              borderRadius:
                "12px",
            }}
          >
            <span
              style={{
                color:
                  "#facc15",
                fontSize:
                  "12px",
                fontWeight:
                  "bold",
                textTransform:
                  "uppercase",
              }}
            >
              Anonymous Submissions
            </span>

            <div
              style={{
                fontSize:
                  "28px",
                fontWeight:
                  "bold",
                marginTop:
                  "4px",
                color:
                  "#facc15",
              }}
            >
              {anonymousCount}
            </div>
          </div>
        </div>

        {/* =================================================
            FILTERS
        ================================================= */}

        <div
          style={{
            background:
              "#111827",
            border:
              "1px solid #1f2937",
            padding:
              "16px",
            borderRadius:
              "12px",
            marginBottom:
              "24px",
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(180px, 1fr))",
            gap:
              "12px",
          }}
        >

          {/* Search */}

          <input
            type="text"
            placeholder="Search Feedback ID, Complaint ID..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            style={{
              padding:
                "10px 12px",
              background:
                "#090d16",
              border:
                "1px solid #374151",
              color:
                "#ffffff",
              borderRadius:
                "8px",
              fontSize:
                "13px",
              outline:
                "none",
            }}
          />

          {/* Rating */}

          <select
            value={
              ratingFilter
            }
            onChange={(e) =>
              setRatingFilter(
                e.target.value
              )
            }
            style={{
              padding:
                "10px 12px",
              background:
                "#090d16",
              border:
                "1px solid #374151",
              color:
                "#ffffff",
              borderRadius:
                "8px",
              fontSize:
                "13px",
              outline:
                "none",
            }}
          >
            <option value="All">
              All Ratings
            </option>

            <option value="5">
              5 Stars ⭐⭐⭐⭐⭐
            </option>

            <option value="4">
              4 Stars ⭐⭐⭐⭐
            </option>

            <option value="3">
              3 Stars ⭐⭐⭐
            </option>

            <option value="2">
              2 Stars ⭐⭐
            </option>

            <option value="1">
              1 Star ⭐
            </option>
          </select>

          {/* Category */}

          <select
            value={
              categoryFilter
            }
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
            style={{
              padding:
                "10px 12px",
              background:
                "#090d16",
              border:
                "1px solid #374151",
              color:
                "#ffffff",
              borderRadius:
                "8px",
              fontSize:
                "13px",
              outline:
                "none",
            }}
          >
            <option value="All">
              All Categories
            </option>

            <option value="Library">
              Library
            </option>

            <option value="Hostel">
              Hostel
            </option>

            <option value="Canteen">
              Canteen
            </option>

            <option value="Academic">
              Academic
            </option>

            <option value="Infrastructure">
              Infrastructure
            </option>

            <option value="Transport">
              Transport
            </option>

            <option value="Administration">
              Administration
            </option>

            <option value="Other">
              Other
            </option>

            <option value="General">
              General
            </option>
          </select>

          {/* Clear */}

          <button
            onClick={
              clearFilters
            }
            style={{
              padding:
                "10px 16px",
              background:
                "#1f2937",
              color:
                "#10b981",
              border:
                "1px solid #374151",
              borderRadius:
                "8px",
              fontSize:
                "13px",
              fontWeight:
                "bold",
              cursor:
                "pointer",
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* =================================================
            COUNTER
        ================================================= */}

        <div
          style={{
            marginBottom:
              "16px",
            color:
              "#9ca3af",
            fontSize:
              "14px",
            fontWeight:
              "600",
          }}
        >
          Showing{" "}
          <strong
            style={{
              color:
                "#10b981",
            }}
          >
            {
              filteredFeedback.length
            }
          </strong>{" "}
          of{" "}
          <strong>
            {totalFeedback}
          </strong>{" "}
          feedback submissions
        </div>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {filteredFeedback.length ===
        0 ? (
          <div
            style={{
              background:
                "#111827",
              border:
                "1px solid #1f2937",
              padding:
                "48px",
              borderRadius:
                "12px",
              textAlign:
                "center",
            }}
          >
            <div
              style={{
                fontSize:
                  "40px",
                marginBottom:
                  "12px",
              }}
            >
              📭
            </div>

            <h3
              style={{
                fontSize:
                  "18px",
                color:
                  "#ffffff",
                margin:
                  "0 0 8px 0",
              }}
            >
              No feedback entries found
            </h3>

            <p
              style={{
                fontSize:
                  "14px",
                color:
                  "#9ca3af",
                margin:
                  "0 0 20px 0",
              }}
            >
              Try clearing your
              filters or check
              back once students
              submit feedback.
            </p>

            <button
              onClick={
                clearFilters
              }
              style={{
                padding:
                  "10px 18px",
                background:
                  "#10b981",
                color:
                  "#ffffff",
                border:
                  "none",
                borderRadius:
                  "8px",
                cursor:
                  "pointer",
                fontWeight:
                  "bold",
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (

          /* =================================================
             FEEDBACK TABLE
          ================================================= */

          <div
            style={{
              overflowX:
                "auto",
              background:
                "#111827",
              border:
                "1px solid #1f2937",
              borderRadius:
                "12px",
            }}
          >
            <table
              style={{
                width:
                  "100%",
                borderCollapse:
                  "collapse",
                textAlign:
                  "left",
                fontSize:
                  "14px",
              }}
            >

              <thead>
                <tr
                  style={{
                    borderBottom:
                      "1px solid #1f2937",
                    color:
                      "#6b7280",
                    fontSize:
                      "12px",
                    textTransform:
                      "uppercase",
                  }}
                >
                  <th
                    style={{
                      padding:
                        "16px",
                    }}
                  >
                    FB Reference
                  </th>

                  <th
                    style={{
                      padding:
                        "16px",
                    }}
                  >
                    Complaint ID
                  </th>

                  <th
                    style={{
                      padding:
                        "16px",
                    }}
                  >
                    Rating
                  </th>

                  <th
                    style={{
                      padding:
                        "16px",
                    }}
                  >
                    Category
                  </th>

                  <th
                    style={{
                      padding:
                        "16px",
                    }}
                  >
                    Comment
                  </th>

                  <th
                    style={{
                      padding:
                        "16px",
                    }}
                  >
                    Mode
                  </th>

                  <th
                    style={{
                      padding:
                        "16px",
                    }}
                  >
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredFeedback.map(
                  (fb) => (
                    <tr
                      key={
                        fb.id
                      }
                      style={{
                        borderBottom:
                          "1px solid #1f2937",
                      }}
                    >

                      {/* FB ID */}

                      <td
                        style={{
                          padding:
                            "16px",
                          color:
                            "#10b981",
                          fontWeight:
                            "bold",
                        }}
                      >
                        {fb.id}
                      </td>

                      {/* Complaint ID */}

                      <td
                        style={{
                          padding:
                            "16px",
                          color:
                            "#38bdf8",
                          fontWeight:
                            "bold",
                        }}
                      >
                        {fb.complaintId}
                      </td>

                      {/* Rating */}

                      <td
                        style={{
                          padding:
                            "16px",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        <span
                          style={{
                            color:
                              "#facc15",
                          }}
                        >
                          {"⭐".repeat(
                            fb.rating
                          )}
                        </span>

                        <span
                          style={{
                            marginLeft:
                              "8px",
                            color:
                              "#9ca3af",
                          }}
                        >
                          {fb.rating}/5
                        </span>
                      </td>

                      {/* Category */}

                      <td
                        style={{
                          padding:
                            "16px",
                          color:
                            "#d1d5db",
                        }}
                      >
                        {fb.category}
                      </td>

                      {/* Comment */}

                      <td
                        style={{
                          padding:
                            "16px",
                          color:
                            "#9ca3af",
                          maxWidth:
                            "300px",
                        }}
                      >
                        {fb.comment
                          ? `"${fb.comment}"`
                          : "No comment"}
                      </td>

                      {/* Mode */}

                      <td
                        style={{
                          padding:
                            "16px",
                        }}
                      >
                        {fb.anonymous ? (
                          <span
                            style={{
                              padding:
                                "4px 8px",
                              borderRadius:
                                "6px",
                              fontSize:
                                "11px",
                              fontWeight:
                                "bold",
                              background:
                                "rgba(234, 179, 8, 0.15)",
                              color:
                                "#facc15",
                              border:
                                "1px solid rgba(234, 179, 8, 0.3)",
                            }}
                          >
                            🔒 Anonymous
                          </span>
                        ) : (
                          <span
                            style={{
                              padding:
                                "4px 8px",
                              borderRadius:
                                "6px",
                              fontSize:
                                "11px",
                              fontWeight:
                                "bold",
                              background:
                                "rgba(56, 189, 248, 0.15)",
                              color:
                                "#38bdf8",
                              border:
                                "1px solid rgba(56, 189, 248, 0.3)",
                            }}
                          >
                            👤 Registered User
                          </span>
                        )}
                      </td>

                      {/* Date */}

                      <td
                        style={{
                          padding:
                            "16px",
                          color:
                            "#6b7280",
                          whiteSpace:
                            "nowrap",
                        }}
                      >
                        {fb.date}
                      </td>

                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminFeedback;