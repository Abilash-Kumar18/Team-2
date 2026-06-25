import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/images/logo.jpg';
import './Splash.css';

export default function Splash() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Start fading out after 2 seconds
    const fadeTimer = setTimeout(() => {
      setVisible(false);
    }, 2000);

    // Redirect to login after 3 seconds
    const redirectTimer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className={`splash-container ${visible ? 'fade-in' : 'fade-out'}`}>
      <div className="splash-card">
        <img src={logoImg} alt="Campus Events Logo" className="splash-logo" />
      </div>
    </div>
  );
}
