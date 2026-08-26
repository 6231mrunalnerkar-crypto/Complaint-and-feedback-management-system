import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getStoredComplaints, updateComplaintStatus } from '../utils/mockData';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setComplaints(getStoredComplaints());
  }, []);

  const handleStatusChange = (id, newStatus) => {
    updateComplaintStatus(id, newStatus);
    setComplaints(getStoredComplaints());
    toast.success(`Complaint ${id} status updated to ${newStatus}.`);
  };

  const handleClearFilters = () => {
    setSearch('');
    toast.success('Filters cleared');
  };

  const filtered = complaints.filter(c =>
    (c.id || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.subject || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: '#030712', color: '#ffffff', padding: '32px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px' }}>Admin Management Panel</h1>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search complaints by ID or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '10px 14px', background: '#111827', border: '1px solid #374151', color: '#ffffff', borderRadius: '8px', outline: 'none' }}
          />
          <button onClick={handleClearFilters} style={{ padding: '10px 16px', background: '#1f2937', color: '#10b981', border: '1px solid #374151', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Clear
          </button>
        </div>

        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1f2937', color: '#6b7280', textTransform: 'uppercase', fontSize: '12px' }}>
                <th style={{ padding: '16px' }}>Ref ID</th>
                <th style={{ padding: '16px' }}>Subject</th>
                <th style={{ padding: '16px' }}>Category</th>
                <th style={{ padding: '16px' }}>Status</th>
                <th style={{ padding: '16px' }}>Update Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #1f2937' }}>
                  <td style={{ padding: '16px', color: '#38bdf8', fontWeight: 'bold' }}>{c.id}</td>
                  <td style={{ padding: '16px' }}>{c.subject}</td>
                  <td style={{ padding: '16px', color: '#9ca3af' }}>{c.category}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', background: c.status === 'Resolved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(250, 204, 21, 0.15)', color: c.status === 'Resolved' ? '#10b981' : '#facc15' }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c.id, e.target.value)}
                      style={{ padding: '6px 10px', background: '#090d16', border: '1px solid #374151', color: '#ffffff', borderRadius: '6px', fontSize: '13px', outline: 'none' }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;