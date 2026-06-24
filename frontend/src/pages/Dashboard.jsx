import React from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: '#FAFFF2' }}>
      <div style={{ width: '100%', maxWidth: '480px', background: 'linear-gradient(160deg, #9FE04A 0%, #5BB825 100%)', borderRadius: '20px', padding: '32px', color: 'white', boxShadow: '0 20px 50px rgba(91, 184, 37, 0.25)' }}>
        <h2 style={{ marginBottom: '12px' }}>Welcome to the Dashboard</h2>
        <p style={{ marginBottom: '20px', lineHeight: 1.6 }}>Your login flow is now connected successfully.</p>
        <Link to="/login" style={{ display: 'inline-block', padding: '12px 16px', borderRadius: '10px', backgroundColor: '#EEFF6E', color: '#3a7a10', fontWeight: 700, textDecoration: 'none' }}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}
