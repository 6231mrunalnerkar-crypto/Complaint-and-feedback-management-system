import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('feedbacks');

  useEffect(() => {
    // Load Feedbacks from localStorage
    const storedFeedbacks = JSON.parse(localStorage.getItem('cfms_feedbacks') || '[]');
    setFeedbacks(storedFeedbacks);

    // Load Mock/Stored Complaints from localStorage
    const storedComplaints = JSON.parse(localStorage.getItem('cfms_complaints') || '[]');
    if (storedComplaints.length === 0) {
      // Mock initial data if empty
      const initialComplaints = [
        { id: 'CMP-1001', category: 'Hostel', title: 'Water leakage in room 204', status: 'Pending', date: '2026-08-25', priority: 'High' },
        { id: 'CMP-1002', category: 'Library', title: 'AC not working on 2nd floor', status: 'Resolved', date: '2026-08-24', priority: 'Medium' },
        { id: 'CMP-1003', category: 'Canteen', title: 'Food quality issue', status: 'Pending', date: '2026-08-26', priority: 'Low' }
      ];
      localStorage.setItem('cfms_complaints', JSON.stringify(initialComplaints));
      setComplaints(initialComplaints);
    } else {
      setComplaints(storedComplaints);
    }
  }, []);

  // Stats Calculations
  const totalFeedbacks = feedbacks.length;
  const avgRating = totalFeedbacks > 0 
    ? (feedbacks.reduce((acc, curr) => acc + Number(curr.rating), 0) / totalFeedbacks).toFixed(1)
    : '0.0';
  
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;

  const cardStyle = {
    backgroundColor: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '12px',
    padding: '18px',
    flex: '1',
    minWidth: '140px'
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#030712',
      color: '#ffffff',
      padding: '30px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#10b981' }}>
            Admin Control Center
          </h2>
          <span style={{ fontSize: '12px', color: '#9ca3af', background: '#111827', padding: '6px 12px', borderRadius: '20px', border: '1px solid #1f2937' }}>
            System Status: Live
          </span>
        </div>

        {/* 5 Stats Cards Grid */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '28px' }}>
          <div style={cardStyle}>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px', fontWeight: 'bold' }}>TOTAL FEEDBACKS</p>
            <h3 style={{ margin: '8px 0 0 0', fontSize: '26px', color: '#38bdf8' }}>{totalFeedbacks}</h3>
          </div>

          <div style={cardStyle}>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px', fontWeight: 'bold' }}>AVG RATING</p>
            <h3 style={{ margin: '8px 0 0 0', fontSize: '26px', color: '#fbbf24' }}>
              {avgRating} <span style={{ fontSize: '14px', color: '#9ca3af' }}>/ 5</span>
            </h3>
          </div>

          <div style={cardStyle}>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px', fontWeight: 'bold' }}>TOTAL COMPLAINTS</p>
            <h3 style={{ margin: '8px 0 0 0', fontSize: '26px', color: '#a855f7' }}>{totalComplaints}</h3>
          </div>

          <div style={cardStyle}>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px', fontWeight: 'bold' }}>PENDING</p>
            <h3 style={{ margin: '8px 0 0 0', fontSize: '26px', color: '#f87171' }}>{pendingComplaints}</h3>
          </div>

          <div style={cardStyle}>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '12px', fontWeight: 'bold' }}>RESOLVED</p>
            <h3 style={{ margin: '8px 0 0 0', fontSize: '26px', color: '#34d399' }}>{resolvedComplaints}</h3>
          </div>
        </div>

        {/* Dynamic Tab Switcher */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #1f2937', paddingBottom: '10px' }}>
          <button
            onClick={() => setActiveTab('feedbacks')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              background: activeTab === 'feedbacks' ? '#10b981' : 'transparent',
              color: activeTab === 'feedbacks' ? '#ffffff' : '#9ca3af'
            }}
          >
            Feedbacks ({feedbacks.length})
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              background: activeTab === 'complaints' ? '#10b981' : 'transparent',
              color: activeTab === 'complaints' ? '#ffffff' : '#9ca3af'
            }}
          >
            Complaints ({complaints.length})
          </button>
        </div>

        {/* Feedbacks Content Panel */}
        {activeTab === 'feedbacks' && (
          <div style={{ background: '#111827', padding: '24px', borderRadius: '12px', border: '1px solid #1f2937' }}>
            {feedbacks.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>No feedbacks submitted yet.</p>
            ) : (
              feedbacks.map((fb) => (
                <div 
                  key={fb.id} 
                  style={{
                    background: '#090d16',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    border: '1px solid #1f2937'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '14px' }}>
                      [{fb.category}] {'★'.repeat(fb.rating)} ({fb.rating}/5)
                    </span>
                    <small style={{ color: '#6b7280', fontSize: '12px' }}>{fb.date}</small>
                  </div>
                  <h4 style={{ margin: '4px 0 8px 0', fontSize: '15px', color: '#ffffff' }}>{fb.subject}</h4>
                  <p style={{ margin: '0 0 10px 0', color: '#d1d5db', fontSize: '13px', fontStyle: 'italic' }}>
                    "{fb.message}"
                  </p>
                  <div style={{ color: '#9ca3af', fontSize: '12px', borderTop: '1px dashed #1f2937', paddingTop: '8px' }}>
                    Submitted By: <strong style={{ color: '#ffffff' }}>{fb.name}</strong> (ID: {fb.studentId})
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Complaints Content Panel */}
        {activeTab === 'complaints' && (
          <div style={{ background: '#111827', padding: '24px', borderRadius: '12px', border: '1px solid #1f2937' }}>
            {complaints.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>No complaints recorded.</p>
            ) : (
              complaints.map((cmp) => (
                <div 
                  key={cmp.id} 
                  style={{
                    background: '#090d16',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    border: '1px solid #1f2937',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 'bold' }}>{cmp.id}</span>
                      <span style={{ fontSize: '11px', background: '#1f2937', padding: '2px 8px', borderRadius: '4px', color: '#d1d5db' }}>{cmp.category}</span>
                    </div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#ffffff' }}>{cmp.title}</h4>
                    <small style={{ color: '#6b7280' }}>Date: {cmp.date}</small>
                  </div>

                  <div>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      background: cmp.status === 'Resolved' ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                      color: cmp.status === 'Resolved' ? '#34d399' : '#f87171',
                      border: `1px solid ${cmp.status === 'Resolved' ? '#34d399' : '#f87171'}`
                    }}>
                      {cmp.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;