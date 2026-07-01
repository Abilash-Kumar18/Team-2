import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  
  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "👋 Hi there! I'm Eventria's AI assistant. Ask me anything about hosting or registering for events, or certificates!", sender: 'bot' }
  ]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        setIsLoggedIn(false);
      }
    }

    const fetchEvents = async () => {
      try {
        const data = await eventService.getAll();
        setEvents(data || []);
      } catch (err) {
        console.warn("Failed to fetch events:", err);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDashboardClick = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { id: Date.now(), text: chatInput, sender: 'user' };
    setChatMessages(prev => [...prev, userMsg]);
    const inputLower = chatInput.toLowerCase();
    setChatInput('');

    // Generate responsive bot message
    setTimeout(() => {
      let botText = "Thank you for asking! I'm happy to help. Let me know if you need info about events, QR check-ins, or certificate verification.";
      
      if (inputLower.includes('host') || inputLower.includes('create') || inputLower.includes('organize')) {
        botText = "To host an event, sign up or log in as an 'Organizer'. Once approved, navigate to the 'Event Plan' tab on your dashboard to start setting up events, capacity limits, and custom registration forms!";
      } else if (inputLower.includes('certificate') || inputLower.includes('cert') || inputLower.includes('award')) {
        botText = "Eventria generates verifiably secure QR certificates automatically! Once the coordinator marks your attendance, your PDF certificate is generated instantly and can be downloaded from the 'My Certificates' tab.";
      } else if (inputLower.includes('qr') || inputLower.includes('attendance') || inputLower.includes('check')) {
        botText = "Attendance is tracked seamlessly via QR codes. Students can view their event-specific QR pass, and event staff scan it using the scanner tool inside the dashboard to mark presence instantly.";
      } else if (inputLower.includes('login') || inputLower.includes('signup') || inputLower.includes('register')) {
        botText = "Simply click 'Go to Dashboard' at the top of the page. If you don't have an account, select 'Sign Up' and register as either a Student or an Organizer.";
      }

      setChatMessages(prev => [...prev, { id: Date.now() + 1, text: botText, sender: 'bot' }]);
    }, 600);
  };

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="home-navbar">
        <a href="/" className="home-logo">
          <span>⚡</span> Eventria
        </a>
        <div className="home-nav-links">
          <a href="#features" className="home-nav-link">Features</a>
          <a href="#services" className="home-nav-link">Services</a>
          <a href="#upcoming" className="home-nav-link">Events</a>
          {isLoggedIn ? (
            <>
              <button onClick={handleDashboardClick} className="home-nav-btn btn-secondary-outline">
                Dashboard ({user?.name?.split(' ')[0]})
              </button>
              <button onClick={handleLogout} className="home-nav-btn btn-primary-gradient">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="home-nav-btn btn-secondary-outline">
                Sign In
              </button>
              <button onClick={() => navigate('/signup')} className="home-nav-btn btn-primary-gradient">
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="home-hero">
        <div className="home-hero-badge">
          ✨ THE NEXT-GEN COLLEGE EVENT MANAGEMENT PLATFORM
        </div>
        <h1>Transform Your Events With Real-Time Engagement</h1>
        <p>
          Eventria revolutionizes event management with instant RSVPs, live feedback, 
          and actionable insights. Perfect for college clubs, hackathons, workshops, and campus festivals.
        </p>
        <div className="home-hero-actions">
          <button onClick={handleDashboardClick} className="home-nav-btn btn-primary-gradient btn-large">
            {isLoggedIn ? 'Go to Dashboard' : 'Get Started Now'}
          </button>
          <a href="#features" className="home-nav-btn btn-secondary-outline btn-large" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
            View Live Features
          </a>
        </div>
      </header>

      {/* Quick Features */}
      <section id="features" className="home-quick-features">
        <div className="quick-feature-card">
          <div className="quick-feature-icon">📝</div>
          <h3>Real-Time RSVPs</h3>
          <p>Track student attendance, confirm RSVP limits, and manage guest registrations in real time with auto-updates.</p>
        </div>
        <div className="quick-feature-card">
          <div className="quick-feature-icon">💬</div>
          <h3>Live Feedback</h3>
          <p>Capture audience sentiment during your event with interactive polls, emoji reactions, and live Q&A sessions.</p>
        </div>
        <div className="quick-feature-card">
          <div className="quick-feature-icon">📊</div>
          <h3>Powerful Analytics</h3>
          <p>Gain insights into registration conversion, attendance ratios, and feedback trends immediately after each event.</p>
        </div>
      </section>

      <div className="home-section-divider">
        <button onClick={() => {
          document.getElementById('future-section').scrollIntoView({ behavior: 'smooth' });
        }} className="btn-text-glow">
          Explore Future Event Management <span>↓</span>
        </button>
      </div>

      {/* Why Eventria Section */}
      <section id="future-section" className="home-section" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="section-title-block">
          <span className="section-subtitle">THE SYSTEM IN ACTION</span>
          <h2>Why Eventria is the Future of Event Management</h2>
          <p>Discover the comprehensive suite of features that make Eventria the most advanced AI-driven event management platform.</p>
        </div>

        <div className="features-grid">
          <div className="feature-grid-card">
            <div className="feature-grid-header">
              <span className="feature-grid-icon">⚡</span>
              <h3>Real-Time Engagement</h3>
            </div>
            <p>Live Q&A, instant feedback, and dynamic leaderboards keep your college audience highly engaged throughout the event duration.</p>
          </div>
          <div className="feature-grid-card">
            <div className="feature-grid-header">
              <span className="feature-grid-icon">📊</span>
              <h3>Advanced Analytics</h3>
            </div>
            <p>Comprehensive insights with engagement metrics, feedback analysis, attendance tracking, and custom reporting dashboard.</p>
          </div>
          <div className="feature-grid-card">
            <div className="feature-grid-header">
              <span className="feature-grid-icon">🏆</span>
              <h3>Certificate Management</h3>
            </div>
            <p>Automated certificate generation, QR code verification, design templates, and direct feedback submission for authentic credentials.</p>
          </div>
          <div className="feature-grid-card">
            <div className="feature-grid-header">
              <span className="feature-grid-icon">👥</span>
              <h3>Social Networking</h3>
            </div>
            <p>Connect with other attendees, share experiences, create personalized portfolios, and build lasting professional college connections.</p>
          </div>
          <div className="feature-grid-card">
            <div className="feature-grid-header">
              <span className="feature-grid-icon">🎮</span>
              <h3>Gamification</h3>
            </div>
            <p>Point system, leaderboards, achievements, and interactive challenges that make attending college events fun, competitive, and memorable.</p>
          </div>
          <div className="feature-grid-card">
            <div className="feature-grid-header">
              <span className="feature-grid-icon">📱</span>
              <h3>QR Code System</h3>
            </div>
            <p>Seamless check-ins, payment validation, digital certificate verification, and attendance tracking through integrated dynamic QR technology.</p>
          </div>
        </div>
      </section>

      {/* Premium Services */}
      <section id="services" className="home-section" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="section-title-block">
          <span className="section-subtitle">EXCLUSIVE UTILITIES</span>
          <h2>Premium Services</h2>
          <p>Professional-grade tools built specifically for college event management and organizational productivity.</p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <span className="service-icon">🎨</span>
            <h3>Template Editor</h3>
            <p>Advanced drag-and-drop template designer with custom background patterns, typography control, and instant preview.</p>
            <div className="service-tags">
              <span className="service-tag tag-blue">Drag & Drop</span>
              <span className="service-tag tag-cyan">Direct Preview</span>
              <span className="service-tag tag-green">Premium Branding</span>
            </div>
          </div>
          <div className="service-card">
            <span className="service-icon">🤝</span>
            <h3>Team Recruitment</h3>
            <p>Comprehensive job board for recruitment search to apply to projects/clubs that are looking for members to work together.</p>
            <div className="service-tags">
              <span className="service-tag tag-green">Team Recruiting</span>
              <span className="service-tag tag-orange">Member Matching</span>
              <span className="service-tag tag-cyan">Search Teams</span>
            </div>
          </div>
          <div className="service-card">
            <span className="service-icon">📋</span>
            <h3>Smart Registration Forms</h3>
            <p>Advanced forms with conditional logic fields, multi-user access permissions, and automated bank receipt validation.</p>
            <div className="service-tags">
              <span className="service-tag tag-green">Smart Fields</span>
              <span className="service-tag tag-red">Multi-Step Form</span>
              <span className="service-tag tag-green">Event Integration</span>
            </div>
          </div>
          <div className="service-card">
            <span className="service-icon">📈</span>
            <h3>Analytics Dashboard</h3>
            <p>Comprehensive tracking of student registration numbers, feedback ratios, certificates claimed, and ROI insights.</p>
            <div className="service-tags">
              <span className="service-tag tag-orange">Engagement Metrics</span>
              <span className="service-tag tag-green">Custom Reports</span>
              <span className="service-tag tag-blue">Real-Time Stats</span>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="home-section" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="section-title-block">
          <span className="section-subtitle">THE EVENTRIA ADVANTAGE</span>
          <h2>What Makes Us Different</h2>
          <p>Revolutionary features that set Eventria apart from traditional, outdated event hosting systems.</p>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <span className="service-icon">🏫</span>
            <h3>B2B College Focus</h3>
            <p>Built specifically for college campuses, support student clubs, department co-ordinators, and institutional admins.</p>
            <div className="service-tags">
              <span className="service-tag tag-blue">College Network</span>
              <span className="service-tag tag-green">Academic Focus</span>
            </div>
          </div>
          <div className="service-card">
            <span className="service-icon">🛡️</span>
            <h3>Trust-Based System</h3>
            <p>Advanced verification workflows that ensure payments are valid, registrations are authentic, and certificates are secure.</p>
            <div className="service-tags">
              <span className="service-tag tag-green">Trust Score</span>
              <span className="service-tag tag-cyan">Verification</span>
            </div>
          </div>
          <div className="service-card">
            <span className="service-icon">⚡</span>
            <h3>Scalable Architecture</h3>
            <p>Optimized for instantaneous loading speeds. Built on top of dynamic React structures to support thousands of active users.</p>
            <div className="service-tags">
              <span className="service-tag tag-red">Cloud Native</span>
              <span className="service-tag tag-orange">High Performance</span>
            </div>
          </div>
          <div className="service-card">
            <span className="service-icon">💳</span>
            <h3>Smart Payment Verification</h3>
            <p>Automated validation using OCR/AI helper libraries to verify bank transactions and screenshots with 99% accuracy.</p>
            <div className="service-tags">
              <span className="service-tag tag-green">Auto Verify</span>
              <span className="service-tag tag-blue">Secure Payment</span>
            </div>
          </div>
        </div>
      </section>

      {/* What Our Users Say */}
      <section className="home-section" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="section-title-block">
          <span className="section-subtitle">STUDENT & ORGANIZER FEEDBACK</span>
          <h2>What Our Users Say</h2>
          <p>Hear from college students and club organizers who have transformed their event experience using Eventria.</p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="testimonial-quote">
              "Eventria made hosting our national hackathon seamless. The QR-based check-in cut register queue times down by 90%!"
            </p>
            <div className="testimonial-user">
              <div className="testimonial-avatar">YR</div>
              <div className="testimonial-info">
                <h4>Yashwanth Reddy</h4>
                <span>Coding Club Coordinator, CSE</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-quote">
              "I love how my certificates are automatically updated in my student profile. I can download PDFs in a single click."
            </p>
            <div className="testimonial-user">
              <div className="testimonial-avatar">HA</div>
              <div className="testimonial-info">
                <h4>Harish Aditya</h4>
                <span>B.E Student, IT Dept</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <p className="testimonial-quote">
              "The registration analytics helped us report attendance counts and feedback ratings to the college management instantly."
            </p>
            <div className="testimonial-user">
              <div className="testimonial-avatar">SM</div>
              <div className="testimonial-info">
                <h4>Sanjana Mehta</h4>
                <span>Arts Club Vice President</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Upcoming Events */}
      <section id="upcoming" className="join-events-section" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div className="section-title-block" style={{ marginBottom: '3rem' }}>
          <h2>Join Upcoming Events</h2>
          <p>Discover and participate in exciting college events happening right now on campus.</p>
        </div>

        <div className="join-events-grid">
          <div className="join-card-dark" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'stretch', width: '100%', padding: '2rem 1.5rem', minHeight: '260px' }}>
            {loadingEvents ? (
              <p style={{ color: 'var(--text-secondary)' }}>Loading campus events...</p>
            ) : events.length === 0 ? (
              <>
                <p className="no-events">No upcoming events at the moment.</p>
                <span className="check-back">Check back later for new events!</span>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
                {events.filter(e => new Date(e.date) >= new Date()).slice(0, 3).map((event) => (
                  <div key={event._id} style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '15px',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: 'bold' }}>{event.clubName || 'College Club'}</span>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>📅 {new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <h4 style={{ margin: '0', fontSize: '16px', color: '#fff' }}>{event.title}</h4>
                    <p style={{ margin: '0', fontSize: '13px', color: '#9ca3af', wordBreak: 'break-word' }}>{event.description}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '5px' }}>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>📍 {event.location}</span>
                      <button
                        onClick={() => {
                          if (!isLoggedIn) {
                            alert("Please sign in to register for events!");
                            navigate('/login');
                          } else {
                            navigate(`/register?eventId=${event._id}`);
                          }
                        }}
                        style={{
                          background: '#4f46e5',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        {isLoggedIn ? 'Register Now' : 'Sign In to Register'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="join-card-cta">
            <h3>Want to see your event here?</h3>
            <p>Start creating today and be featured directly on our homepage.</p>
            <button onClick={handleDashboardClick} className="btn-secondary-flat">
              Host an Event
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <h3><span>⚡</span> Eventria</h3>
            <p>Revolutionizing college event management with real-time engagement tools for unforgettable experiences.</p>
            <div className="footer-social-links">
              {/* X / Twitter */}
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-circle-btn" aria-label="X">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-circle-btn" aria-label="Facebook">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              {/* Instagram / Threads */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-circle-btn" aria-label="Instagram">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-circle-btn" aria-label="LinkedIn">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul className="footer-links-list">
              <li><a href="#features">Home</a></li>
              <li><a href="#features">Blog</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#services">About Us</a></li>
              <li><a href="#upcoming">Contact</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <ul className="footer-links-list">
              <li><a href="#features">Help Center</a></li>
              <li><a href="#services">Feedback</a></li>
              <li><a href="#upcoming">Terms of Service</a></li>
              <li><a href="#upcoming">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Stay Updated</h4>
            <p className="subscribe-text">Get personalized event updates delivered straight to your inbox.</p>
            <div className="footer-subscribe-form">
              <input type="email" placeholder="Your email address" className="footer-subscribe-input" />
              <button className="btn-subscribe">Subscribe Now</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Eventria. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#privacy">Terms</a>
            <a href="#privacy">Privacy</a>
            <a href="#privacy">Cookies</a>
            <a href="#privacy">Contact</a>
          </div>
        </div>
      </footer>

      {/* Floating Chatbot Widget */}
      <button onClick={() => setIsChatOpen(!isChatOpen)} className="chatbot-float-trigger" aria-label="Support Assistant">
        💬
      </button>

      {isChatOpen && (
        <div className="mock-chat-window">
          <div className="chat-window-header">
            <div className="chat-header-info">
              <div className="chat-header-avatar">🤖</div>
              <div className="chat-header-status">
                <h4>Eventria Bot</h4>
                <span>Online</span>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="chat-close-btn">✕</button>
          </div>

          <div className="chat-window-messages">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`chat-message ${msg.sender === 'bot' ? 'msg-bot' : 'msg-user'}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={handleChatSubmit} className="chat-window-input-bar">
            <input 
              type="text" 
              placeholder="Type your message..." 
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              className="chat-message-input" 
            />
            <button type="submit" className="btn-chat-send">➤</button>
          </form>
        </div>
      )}
    </div>
  );
}
