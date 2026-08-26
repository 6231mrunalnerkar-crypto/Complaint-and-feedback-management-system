import React, { useState, useEffect } from 'react';
import { getStoredFeedback } from '../utils/feedbackData';
import { getStoredComplaints } from '../utils/mockData';

const AdminFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [ratingFilter, setRatingFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setFeedbackList(getStoredFeedback());
    setComplaints(getStoredComplaints());
  }, []);

  // Compute Overall Metrics
  const totalFeedback = feedbackList.length;
  const avgRating = totalFeedback > 0
    ? (feedbackList.reduce((acc, curr) => acc + Number(curr.rating), 0) / totalFeedback).toFixed(1)
    : '0.0';
  const anonymousCount = feedbackList.filter((fb) => fb.anonymous).length;

  // Filter Logic
  const filteredFeedback = feedbackList.filter((fb) => {
    const matchesSearch =
      (fb.id || '').toLowerCase().includes(search.toLowerCase()) ||
      (fb.complaintId || '').toLowerCase().includes(search.toLowerCase()) ||
      (fb.comment || '').toLowerCase().includes(search.toLowerCase());

    const matchesRating = ratingFilter === 'All' || String(fb.rating) === ratingFilter;
    const matchesCategory = categoryFilter === 'All' || fb.category === categoryFilter;

    return matchesSearch && matchesRating && matchesCategory;
  });

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: '#030712', color: '#ffffff', padding: '32px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Title */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
            ADMIN ANALYTICS
          </span>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '8px 0 0 0' }}>Student Feedback & Analytics</h1>
        </div>

        {/* Analytics Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: '#111827', border: '1px solid #1f2937', padding: '20px', borderRadius: '12px' }}>
            <span style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Average Rating</span>
            <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '4px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {avgRating} <span style={{ fontSize: '20px' }}>⭐</span>
            </div>
          </div>
          <div style={{ background: '#111827', border: '1px solid #1f2937', padding: '20px', borderRadius: '12px' }}>
            <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Submissions</span>
            <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '4px', color: '#ffffff' }}>{totalFeedback}</div>
          </div>
          <div style={{ background: '#111827', border: '1px solid #1f2937', padding: '20px', borderRadius: '12px' }}>
            <span style={{ color: '#facc15', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Anonymous Submissions</span>
            <div style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '4px', color: '#facc15' }}>{anonymousCount}</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div style={{ background: '#111827', border: '1px solid #1f2937', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <input
            type="text"
            placeholder="Search Feedback ID, Complaint ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: '10px 12px', background: '#090d16', border: '1px solid #374151', color: '#ffffff', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
          />

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            style={{ padding: '10px 12px', background: '#090d16', border: '1px solid #374151', color: '#ffffff', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
          >
            <option value="All">All Ratings</option>
            <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
            <option value="4">4 Stars ⭐⭐⭐⭐</option>
            <option value="3">3 Stars ⭐⭐⭐</option>
            <option value="2">2 Stars ⭐⭐</option>
            <option value="1">1 Star ⭐</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ padding: '10px 12px', background: '#090d16', border: '1px solid #374151', color: '#ffffff', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
          >
            <option value="All">All Categories</option>
            <option value="Library">Library</option>
            <option value="Hostel">Hostel</option>
            <option value="Canteen">Canteen</option>
            <option value="Academic">Academic</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Transport">Transport</option>
            <option value="Administration">Administration</option>
            <option value="Other">Other</option>
          </select>

          <button
            onClick={() => { setSearch(''); setRatingFilter('All'); setCategoryFilter('All'); }}
            style={{ padding: '10px 16px', background: '#1f2937', color: '#10b981', border: '1px solid #374151', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Clear Filters
          </button>
        </div>

        {/* Counter */}
        <div style={{ marginBottom: '16px', color: '#9ca3af', fontSize: '14px', fontWeight: '600' }}>
          Showing <strong style={{ color: '#10b981' }}>{filteredFeedback.length}</strong> of <strong>{totalFeedback}</strong> feedback submissions
        </div>

        {/* Feedback List Table */}
        {filteredFeedback.length === 0 ? (
          <div style={{ background: '#111827', border: '1px solid #1f2937', padding: '48px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '18px', color: '#ffffff', margin: '0 0 8px 0' }}>No feedback entries found</h3>
            <p style={{ fontSize: '14px', color: '#9ca3af', margin: 0 }}>Try clearing your filters or check back once students submit feedback.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', background: '#111827', border: '1px solid #1f2937', borderRadius: '12px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1f2937', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '16px' }}>FB Reference</th>
                  <th style={{ padding: '16px' }}>Complaint ID</th>
                  <th style={{ padding: '16px' }}>Rating</th>
                  <th style={{ padding: '16px' }}>Category</th>
                  <th style={{ padding: '16px' }}>Comment</th>
                  <th style={{ padding: '16px' }}>Mode</th>
                  <th style={{ padding: '16px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedback.map((fb) => (
                  <tr key={fb.id} style={{ borderBottom: '1px solid #1f2937' }}>
                    <td style={{ padding: '16px', color: '#10b981', fontWeight: 'bold' }}>{fb.id}</td>
                    <td style={{ padding: '16px', color: '#38bdf8', fontWeight: 'bold' }}>{fb.complaintId}</td>
                    <td style={{ padding: '16px' }}>
                      {'⭐'.repeat(fb.rating)}
                    </td>
                    <td style={{ padding: '16px', color: '#d1d5db' }}>{fb.category}</td>
                    <td style={{ padding: '16px', color: '#9ca3af', maxWidth: '300px' }}>"{fb.comment}"</td>
                    <td style={{ padding: '16px' }}>
                      {fb.anonymous ? (
                        <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', background: 'rgba(234, 179, 8, 0.15)', color: '#facc15', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
                          🔒 Anonymous
                        </span>
                      ) : (
                        <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                          Public
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '16px', color: '#6b7280' }}>{fb.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminFeedback;