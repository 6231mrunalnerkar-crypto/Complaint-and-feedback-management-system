import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getStoredComplaints } from '../utils/mockData';

const TrackComplaint = () => {
  const [searchParams] = useSearchParams();
  const [searchId, setSearchId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (queryId) => {
    const targetId = (queryId || searchId).trim();
    if (!targetId) return;
    
    setSearched(true);
    const complaints = getStoredComplaints();
    const found = complaints.find(c => c.id.toLowerCase() === targetId.toLowerCase());
    setComplaint(found || null);
  };

  useEffect(() => {
    const idFromUrl = searchParams.get('id');
    if (idFromUrl) {
      setSearchId(idFromUrl);
      handleSearch(idFromUrl);
    }
  }, [searchParams]);

  const stages = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];

  const getActiveStageIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Under Review': return 1;
      case 'In Progress': return 2;
      case 'Resolved': return 3;
      default: return 0;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', color: '#ffffff', padding: '40px 20px', fontFamily: 'sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ width: '100%', maxWidth: '700px' }}>
        
        {/* Search Header */}
        <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '28px', borderRadius: '16px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#10b981' }}>Track Your Complaint</h2>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: '0 0 20px 0' }}>Enter your Reference ID to inspect live resolution status.</p>

          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="e.g. CFMS-2026-00125"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              style={{ flex: 1, padding: '12px', background: '#090d16', border: '1px solid #1f2937', color: '#ffffff', borderRadius: '8px', outline: 'none', fontSize: '14px' }}
            />
            <button type="submit" style={{ padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
              Track
            </button>
          </form>
        </div>

        {/* Search Result */}
        {searched && (
          complaint ? (
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '28px', borderRadius: '16px' }}>
              
              {/* Status Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #1f2937', paddingBottom: '16px', marginBottom: '20px' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold' }}>{complaint.id}</span>
                  <h3 style={{ fontSize: '18px', margin: '4px 0 0 0', color: '#ffffff' }}>{complaint.subject}</h3>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid #10b981' }}>
                  {complaint.status}
                </span>
              </div>

              {/* Status Timeline Visualiser */}
              <div style={{ marginBottom: '28px', background: '#090d16', padding: '20px', borderRadius: '12px', border: '1px solid #1f2937' }}>
                <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '16px' }}>TIMELINE PROGRESS</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                  {stages.map((stage, idx) => {
                    const currentIdx = getActiveStageIndex(complaint.status);
                    const isPassed = idx <= currentIdx;
                    return (
                      <div key={stage} style={{ flex: 1, textAlign: 'center', position: 'relative', zIndex: 2 }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: isPassed ? '#10b981' : '#1f2937',
                          color: isPassed ? '#ffffff' : '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px auto',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          boxShadow: isPassed ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none'
                        }}>
                          {isPassed ? '✓' : idx + 1}
                        </div>
                        <span style={{ fontSize: '11px', color: isPassed ? '#ffffff' : '#6b7280', fontWeight: isPassed ? '600' : 'normal' }}>
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px', background: '#090d16', padding: '14px', borderRadius: '8px' }}>
                <div>
                  <small style={{ color: '#6b7280', display: 'block', fontSize: '11px' }}>CATEGORY</small>
                  <span style={{ fontSize: '13px', color: '#d1d5db', fontWeight: 'bold' }}>{complaint.category}</span>
                </div>
                <div>
                  <small style={{ color: '#6b7280', display: 'block', fontSize: '11px' }}>PRIORITY</small>
                  <span style={{ fontSize: '13px', color: complaint.priority === 'High' || complaint.priority === 'Urgent' ? '#f87171' : '#fbbf24', fontWeight: 'bold' }}>{complaint.priority}</span>
                </div>
                <div>
                  <small style={{ color: '#6b7280', display: 'block', fontSize: '11px' }}>DATE SUBMITTED</small>
                  <span style={{ fontSize: '13px', color: '#d1d5db' }}>{complaint.date}</span>
                </div>
              </div>

              <div>
                <small style={{ color: '#6b7280', display: 'block', fontSize: '11px', marginBottom: '4px' }}>DESCRIPTION</small>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '13px', lineHeight: '1.5', background: '#090d16', padding: '12px', borderRadius: '8px' }}>
                  "{complaint.description}"
                </p>
              </div>

            </div>
          ) : (
            <div style={{ backgroundColor: '#111827', border: '1px solid #1f2937', padding: '32px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔍</div>
              <h3 style={{ color: '#f87171', margin: '0 0 6px 0', fontSize: '18px' }}>Complaint Not Found</h3>
              <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Please check your Reference ID and try again.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TrackComplaint;