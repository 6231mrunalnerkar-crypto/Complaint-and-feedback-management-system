import React, { useState } from 'react';

const Feedback = () => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    category: 'Teaching',
    rating: 5,
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Teaching',
    'Infrastructure',
    'Library',
    'Hostel',
    'Canteen',
    'Transport',
    'Administration',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      setError('Please enter a valid feedback message.');
      return;
    }
    setError('');

    const existingFeedbacks = JSON.parse(localStorage.getItem('cfms_feedbacks') || '[]');
    const newFeedback = {
      id: `FBD-${Math.floor(1000 + Math.random() * 9000)}`,
      isAnonymous,
      name: isAnonymous ? 'Anonymous' : (formData.name || 'Student'),
      studentId: isAnonymous ? 'N/A' : (formData.studentId || 'N/A'),
      category: formData.category,
      rating: formData.rating,
      subject: formData.subject || 'General Feedback',
      message: formData.message,
      date: new Date().toISOString().split('T')[0]
    };

    localStorage.setItem('cfms_feedbacks', JSON.stringify([newFeedback, ...existingFeedbacks]));
    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      studentId: '',
      category: 'Teaching',
      rating: 5,
      subject: '',
      message: ''
    });
    setSubmitted(false);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#030712',
      color: '#ffffff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        backgroundColor: '#111827',
        border: '1px solid #1f2937',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#ffffff' }}>Feedback Portal</h2>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>How would you like to submit your feedback?</p>
        </div>

        {/* Dynamic Mode Selector */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#030712', padding: '6px', borderRadius: '12px', border: '1px solid #1f2937' }}>
          <button
            type="button"
            onClick={() => { setIsAnonymous(false); setError(''); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '13px',
              cursor: 'pointer',
              background: !isAnonymous ? '#10b981' : 'transparent',
              color: !isAnonymous ? '#ffffff' : '#9ca3af',
              transition: 'all 0.2s ease'
            }}
          >
            Submit Normally
          </button>
          <button
            type="button"
            onClick={() => { setIsAnonymous(true); setError(''); }}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '13px',
              cursor: 'pointer',
              background: isAnonymous ? '#10b981' : 'transparent',
              color: isAnonymous ? '#ffffff' : '#9ca3af',
              transition: 'all 0.2s ease'
            }}
          >
            Submit Anonymously
          </button>
        </div>

        {isAnonymous && (
          <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#6ee7b7', borderRadius: '10px', fontSize: '12px' }}>
            🔒 <strong>Identity Protected:</strong> Your name and student ID will not be recorded or visible to administration.
          </div>
        )}

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '30px 10px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
            <h3 style={{ color: '#10b981', marginBottom: '8px', fontSize: '20px' }}>Feedback Submitted Successfully!</h3>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '24px' }}>
              Thank you for sharing your thoughts. Your inputs help us continuously improve campus operations.
            </p>
            <button
              onClick={handleReset}
              style={{ padding: '12px 24px', background: '#374151', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
            >
              Submit Another Feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ marginBottom: '16px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', borderRadius: '8px', fontSize: '12px', textAlign: 'center' }}>
                ⚠️ {error}
              </div>
            )}

            {!isAnonymous && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#d1d5db', fontWeight: '600' }}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', background: '#090d16', border: '1px solid #1f2937', color: '#ffffff', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#d1d5db', fontWeight: '600' }}>Student / User ID</label>
                  <input
                    type="text"
                    name="studentId"
                    placeholder="e.g. STU-2026-001"
                    value={formData.studentId}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '12px', background: '#090d16', border: '1px solid #1f2937', color: '#ffffff', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', fontSize: '13px' }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#d1d5db', fontWeight: '600' }}>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px', background: '#090d16', border: '1px solid #1f2937', color: '#ffffff', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', fontSize: '13px' }}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} style={{ background: '#111827', color: 'white' }}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#d1d5db', fontWeight: '600' }}>Rating (1 to 5 Stars)</label>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', paddingTop: '6px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
                      style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: star <= formData.rating ? '#fbbf24' : '#4b5563', padding: 0 }}
                    >
                      ★
                    </button>
                  ))}
                  <span style={{ marginLeft: '8px', color: '#9ca3af', fontSize: '12px', fontWeight: 'bold' }}>({formData.rating}/5)</span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: '#d1d5db', fontWeight: '600' }}>Subject (Optional)</label>
              <input
                type="text"
                name="subject"
                placeholder="Brief summary of your feedback"
                value={formData.subject}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px', background: '#090d16', border: '1px solid #1f2937', color: '#ffffff', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', fontSize: '13px' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', color: '#d1d5db', fontWeight: '600' }}>Feedback Message</label>
                <span style={{ color: '#6b7280', fontSize: '11px' }}>{formData.message.length}/500</span>
              </div>
              <textarea
                name="message"
                rows="4"
                maxLength="500"
                placeholder="Write your feedback details..."
                value={formData.message}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px', background: '#090d16', border: '1px solid #1f2937', color: '#ffffff', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', fontSize: '13px', resize: 'vertical' }}
              />
            </div>

            <p style={{ color: '#6b7280', fontSize: '11px', fontStyle: 'italic', margin: '4px 0 16px 0' }}>
              * Note: Your feedback will be automatically reviewed for inappropriate language before final submission.
            </p>

            <button
              type="submit"
              style={{ width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
            >
              Submit Feedback
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Feedback;