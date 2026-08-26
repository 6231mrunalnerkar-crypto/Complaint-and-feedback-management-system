import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [role, setRole] = useState(localStorage.getItem('userRole') || 'guest');

  useEffect(() => {
    // Re-check user role on route changes or login state updates
    const currentRole = localStorage.getItem('userRole') || 'guest';
    setRole(currentRole);
    setMobileMenuOpen(false); // Close mobile menu on route change
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('cfms_user');
    setRole('guest');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? '#10b981' : '#9ca3af',
    textDecoration: 'none',
    fontWeight: isActive ? 'bold' : '500',
    fontSize: '14px',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'all 0.2s',
    background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
  });

  return (
    <nav style={{ backgroundColor: '#090d16', borderBottom: '1px solid #1f2937', sticky: 'top', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <NavLink to="/" style={{ color: '#ffffff', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#10b981' }}>CFMS</span> Portal
        </NavLink>

        {/* Desktop Links */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <NavLink to="/" style={navLinkStyle}>Home</NavLink>
          <NavLink to="/submit-complaint" style={navLinkStyle}>Lodge Complaint</NavLink>
          <NavLink to="/track-complaint" style={navLinkStyle}>Track Complaint</NavLink>
          <NavLink to="/feedback" style={navLinkStyle}>Feedback</NavLink>

          {role === 'admin' ? (
            <>
              <NavLink to="/admin-dashboard" style={navLinkStyle}>Admin Dashboard</NavLink>
              <NavLink to="/admin/feedback" style={navLinkStyle}>Analytics</NavLink>
              <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', marginLeft: '8px' }}>
                Logout
              </button>
            </>
          ) : role === 'student' ? (
            <>
              <NavLink to="/student-dashboard" style={navLinkStyle}>Dashboard</NavLink>
              <NavLink to="/my-complaints" style={navLinkStyle}>My Complaints</NavLink>
              <button onClick={handleLogout} style={{ background: '#1f2937', color: '#ef4444', border: '1px solid #374151', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', marginLeft: '8px' }}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" style={{ background: '#10b981', color: '#ffffff', textDecoration: 'none', padding: '6px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', marginLeft: '8px' }}>
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '24px', cursor: 'pointer', display: 'none' }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div style={{ background: '#111827', borderBottom: '1px solid #1f2937', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <NavLink to="/" style={navLinkStyle}>Home</NavLink>
          <NavLink to="/submit-complaint" style={navLinkStyle}>Lodge Complaint</NavLink>
          <NavLink to="/track-complaint" style={navLinkStyle}>Track Complaint</NavLink>
          <NavLink to="/feedback" style={navLinkStyle}>Feedback</NavLink>

          {role === 'admin' ? (
            <>
              <NavLink to="/admin-dashboard" style={navLinkStyle}>Admin Dashboard</NavLink>
              <NavLink to="/admin/feedback" style={navLinkStyle}>Feedback Analytics</NavLink>
              <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', marginTop: '8px' }}>
                Logout
              </button>
            </>
          ) : role === 'student' ? (
            <>
              <NavLink to="/student-dashboard" style={navLinkStyle}>Student Dashboard</NavLink>
              <NavLink to="/my-complaints" style={navLinkStyle}>My Complaints</NavLink>
              <button onClick={handleLogout} style={{ background: '#1f2937', color: '#ef4444', border: '1px solid #374151', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left', marginTop: '8px' }}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" style={{ background: '#10b981', color: '#ffffff', textDecoration: 'none', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', marginTop: '8px' }}>
              Login
            </NavLink>
          )}
        </div>
      )}

      {/* Embedded CSS for Responsive Query */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;