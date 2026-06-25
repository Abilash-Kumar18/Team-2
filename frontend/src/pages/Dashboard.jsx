import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: '#FAFFF2' }}>
      <div style={{ width: '100%', maxWidth: '480px', background: 'linear-gradient(160deg, #9FE04A 0%, #5BB825 100%)', borderRadius: '20px', padding: '32px', color: 'white', boxShadow: '0 20px 50px rgba(91, 184, 37, 0.25)' }}>
        <h2 style={{ marginBottom: '16px' }}>Welcome, {user.name}!</h2>
        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '10px', backdropFilter: 'blur(5px)' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}><strong>Email:</strong> {user.email}</p>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}><strong>Role:</strong> {user.role.toUpperCase()}</p>
          {user.regNo && <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}><strong>Reg. No:</strong> {user.regNo}</p>}
          {user.deptYear && <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}><strong>Dept/Year:</strong> {user.deptYear}</p>}
          {user.clubName && <p style={{ margin: '0 0 8px 0', fontSize: '14px', opacity: 0.9 }}><strong>Club Name:</strong> {user.clubName}</p>}
        </div>
        <p style={{ marginBottom: '20px', lineHeight: 1.6, fontSize: '15px' }}>Your authentication flow is connected successfully.</p>
        <button 
          onClick={handleLogout} 
          style={{ display: 'inline-block', padding: '12px 24px', borderRadius: '10px', backgroundColor: '#EEFF6E', color: '#3a7a10', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '15px', transition: 'transform 0.2s' }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
