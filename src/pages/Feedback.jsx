import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { saveFeedback, hasSubmittedFeedback } from '../utils/feedbackData';
import { getStoredComplaints } from '../utils/mockData';

const Feedback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialId = searchParams.get('id') || '';

  const [complaintId, setComplaintId] = useState(initialId);
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState('General');
  const [comment, setComment] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  useEffect(() => {
    if (complaintId) {
      verifyComplaint(complaintId);
    }
  }, [complaintId]);

  const verifyComplaint = (id) => {
    const complaints = getStoredComplaints();
    const found = complaints.find((c) => c.id.toLowerCase() === id.trim().toLowerCase());

    if (!found) {
      setIsResolved(false);
      return;
    }

    if (found.status !== 'Resolved') {
      setIsResolved(false);
      toast.error('Feedback is available only for resolved complaints.');
      return;
    }

    setIsResolved(true);

    if (hasSubmittedFeedback(found.id)) {
      setAlreadySubmitted(true);
      toast.error('Feedback has already been submitted for this complaint.');
    } else {
      setAlreadySubmitted(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!complaintId) {
      toast.error('Please enter a valid Complaint ID.');
      return;
    }

    if (!isResolved) {
      toast.error('Feedback can only be submitted for resolved complaints.');
      return;
    }

    if (alreadySubmitted) {
      toast.error('Feedback already submitted.');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter your feedback comments.');
      return;
    }

    const feedbackObj = {
      complaintId: complaintId.trim().toUpperCase(),
      rating,
      category,
      comment,
      anonymous,
      date: new Date().toISOString().split('T')[0],
    };

    saveFeedback(feedbackObj);
    toast.success('Thank you! Your feedback has been submitted.');
    navigate('/my-complaints');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', backgroundColor: '#030712', color: '#ffffff', padding: '32px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#111827', border: '1px solid #1f2937', padding: '32px', borderRadius: '12px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Submit Feedback</h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '24px' }}>Provide feedback for resolved complaints to help improve services.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Complaint Reference ID</label>
            <input
              type="text"
              placeholder="e.g. CFMS-2026-001"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', background: '#090d16', border: '1px solid #374151', color: '#ffffff', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Rating</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  style={{
                    background: star <= rating ? 'rgba(16, 185, 129, 0.2)' : '#090d16',
                    border: star <= rating ? '1px solid #10b981' : '1px solid #374151',
                    color: star <= rating ? '#10b981' : '#6b7280',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px'
                  }}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', background: '#090d16', border: '1px solid #374151', color: '#ffffff', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
            >
              <option value="General">General</option>
              <option value="Library">Library</option>
              <option value="Hostel">Hostel</option>
              <option value="Canteen">Canteen</option>
              <option value="Academic">Academic</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#9ca3af', marginBottom: '6px' }}>Comments</label>
            <textarea
              rows="4"
              placeholder="Describe your resolution experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', background: '#090d16', border: '1px solid #374151', color: '#ffffff', borderRadius: '8px', fontSize: '14px', outline: 'none', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="checkbox"
              id="anon"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#10b981' }}
            />
            <label htmlFor="anon" style={{ fontSize: '13px', color: '#d1d5db', cursor: 'pointer' }}>Submit Anonymously</label>
          </div>

          <button
            type="submit"
            disabled={!isResolved || alreadySubmitted}
            style={{
              padding: '12px',
              background: (!isResolved || alreadySubmitted) ? '#374151' : '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: (!isResolved || alreadySubmitted) ? 'not-allowed' : 'pointer',
              marginTop: '8px'
            }}
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;