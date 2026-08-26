import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoredComplaints } from '../utils/mockData';
import { hasSubmittedFeedback } from '../utils/feedbackData';

const MyComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    setComplaints(getStoredComplaints());
  }, []);

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: '#030712', color: '#ffffff', padding: '32px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>My Complaints</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {complaints.map((c) => {
            const isResolved = c.status === 'Resolved';
            const feedbackDone = hasSubmittedFeedback(c.id);

            return (
              <div key={c.id} style={{ background: '#111827', border: '1px solid #1f2937', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 'bold' }}>{c.id}</span>
                  <h3 style={{ fontSize: '16px', margin: '4px 0', color: '#ffffff' }}>{c.subject}</h3>
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                    Category: {c.category} | Status: <strong style={{ color: isResolved ? '#10b981' : '#facc15' }}>{c.status}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button
                    onClick={() => navigate(`/track-complaint?id=${c.id}`)}
                    style={{ padding: '8px 14px', background: '#1f2937', color: '#38bdf8', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Track Live
                  </button>

                  {/* Dynamic Feedback Action */}
                  {!isResolved ? (
                    <span style={{ fontSize: '12px', color: '#6b7280', padding: '8px 12px', background: '#090d16', borderRadius: '8px', border: '1px solid #1f2937' }}>
                      Feedback unavailable
                    </span>
                  ) : feedbackDone ? (
                    <span style={{ fontSize: '12px', color: '#10b981', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', fontWeight: 'bold' }}>
                      ✓ Feedback Submitted
                    </span>
                  ) : (
                    <button
                      onClick={() => navigate(`/feedback?id=${c.id}`)}
                      style={{ padding: '8px 14px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Give Feedback
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyComplaints;