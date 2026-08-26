import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getStoredComplaints } from '../utils/mockData';

const TrackComplaint = () => {
  const [searchParams] = useSearchParams();
  const [searchId, setSearchId] = useState(searchParams.get('id') || '');
  const [complaint, setComplaint] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const queryId = searchParams.get('id');
    if (queryId) {
      handleSearch(queryId);
    }
  }, [searchParams]);

  const handleSearch = (idToSearch) => {
    const id = idToSearch || searchId;
    if (!id) return;

    const complaints = getStoredComplaints();
    const found = complaints.find(
      (c) => c.id.toLowerCase() === id.trim().toLowerCase()
    );

    setComplaint(found || null);
    setSearched(true);
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: '#030712', color: '#ffffff', padding: '32px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Track Complaint Status</h1>
        <p style={{ color: '#9ca3af', marginBottom: '24px', fontSize: '14px' }}>Enter your Reference ID below to check the real-time resolution status.</p>

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
          <input
            type="text"
            placeholder="e.g. CFMS-2026-001"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{ flex: 1, padding: '12px 16px', background: '#111827', border: '1px solid #374151', color: '#ffffff', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
          />
          <button
            onClick={() => handleSearch()}
            style={{ padding: '12px 24px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Track Status
          </button>
        </div>

        {/* Search Results */}
        {searched && (
          complaint ? (
            <div style={{ background: '#111827', border: '1px solid #1f2937', padding: '24px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>{complaint.id}</span>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  background: complaint.status === 'Resolved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(250, 204, 21, 0.15)',
                  color: complaint.status === 'Resolved' ? '#10b981' : '#facc15',
                  border: complaint.status === 'Resolved' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(250, 204, 21, 0.3)'
                }}>
                  ● {complaint.status}
                </span>
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>{complaint.subject}</h2>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>{complaint.description}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#090d16', padding: '16px', borderRadius: '8px', fontSize: '13px', color: '#9ca3af' }}>
                <div><strong>Category:</strong> {complaint.category}</div>
                <div><strong>Submitted On:</strong> {complaint.date || 'Recent'}</div>
              </div>
            </div>
          ) : (
            <div style={{ background: '#111827', border: '1px solid #1f2937', padding: '32px', borderRadius: '12px', textAlign: 'center' }}>
              <p style={{ color: '#ef4444', fontWeight: 'bold', margin: 0 }}>No complaint found with ID: "{searchId}"</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TrackComplaint;