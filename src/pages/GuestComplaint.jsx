import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveComplaint } from '../utils/mockData';

const GuestComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: 'Library',
    subject: '',
    description: '',
    priority: 'Medium',
    file: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedData, setSubmittedData] = useState(null);

  const categories = ['Library', 'Hostel', 'Canteen', 'Academic', 'Infrastructure', 'Transport', 'Administration', 'Other'];
  const priorities = ['Low', 'Medium', 'High', 'Urgent'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) {
      setError('Please fill out all required fields (*)');
      return;
    }
    setError('');
    setLoading(true);

    setTimeout(() => {
      const generatedId = `CFMS-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const newEntry = {
        id: generatedId,
        category: formData.category,
        subject: formData.subject,
        description: formData.description,
        priority: formData.priority,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        attachmentName: formData.file ? formData.file.name : null
      };

      saveComplaint(newEntry);
      setLoading(false);
      setSubmittedData(newEntry);
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#030712', color: '#ffffff', padding: '40px 20px', fontFamily: 'sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '650px', backgroundColor: '#111827', border: '1px solid #1f2937', padding: '32px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
        
        {!submittedData ? (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#10b981' }}>Lodge a Complaint</h2>
              <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Register your issue for fast resolution by campus administration.</p>
            </div>

            {error && (
              <div style={{ marginBottom: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', borderRadius: '8px', fontSize: '13px' }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#d1d5db', fontWeight: '600' }}>Category <span style={{ color: '#ef4444' }}>*</span></label>
                  <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '12px', background: '#090d16', border: '1px solid #1f2937', color: '#ffffff', borderRadius: '8px', outline: 'none', fontSize: '13px' }}>
                    {categories.map((c) => <option key={c} value={c} style={{ background: '#111827' }}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#d1d5db', fontWeight: '600' }}>Priority <span style={{ color: '#ef4444' }}>*</span></label>
                  <select name="priority" value={formData.priority} onChange={handleChange} style={{ width: '100%', padding: '12px', background: '#090d16', border: '1px solid #1f2937', color: '#ffffff', borderRadius: '8px', outline: 'none', fontSize: '13px' }}>
                    {priorities.map((p) => <option key={p} value={p} style={{ background: '#111827' }}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#d1d5db', fontWeight: '600' }}>Subject / Title <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" name="subject" placeholder="Brief summary of your grievance" value={formData.subject} onChange={handleChange} style={{ width: '100%', padding: '12px', background: '#090d16', border: '1px solid #1f2937', color: '#ffffff', borderRadius: '8px', outline: 'none', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', color: '#d1d5db', fontWeight: '600' }}>Detailed Description <span style={{ color: '#ef4444' }}>*</span></label>
                  <span style={{ color: '#6b7280', fontSize: '11px' }}>{formData.description.length}/500</span>
                </div>
                <textarea name="description" rows="4" maxLength="500" placeholder="Provide full context about the issue..." value={formData.description} onChange={handleChange} style={{ width: '100%', padding: '12px', background: '#090d16', border: '1px solid #1f2937', color: '#ffffff', borderRadius: '8px', outline: 'none', fontSize: '13px', resize: 'vertical', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#d1d5db', fontWeight: '600' }}>Optional Attachment</label>
                <input type="file" onChange={handleFileChange} style={{ width: '100%', padding: '8px', background: '#090d16', border: '1px dashed #1f2937', color: '#9ca3af', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', boxSizing: 'border-box' }} />
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Submitting Complaint...' : 'Submit Complaint'}
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 10px' }}>
            <div style={{ fontSize: '50px', marginBottom: '12px' }}>🎉</div>
            <h3 style={{ color: '#10b981', margin: '0 0 6px 0', fontSize: '22px' }}>Complaint Submitted Successfully</h3>
            <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 20px 0' }}>Your complaint has been registered.</p>
            
            <div style={{ background: '#090d16', border: '1px solid #1f2937', padding: '16px', borderRadius: '10px', marginBottom: '24px', display: 'inline-block', width: '100%', boxSizing: 'border-box' }}>
              <span style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '4px' }}>REFERENCE ID</span>
              <strong style={{ fontSize: '20px', color: '#38bdf8', letterSpacing: '1px' }}>{submittedData.id}</strong>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => navigate(`/track-complaint?id=${submittedData.id}`)} style={{ flex: 1, padding: '12px', background: '#10b981', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                Track Complaint
              </button>
              <button onClick={() => setSubmittedData(null)} style={{ flex: 1, padding: '12px', background: '#374151', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>
                Lodge Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestComplaint;