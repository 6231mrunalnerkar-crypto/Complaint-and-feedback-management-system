import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const Login = () => {
  const [activeRole, setActiveRole] = useState('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError(`Please enter your ${activeRole.toUpperCase()} ID or Email.`);
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      localStorage.setItem('cfms_user', JSON.stringify({
        role: activeRole,
        id: identifier,
        name: identifier.split('@')[0] || `${activeRole}_user`
      }));

      if (activeRole === 'student') navigate('/student/dashboard');
      else if (activeRole === 'staff') navigate('/staff/dashboard');
      else if (activeRole === 'admin') navigate('/admin/dashboard');
    }, 600);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Portal Login</h2>
          <p>Select your institutional role to access your account</p>
        </div>

        {/* Role Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'rgba(255, 255, 255, 0.05)', padding: '6px', borderRadius: '10px' }}>
          {['student', 'staff', 'admin'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => {
                setActiveRole(role);
                setError('');
              }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 'bold',
                textTransform: 'capitalize',
                cursor: 'pointer',
                background: activeRole === role ? '#10b981' : 'transparent',
                color: activeRole === role ? '#ffffff' : '#a1a1aa',
                transition: 'all 0.2s ease'
              }}
            >
              {role}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ marginBottom: '16px', padding: '10px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fca5a5', borderRadius: '8px', fontSize: '12px', textAlign: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>
              {activeRole === 'student' && 'Student ID / Institutional Email'}
              {activeRole === 'staff' && 'Staff Employee ID / Email'}
              {activeRole === 'admin' && 'Admin Portal Username'}
            </label>
            <input
              type="text"
              placeholder={activeRole === 'student' ? 'e.g. STU-2026-001' : 'user@campus.edu'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '11px'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', margin: '12px 0 20px 0', color: '#9ca3af' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <a href="#forgot" style={{ color: '#10b981', textDecoration: 'none' }}>Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
            style={{ width: '100%', padding: '12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'Authenticating...' : `Login as ${activeRole.toUpperCase()}`}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#9ca3af' }}>
          <p>Don't have an account? <Link to="/register" style={{ color: '#10b981', fontWeight: 'bold' }}>Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;