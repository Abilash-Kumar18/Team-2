import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, eventService } from '../services/api';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'Sridhar Venkataraman',
    email: 'sridharvenkataraman16@gmail.com',
    role: 'student',
    picture: '',
    points: 0,
    heartsCount: 0,
    savesCount: 0,
    sharesCount: 0,
    eventViewsCount: 0,
    registrationsCount: 0,
    mobileNumber: '',
    dob: null,
    country: '',
    state: '',
    city: ''
  });

  const [activeTab, setActiveTab] = useState('Overview');
  const [activeSidebar, setActiveSidebar] = useState('Profile');
  const [globalRank, setGlobalRank] = useState(81);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Sidebar hover and accordion state
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({
    profile: true,
    activities: true,
    settings: false
  });

  // Saved / Liked / Registered helper states
  const [likedIds, setLikedIds] = useState([]);
  const [savedIds, setSavedIds] = useState([]);

  // Details Modal State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);

  // Settings modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Settings forms state
  const [editForm, setEditForm] = useState({
    name: '',
    mobileNumber: '',
    dob: '',
    country: '',
    state: '',
    city: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  useEffect(() => {
    // 1. Load user from localStorage
    const storedUser = localStorage.getItem('user');
    let userId = 'default';
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        userId = parsed._id || 'default';
        setUser(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
      }
    }

    // Load localStorage stats fallbacks
    const localStatsKey = `dash_profile_stats_${userId}`;
    const storedStats = localStorage.getItem(localStatsKey);
    if (storedStats) {
      try {
        const stats = JSON.parse(storedStats);
        setUser(prev => ({ ...prev, ...stats }));
      } catch (e) { }
    }

    // Load liked and saved list IDs
    const storedLikes = localStorage.getItem(`dash_liked_${userId}`);
    if (storedLikes) {
      try { setLikedIds(JSON.parse(storedLikes)); } catch { }
    }
    const storedSaves = localStorage.getItem(`dash_saved_${userId}`);
    if (storedSaves) {
      try { setSavedIds(JSON.parse(storedSaves)); } catch { }
    }

    // Load registrations
    const storedRegs = localStorage.getItem('dash_global_registrations');
    if (storedRegs) {
      try {
        const parsedRegs = JSON.parse(storedRegs);
        setRegistrations(parsedRegs.filter(r => r.studentId === userId));
      } catch { }
    }

    // Load announcements
    const storedAnn = localStorage.getItem('dash_announcements');
    if (storedAnn) {
      try { setAnnouncements(JSON.parse(storedAnn)); } catch { }
    }

    // 2. Fetch from backend API
    const fetchProfileAndData = async () => {
      try {
        const backendProfile = await authService.getProfile();
        if (backendProfile) {
          setUser(prev => ({ ...prev, ...backendProfile }));
          
          // Sync full details
          const stored = localStorage.getItem('user');
          if (stored) {
            const parsed = JSON.parse(stored);
            localStorage.setItem('user', JSON.stringify({ ...parsed, ...backendProfile }));
          }
        }

        // Fetch leaderboard rank
        try {
          const leaderboardData = await authService.getLeaderboard();
          if (leaderboardData && leaderboardData.userRank) {
            setGlobalRank(leaderboardData.userRank);
          }
        } catch { }
      } catch (err) {
        console.warn('Backend connection unavailable, running locally.', err);
      }

      // Fetch all events
      try {
        const allEvents = await eventService.getAll();
        setEvents(allEvents);
      } catch (err) {
        // Fallback to default mock events
        const defaultEvents = [
          { _id: 'mock_event_1', title: 'Smart Tech Hackathon', description: 'A 24-hour coding marathon where students solve real-world industry challenges using cutting-edge AI and web technologies.', date: '2026-07-15T09:00:00.000Z', location: 'Main Seminar Hall', capacity: 100, clubName: 'Coding Club', organizer: { name: 'Coding Club Coordinator', email: 'coding@college.edu' } },
          { _id: 'mock_event_2', title: 'Robo Wars 2026', description: 'Design, build, and battle! Watch custom-engineered robots clash in a high-octane battle arena to win the grand cash prize.', date: '2026-07-22T10:00:00.000Z', location: 'College Indoor Stadium', capacity: 60, clubName: 'Robotics Club', organizer: { name: 'Robotics Coordinator', email: 'robotics@college.edu' } },
          { _id: 'mock_event_3', title: 'Cultural Fusion 2026', description: 'An evening of music, choreography, and dramatic performances celebrating national heritage and student talent.', date: '2026-08-05T17:00:00.000Z', location: 'Open Air Auditorium', capacity: 600, clubName: 'Arts & Music Club', organizer: { name: 'Cultural Committee', email: 'cultural@college.edu' } },
          { _id: 'mock_event_4', title: 'Web Craft React Workshop', description: 'Learn modern single-page application development using React, Vite, and tailwind. Perfect for beginners and intermediates.', date: '2026-06-10T10:00:00.000Z', location: 'CSE Department Lab 3', capacity: 40, clubName: 'Web Dev Club', organizer: { name: 'Web Dev Coordinator', email: 'webdev@college.edu' } }
        ];
        setEvents(defaultEvents);
      }
    };

    fetchProfileAndData();
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const userAvatar = user.picture || user.avatarUrl || user.avatar;
  const points = user.points || 0;
  const currentRank = globalRank !== 81 ? globalRank : Math.max(1, 92 - points);

  const getTierDetails = (pts) => {
    if (pts >= 300) {
      return { current: 'Platinum', next: 'None (Max Tier!)', progressPercent: 100, ptsAway: 0 };
    } else if (pts >= 150) {
      return { current: 'Gold', next: 'Platinum', progressPercent: ((pts - 150) / 150) * 100, ptsAway: 300 - pts };
    } else if (pts >= 50) {
      return { current: 'Silver', next: 'Gold', progressPercent: ((pts - 50) / 100) * 100, ptsAway: 150 - pts };
    } else {
      return { current: 'Bronze', next: 'Silver', progressPercent: (pts / 50) * 100, ptsAway: 50 - pts };
    }
  };

  const tierInfo = getTierDetails(points);

  const toggleSubmenu = (menu, e) => {
    e.stopPropagation();
    setExpandedMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  // Toggle Like and Save locally inside Profile to support direct list updates
  const triggerStatUpdate = async (type, action) => {
    const localStatsKey = `dash_profile_stats_${user._id}`;
    const storedStats = localStorage.getItem(localStatsKey);
    let stats = storedStats ? JSON.parse(storedStats) : {
      points: 0, heartsCount: 0, savesCount: 0, sharesCount: 0, eventViewsCount: 0, registrationsCount: 0
    };

    let pointsDiff = 0;
    if (type === 'hearts') {
      if (action === 'decrement') {
        stats.heartsCount = Math.max(0, stats.heartsCount - 1);
        pointsDiff = -1;
      } else {
        stats.heartsCount += 1;
        pointsDiff = 1;
      }
    } else if (type === 'saves') {
      if (action === 'decrement') {
        stats.savesCount = Math.max(0, stats.savesCount - 1);
        pointsDiff = -1;
      } else {
        stats.savesCount += 1;
        pointsDiff = 1;
      }
    }

    stats.points = Math.max(0, stats.points + pointsDiff);
    localStorage.setItem(localStatsKey, JSON.stringify(stats));

    setUser(prev => ({ ...prev, ...stats }));
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      localStorage.setItem('user', JSON.stringify({ ...parsed, ...stats }));
    }

    try {
      await authService.updateStats(type, action);
    } catch { }
  };

  const handleUnlikeEvent = (eventId) => {
    const updated = likedIds.filter(id => id !== eventId);
    setLikedIds(updated);
    localStorage.setItem(`dash_liked_${user._id}`, JSON.stringify(updated));
    triggerStatUpdate('hearts', 'decrement');
  };

  const handleUnsaveEvent = (eventId) => {
    const updated = savedIds.filter(id => id !== eventId);
    setSavedIds(updated);
    localStorage.setItem(`dash_saved_${user._id}`, JSON.stringify(updated));
    triggerStatUpdate('saves', 'decrement');
  };

  // Edit Settings Submit
  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');
    setSettingsLoading(true);

    try {
      const updatedData = await authService.updateProfile(editForm);
      setUser(prev => ({ ...prev, ...updatedData }));

      const stored = localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem('user', JSON.stringify({ ...parsed, ...updatedData }));
      }

      setSettingsSuccess('Profile updated successfully!');
      setTimeout(() => {
        setIsEditModalOpen(false);
        setSettingsSuccess('');
      }, 1500);
    } catch (err) {
      setSettingsError(err.message || 'Failed to update profile.');
    } finally {
      setSettingsLoading(false);
    }
  };

  // Password Submit
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setSettingsError('New passwords do not match.');
      return;
    }

    setSettingsLoading(true);

    try {
      await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setSettingsSuccess('Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setSettingsSuccess('');
      }, 1500);
    } catch (err) {
      setSettingsError(err.message || 'Failed to change password.');
    } finally {
      setSettingsLoading(false);
    }
  };

  // Delete Account
  const handleDeleteAccountSubmit = async () => {
    setSettingsError('');
    setSettingsLoading(true);

    try {
      await authService.deleteAccount();
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setIsDeleteModalOpen(false);
      navigate('/login');
    } catch (err) {
      setSettingsError(err.message || 'Failed to delete account.');
    } finally {
      setSettingsLoading(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }) + ' at ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Calendar logic: July 2026
  // July 1st is Wednesday, has 31 days
  const calendarDays = [];
  // 3 padding days for Sun, Mon, Tue
  for (let i = 0; i < 3; i++) calendarDays.push(null);
  for (let i = 1; i <= 31; i++) calendarDays.push(i);

  const getEventsForDay = (day) => {
    if (!day) return [];
    // July date checking
    return events.filter(e => {
      const isRegistered = registrations.some(r => r.eventId === e._id);
      if (!isRegistered) return false;
      const d = new Date(e.date);
      return d.getFullYear() === 2026 && d.getMonth() === 6 && d.getDate() === day; // Month 6 is July (0-indexed)
    });
  };

  return (
    <div className="profile-layout-wrapper">
      {/* Hover-Expanding Sidebar */}
      <aside 
        className={`profile-sidebar ${sidebarHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <ul className="sidebar-nav">
          
          {/* 1. Profile Accordion */}
          <li className="sidebar-menu-parent">
            <div 
              className={`menu-header-item ${activeSidebar === 'Profile' ? 'active-parent' : ''}`}
              onClick={(e) => toggleSubmenu('profile', e)}
            >
              <span className="menu-icon">👤</span>
              <span className="menu-label">Profile</span>
              <span className="menu-arrow">
                {expandedMenus.profile ? '▲' : '▼'}
              </span>
            </div>
            
            {expandedMenus.profile && (
              <ul className="sidebar-submenu">
                <li 
                  className={activeTab === 'Overview' ? 'active' : ''} 
                  onClick={() => { setActiveTab('Overview'); setActiveSidebar('Profile'); }}
                >
                  <span className="submenu-bullet">●</span>
                  <span className="submenu-label">My Profile</span>
                </li>
                <li 
                  className={activeTab === 'Calendar' ? 'active' : ''} 
                  onClick={() => { setActiveTab('Calendar'); setActiveSidebar('Profile'); }}
                >
                  <span className="submenu-bullet">●</span>
                  <span className="submenu-label">Event Calendar</span>
                </li>
              </ul>
            )}
          </li>

          {/* 2. Activities Accordion */}
          <li className="sidebar-menu-parent">
            <div 
              className={`menu-header-item ${activeSidebar === 'Activities' ? 'active-parent' : ''}`}
              onClick={(e) => toggleSubmenu('activities', e)}
            >
              <span className="menu-icon">📅</span>
              <span className="menu-label">Activities</span>
              <span className="menu-arrow">
                {expandedMenus.activities ? '▲' : '▼'}
              </span>
            </div>
            
            {expandedMenus.activities && (
              <ul className="sidebar-submenu">
                <li 
                  className={activeTab === 'Saved' ? 'active' : ''} 
                  onClick={() => { setActiveTab('Saved'); setActiveSidebar('Activities'); }}
                >
                  <span className="submenu-bullet">●</span>
                  <span className="submenu-label">Saved</span>
                </li>
                <li 
                  className={activeTab === 'Liked' ? 'active' : ''} 
                  onClick={() => { setActiveTab('Liked'); setActiveSidebar('Activities'); }}
                >
                  <span className="submenu-bullet">●</span>
                  <span className="submenu-label">Liked</span>
                </li>
                <li 
                  className={activeTab === 'Registered' ? 'active' : ''} 
                  onClick={() => { setActiveTab('Registered'); setActiveSidebar('Activities'); }}
                >
                  <span className="submenu-bullet">●</span>
                  <span className="submenu-label">Registered</span>
                </li>
              </ul>
            )}
          </li>

          {/* 3. Inbox Direct Link */}
          <li 
            className={`menu-header-item direct-item ${activeTab === 'Inbox' ? 'active' : ''}`} 
            onClick={() => { setActiveTab('Inbox'); setActiveSidebar('Inbox'); }}
          >
            <span className="menu-icon">📥</span>
            <span className="menu-label">Inbox</span>
          </li>

          {/* 4. Settings Accordion */}
          <li className="sidebar-menu-parent">
            <div 
              className={`menu-header-item ${activeSidebar === 'Settings' ? 'active-parent' : ''}`}
              onClick={(e) => toggleSubmenu('settings', e)}
            >
              <span className="menu-icon">⚙️</span>
              <span className="menu-label">Settings</span>
              <span className="menu-arrow">
                {expandedMenus.settings ? '▲' : '▼'}
              </span>
            </div>
            
            {expandedMenus.settings && (
              <ul className="sidebar-submenu">
                <li 
                  className={activeTab === 'Settings' ? 'active' : ''} 
                  onClick={() => { setActiveTab('Settings'); setActiveSidebar('Settings'); }}
                >
                  <span className="submenu-bullet">●</span>
                  <span className="submenu-label">Settings</span>
                </li>
              </ul>
            )}
          </li>

        </ul>

        {/* Dashboard Link at the bottom of sidebar */}
        <div className="sidebar-footer-btn">
          <button onClick={() => navigate('/dashboard')} className="goto-dash-btn">
            <span className="btn-icon">⬅</span>
            <span className="btn-label">Dashboard</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="profile-main-content">
        
        {/* Top Hero Banner */}
        <div className="profile-hero-banner">
          <div className="hero-gradient-bg"></div>
          <div className="hero-user-details">
            <div className="hero-avatar">
              {userAvatar ? (
                <img src={userAvatar} alt="Profile" />
              ) : (
                <span>{getInitials(user.name)}</span>
              )}
            </div>
            <div className="hero-info">
              <h2>{user.name}</h2>
              <p className="hero-email">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                {user.email}
                <span className="status-badge verified">✔ Verified</span>
              </p>
              <div className="hero-status">
                <span className="status-badge role">{user.role || 'Student'}</span>
                <span className="status-badge active">● Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs switcher at top (synced with sidebar) */}
        <div className="profile-tabs">
          {['Overview', 'Stats', 'Badges', 'Settings'].map(tab => (
            <button 
              key={tab} 
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab);
                setSettingsError('');
                setSettingsSuccess('');
              }}
            >
              {tab === 'Stats' ? '📊 Stats' : tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Overview' && (
          <div className="tab-content overview-content">
            
            {/* Top Cards Row */}
            <div className="overview-top-cards">
              <div className="score-card">
                <div className="score-item">
                  <div className="score-icon yellow">🏆</div>
                  <div>
                    <div className="score-label">TOTAL SCORE</div>
                    <div className="score-value">{points * 3 || 75}</div>
                  </div>
                </div>
                <div className="score-item">
                  <div className="score-icon purple">⚡</div>
                  <div>
                    <div className="score-label">TOTAL POINTS</div>
                    <div className="score-value">{points}</div>
                  </div>
                </div>
              </div>

              <div className="streak-card">
                <div className="streak-icon">🔥</div>
                <div className="streak-info">
                  <h3>1 Day Streak <span className="streak-badge">Streak Info</span></h3>
                  <p>Engage with events today to keep your streak!</p>
                  <div className="streak-stats">
                    <div className="streak-stat-item">
                      <span>LONGEST</span>
                      <strong>1</strong>
                    </div>
                    <div className="streak-stat-item">
                      <span>TOTAL</span>
                      <strong>1</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier Progression */}
            <div className="section-block tier-progression">
              <h3 className="section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> 
                TIER PROGRESSION
                <span className="view-benefits">Compare Benefits</span>
              </h3>
              <div className="tiers-container">
                <div className={`tier-item ${tierInfo.current === 'Bronze' ? 'active' : ''}`}>
                  <div className="tier-icon bronze">🥉</div>
                  <div className="tier-details">
                    <h4>Bronze</h4>
                    <p>{tierInfo.current === 'Bronze' ? 'Current Tier' : '0+ points'}</p>
                  </div>
                </div>
                <div className={`tier-item ${tierInfo.current === 'Silver' ? 'active' : ''}`}>
                  <div className="tier-icon silver">🥈</div>
                  <div className="tier-details">
                    <h4>Silver</h4>
                    <p>{tierInfo.current === 'Silver' ? 'Current Tier' : '50+ points'}</p>
                  </div>
                </div>
                <div className={`tier-item ${tierInfo.current === 'Gold' ? 'active' : ''}`}>
                  <div className="tier-icon gold">🥇</div>
                  <div className="tier-details">
                    <h4>Gold</h4>
                    <p>{tierInfo.current === 'Gold' ? 'Current Tier' : '150+ points'}</p>
                  </div>
                </div>
                <div className={`tier-item ${tierInfo.current === 'Platinum' ? 'active' : ''}`}>
                  <div className="tier-icon platinum">💎</div>
                  <div className="tier-details">
                    <h4>Platinum</h4>
                    <p>{tierInfo.current === 'Platinum' ? 'Current Tier' : '300+ points'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Profile */}
            <div className="section-block personal-profile">
              <h3 className="section-title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                PERSONAL PROFILE
              </h3>
              <div className="profile-grid">
                <div className="profile-grid-item">
                  <label>Account Holder</label>
                  <span>{user.name}</span>
                </div>
                <div className="profile-grid-item">
                  <label>Contact Email</label>
                  <span>{user.email}</span>
                </div>
                <div className="profile-grid-item">
                  <label>Role</label>
                  <span style={{textTransform: 'capitalize'}}>{user.role}</span>
                </div>
                <div className="profile-grid-item">
                  <label>Points Earned</label>
                  <span>{user.points || 0} pts</span>
                </div>
                <div className="profile-grid-item">
                  <label>Member Since</label>
                  <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'July 2026'}</span>
                </div>
                <div className="profile-grid-item">
                  <label>Profile Status</label>
                  <span className="status-badge active-light">Active User</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Tab Content */}
        {activeTab === 'Stats' && (
          <div className="tab-content stats-content">
            <div className="stats-section-header">
              <h3>📊 ACTIVITY STATISTICS</h3>
            </div>
            <div className="stats-cards-grid">
              <div className="stat-card heart-card">
                <div className="stat-card-inner">
                  <div className="stat-icon-wrapper pink-bg">❤️</div>
                  <div className="stat-card-details">
                    <span className="stat-value">{user.heartsCount || 0}</span>
                    <span className="stat-label">HEARTS</span>
                  </div>
                </div>
              </div>
              <div className="stat-card save-card">
                <div className="stat-card-inner">
                  <div className="stat-icon-wrapper blue-bg">🔖</div>
                  <div className="stat-card-details">
                    <span className="stat-value">{user.savesCount || 0}</span>
                    <span className="stat-label">SAVES</span>
                  </div>
                </div>
              </div>
              <div className="stat-card share-card">
                <div className="stat-card-inner">
                  <div className="stat-icon-wrapper purple-bg">🔗</div>
                  <div className="stat-card-details">
                    <span className="stat-value">{user.sharesCount || 0}</span>
                    <span className="stat-label">SHARES</span>
                  </div>
                </div>
              </div>
              <div className="stat-card view-card">
                <div className="stat-card-inner">
                  <div className="stat-icon-wrapper yellow-bg">👁️</div>
                  <div className="stat-card-details">
                    <span className="stat-value">{user.eventViewsCount || 0}</span>
                    <span className="stat-label">EVENT VIEWS</span>
                  </div>
                </div>
              </div>
              <div className="stat-card register-card">
                <div className="stat-card-inner">
                  <div className="stat-icon-wrapper green-bg">📝</div>
                  <div className="stat-card-details">
                    <span className="stat-value">{user.registrationsCount || 0}</span>
                    <span className="stat-label">REGISTER</span>
                  </div>
                </div>
              </div>
              <div className="stat-card points-card">
                <div className="stat-card-inner">
                  <div className="stat-icon-wrapper orange-bg">⚡</div>
                  <div className="stat-card-details">
                    <span className="stat-value">{user.points || 0}</span>
                    <span className="stat-label">POINTS</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="stats-section-header" style={{ marginTop: '30px' }}>
              <h3>🏆 RANKING INSIGHTS</h3>
            </div>
            <div className="ranking-insights-card">
              <div className="rank-display">
                <span className="rank-number">#{currentRank}</span>
                <span className="rank-label">YOUR GLOBAL RANK</span>
              </div>
              <div className="rank-message-wrapper">
                <p className="rank-message">
                  Keep participating in events, sharing, and engaging to climb the leaderboard!
                </p>
                {tierInfo.ptsAway > 0 && (
                  <div className="next-tier-badge">
                    <span className="next-tier-icon">🎖️</span>
                    <span>Next: <strong>{tierInfo.next}</strong> — {tierInfo.ptsAway} pts away</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Badges Tab Content */}
        {activeTab === 'Badges' && (
          <div className="tab-content badges-content">
            <div className="stats-section-header">
              <h3>🏅 YOUR BADGES & MILESTONES</h3>
            </div>
            <div className="achievements-list" style={{ flexWrap: 'wrap', gap: '20px' }}>
              <div className="achievement-card">
                <div className="achievement-icon pink">🎫</div>
                <div className="achievement-info">
                  <h4>First Registration</h4>
                  <p>Registered for your first event!</p>
                </div>
              </div>
              <div className={`achievement-card ${points < 50 ? 'locked-badge' : ''}`} style={points < 50 ? {opacity: 0.5} : {}}>
                <div className="achievement-icon pink" style={{background: '#e0e7ff', color: '#4f46e5'}}>🥈</div>
                <div className="achievement-info">
                  <h4>Silver Medalist</h4>
                  <p>{points < 50 ? 'Locked (Requires 50 points)' : 'Reached Silver tier milestone!'}</p>
                </div>
              </div>
              <div className={`achievement-card ${points < 150 ? 'locked-badge' : ''}`} style={points < 150 ? {opacity: 0.5} : {}}>
                <div className="achievement-icon pink" style={{background: '#fef3c7', color: '#d97706'}}>🥇</div>
                <div className="achievement-info">
                  <h4>Gold Champion</h4>
                  <p>{points < 150 ? 'Locked (Requires 150 points)' : 'Reached Gold tier milestone!'}</p>
                </div>
              </div>
              <div className={`achievement-card ${points < 300 ? 'locked-badge' : ''}`} style={points < 300 ? {opacity: 0.5} : {}}>
                <div className="achievement-icon pink" style={{background: '#fae8ff', color: '#c084fc'}}>💎</div>
                <div className="achievement-info">
                  <h4>Platinum Legend</h4>
                  <p>{points < 300 ? 'Locked (Requires 300 points)' : 'Reached Platinum tier milestone!'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Calendar View */}
        {activeTab === 'Calendar' && (
          <div className="tab-content calendar-content">
            <div className="stats-section-header">
              <h3>📅 MY EVENT CALENDAR</h3>
            </div>
            <p className="calendar-desc">Track and launch registered campus events for <strong>July 2026</strong>.</p>
            
            <div className="calendar-card">
              <div className="calendar-header-title">
                <h4>July 2026</h4>
              </div>
              <div className="calendar-grid-header">
                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
              </div>
              <div className="calendar-grid-body">
                {calendarDays.map((day, idx) => {
                  const dayEvents = getEventsForDay(day);
                  return (
                    <div key={idx} className={`calendar-day-cell ${!day ? 'empty' : ''} ${dayEvents.length > 0 ? 'has-event' : ''}`}>
                      <span className="day-number">{day}</span>
                      <div className="day-event-tags">
                        {dayEvents.map(e => (
                          <div 
                            key={e._id} 
                            onClick={() => { setSelectedEvent(e); setIsEventDetailModalOpen(true); }}
                            className="calendar-event-tag"
                            title={e.title}
                          >
                            ⭐ {e.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Saved Events Tab */}
        {activeTab === 'Saved' && (
          <div className="tab-content saved-liked-registered-content">
            <div className="stats-section-header">
              <h3>🔖 SAVED EVENTS</h3>
            </div>
            {savedIds.length === 0 ? (
              <div className="no-events-placeholder">
                <span className="placeholder-icon">📁</span>
                <p>No saved events yet. Browse events on the Dashboard to save your favorites!</p>
              </div>
            ) : (
              <div className="profile-mini-events-grid">
                {events.filter(e => savedIds.includes(e._id)).map(event => (
                  <div key={event._id} className="profile-mini-card">
                    <h4>{event.title}</h4>
                    <span className="mini-card-club">{event.clubName || 'College Club'}</span>
                    <p className="mini-card-meta">📅 {formatDate(event.date)}</p>
                    <p className="mini-card-meta">📍 {event.location}</p>
                    <div className="mini-card-actions">
                      <button onClick={() => { setSelectedEvent(event); setIsEventDetailModalOpen(true); }} className="btn-details">Details</button>
                      <button onClick={() => handleUnsaveEvent(event._id)} className="btn-remove">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Liked Events Tab */}
        {activeTab === 'Liked' && (
          <div className="tab-content saved-liked-registered-content">
            <div className="stats-section-header">
              <h3>❤️ LIKED EVENTS</h3>
            </div>
            {likedIds.length === 0 ? (
              <div className="no-events-placeholder">
                <span className="placeholder-icon">🤍</span>
                <p>No liked events yet. Tap the Heart icon on event cards in the Dashboard to show support!</p>
              </div>
            ) : (
              <div className="profile-mini-events-grid">
                {events.filter(e => likedIds.includes(e._id)).map(event => (
                  <div key={event._id} className="profile-mini-card">
                    <h4>{event.title}</h4>
                    <span className="mini-card-club">{event.clubName || 'College Club'}</span>
                    <p className="mini-card-meta">📅 {formatDate(event.date)}</p>
                    <p className="mini-card-meta">📍 {event.location}</p>
                    <div className="mini-card-actions">
                      <button onClick={() => { setSelectedEvent(event); setIsEventDetailModalOpen(true); }} className="btn-details">Details</button>
                      <button onClick={() => handleUnlikeEvent(event._id)} className="btn-unlike">Unlike</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Registered Events Tab */}
        {activeTab === 'Registered' && (
          <div className="tab-content saved-liked-registered-content">
            <div className="stats-section-header">
              <h3>📝 REGISTERED EVENTS</h3>
            </div>
            {registrations.length === 0 ? (
              <div className="no-events-placeholder">
                <span className="placeholder-icon">🎫</span>
                <p>You have not registered for any events yet.</p>
              </div>
            ) : (
              <div className="profile-mini-events-grid">
                {registrations.map(reg => {
                  const event = events.find(e => e._id === reg.eventId) || {
                    title: reg.eventTitle, date: reg.date, location: 'Main Campus'
                  };
                  return (
                    <div key={reg.id} className="profile-mini-card">
                      <h4>{event.title}</h4>
                      <span className={`badge-status ${reg.status.toLowerCase()}`}>{reg.status}</span>
                      <p className="mini-card-meta">📅 {formatDate(event.date)}</p>
                      <p className="mini-card-meta">📍 {event.location}</p>
                      <p className="mini-card-meta" style={{fontSize: '11px', color: '#9ca3af'}}>Registered on: {new Date(reg.date).toLocaleDateString()}</p>
                      <div className="mini-card-actions">
                        <button onClick={() => { setSelectedEvent(event); setIsEventDetailModalOpen(true); }} className="btn-details" style={{width: '100%'}}>View Details</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Inbox Tab Content */}
        {activeTab === 'Inbox' && (
          <div className="tab-content inbox-content">
            <div className="stats-section-header">
              <h3>📥 NOTIFICATIONS & ANNOUNCEMENTS</h3>
            </div>
            {announcements.length === 0 ? (
              <div className="no-events-placeholder">
                <span className="placeholder-icon">📬</span>
                <p>Your inbox is empty. No announcements published.</p>
              </div>
            ) : (
              <div className="inbox-list">
                {announcements.map(ann => (
                  <div key={ann.id} className="announcement-item">
                    <div className="ann-meta">
                      <strong className="ann-author">📢 {ann.author}</strong>
                      <span className="ann-date">{new Date(ann.date).toLocaleDateString()}</span>
                    </div>
                    <h4 className="ann-title">{ann.title}</h4>
                    <p className="ann-body">{ann.body}</p>
                    <button 
                      onClick={() => {
                        const updated = announcements.filter(a => a.id !== ann.id);
                        setAnnouncements(updated);
                        localStorage.setItem('dash_announcements', JSON.stringify(updated));
                      }} 
                      className="btn-dismiss"
                    >
                      Dismiss
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Tab Content */}
        {activeTab === 'Settings' && (
          <div className="tab-content settings-content-tab">
            <div className="settings-fields-grid">
              
              <div className="settings-field-card">
                <div className="settings-field-icon font-icon">👤</div>
                <div className="settings-field-details">
                  <span className="settings-field-label">FULL NAME</span>
                  <span className="settings-field-value">{user.name}</span>
                </div>
              </div>

              <div className="settings-field-card">
                <div className="settings-field-icon phone-icon">📱</div>
                <div className="settings-field-details">
                  <span className="settings-field-label">MOBILE NUMBER</span>
                  <span className="settings-field-value">{user.mobileNumber || '—'}</span>
                </div>
              </div>

              <div className="settings-field-card">
                <div className="settings-field-icon email-icon">✉️</div>
                <div className="settings-field-details">
                  <span className="settings-field-label">EMAIL ADDRESS</span>
                  <span className="settings-field-value">{user.email}</span>
                </div>
              </div>

              <div className="settings-field-card">
                <div className="settings-field-icon dob-icon">🎂</div>
                <div className="settings-field-details">
                  <span className="settings-field-label">BIRTH DATE</span>
                  <span className="settings-field-value">
                    {user.dob ? new Date(user.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'DOB not added'}
                  </span>
                </div>
              </div>

              <div className="settings-field-card">
                <div className="settings-field-icon country-icon">🌐</div>
                <div className="settings-field-details">
                  <span className="settings-field-label">COUNTRY</span>
                  <span className="settings-field-value">{user.country || 'Not Specified'}</span>
                </div>
              </div>

              <div className="settings-field-card">
                <div className="settings-field-icon state-icon">🗺️</div>
                <div className="settings-field-details">
                  <span className="settings-field-label">STATE</span>
                  <span className="settings-field-value">{user.state || 'Not Specified'}</span>
                </div>
              </div>

              <div className="settings-field-card">
                <div className="settings-field-icon city-icon">🏙️</div>
                <div className="settings-field-details">
                  <span className="settings-field-label">CITY</span>
                  <span className="settings-field-value">{user.city || 'Not Specified'}</span>
                </div>
              </div>

            </div>

            <div className="settings-action-buttons">
              <button onClick={() => {
                setEditForm({
                  name: user.name || '',
                  mobileNumber: user.mobileNumber || '',
                  dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
                  country: user.country || '',
                  state: user.state || '',
                  city: user.city || ''
                });
                setSettingsError('');
                setSettingsSuccess('');
                setIsEditModalOpen(true);
              }} className="settings-btn edit-profile-btn">
                📝 Edit Profile
              </button>

              <button onClick={() => {
                setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
                setSettingsError('');
                setSettingsSuccess('');
                setIsPasswordModalOpen(true);
              }} className="settings-btn change-password-btn">
                🔒 Change Password
              </button>
            </div>

            <div className="settings-danger-zone">
              <div className="danger-zone-header">
                ⚠️ Danger Zone
              </div>
              <div className="danger-zone-body">
                <div className="danger-text">
                  <h4>Delete Account</h4>
                  <p>Once you delete your account, all your data will be permanently removed. This action cannot be undone.</p>
                </div>
                <button onClick={() => {
                  setSettingsError('');
                  setIsDeleteModalOpen(true);
                }} className="settings-btn delete-account-btn">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="profile-modal-content" onClick={e => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>📝 Edit Profile</h3>
              <button className="modal-close" onClick={() => setIsEditModalOpen(false)}>×</button>
            </div>
            {settingsError && <div className="modal-alert error">{settingsError}</div>}
            {settingsSuccess && <div className="modal-alert success">{settingsSuccess}</div>}
            <form onSubmit={handleEditProfileSubmit} className="profile-modal-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={e => setEditForm({ ...editForm, name: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input 
                  type="text" 
                  value={editForm.mobileNumber} 
                  onChange={e => setEditForm({ ...editForm, mobileNumber: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Birth Date</label>
                <input 
                  type="date" 
                  value={editForm.dob} 
                  onChange={e => setEditForm({ ...editForm, dob: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input 
                  type="text" 
                  value={editForm.country} 
                  onChange={e => setEditForm({ ...editForm, country: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input 
                  type="text" 
                  value={editForm.state} 
                  onChange={e => setEditForm({ ...editForm, state: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input 
                  type="text" 
                  value={editForm.city} 
                  onChange={e => setEditForm({ ...editForm, city: e.target.value })} 
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={settingsLoading}>
                  {settingsLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setIsPasswordModalOpen(false)}>
          <div className="profile-modal-content" onClick={e => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>🔒 Change Password</h3>
              <button className="modal-close" onClick={() => setIsPasswordModalOpen(false)}>×</button>
            </div>
            {settingsError && <div className="modal-alert error">{settingsError}</div>}
            {settingsSuccess && <div className="modal-alert success">{settingsSuccess}</div>}
            <form onSubmit={handleChangePasswordSubmit} className="profile-modal-form">
              <div className="form-group">
                <label>Current Password</label>
                <input 
                  type="password" 
                  value={passwordForm.currentPassword} 
                  onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword} 
                  onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.confirmNewPassword} 
                  onChange={e => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })} 
                  required 
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsPasswordModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={settingsLoading}>
                  {settingsLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="profile-modal-overlay" onClick={() => setIsDeleteModalOpen(false)}>
          <div className="profile-modal-content danger" onClick={e => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3>⚠️ Confirm Delete Account</h3>
              <button className="modal-close" onClick={() => setIsDeleteModalOpen(false)}>×</button>
            </div>
            {settingsError && <div className="modal-alert error">{settingsError}</div>}
            <div className="delete-modal-body" style={{ margin: '15px 0' }}>
              <p>Are you absolutely sure you want to delete your account? This action is <strong>irreversible</strong> and will delete all your events registration history and details.</p>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-cancel" onClick={() => setIsDeleteModalOpen(false)}>Cancel</button>
              <button type="button" className="btn-delete" onClick={handleDeleteAccountSubmit} disabled={settingsLoading}>
                {settingsLoading ? 'Deleting...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shared Event Details Modal */}
      {isEventDetailModalOpen && selectedEvent && (
        <div className="profile-modal-overlay" onClick={() => setIsEventDetailModalOpen(false)}>
          <div className="profile-modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '540px'}}>
            <div className="profile-modal-header" style={{background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(20,29,34,0.05) 100%)'}}>
              <h3 style={{color: 'var(--ace-primary, #22c55e)'}}>⭐ Event Details</h3>
              <button className="modal-close" onClick={() => setIsEventDetailModalOpen(false)}>×</button>
            </div>
            <div className="event-modal-body" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{margin: '0', fontSize: '20px', color: '#111827'}}>{selectedEvent.title}</h3>
              <span style={{background: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', width: 'fit-content'}}>
                {selectedEvent.clubName || 'College Club'}
              </span>
              <p style={{margin: '0', fontSize: '13px', color: '#4b5563', lineHeight: '1.6'}}>{selectedEvent.description}</p>
              
              <div className="modal-event-details-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #f3f4f6', paddingTop: '16px', marginTop: '8px'}}>
                <div>
                  <label style={{fontSize: '11px', fontWeight: '700', color: '#9ca3af'}}>DATE & TIME</label>
                  <p style={{margin: '4px 0 0 0', fontSize: '13px', fontWeight: '600', color: '#1f2937'}}>{formatDate(selectedEvent.date)}</p>
                </div>
                <div>
                  <label style={{fontSize: '11px', fontWeight: '700', color: '#9ca3af'}}>LOCATION</label>
                  <p style={{margin: '4px 0 0 0', fontSize: '13px', fontWeight: '600', color: '#1f2937'}}>{selectedEvent.location}</p>
                </div>
                <div>
                  <label style={{fontSize: '11px', fontWeight: '700', color: '#9ca3af'}}>CAPACITY</label>
                  <p style={{margin: '4px 0 0 0', fontSize: '13px', fontWeight: '600', color: '#1f2937'}}>{selectedEvent.capacity} seats</p>
                </div>
                {selectedEvent.organizer && (
                  <div>
                    <label style={{fontSize: '11px', fontWeight: '700', color: '#9ca3af'}}>ORGANIZER</label>
                    <p style={{margin: '4px 0 0 0', fontSize: '13px', fontWeight: '600', color: '#1f2937'}}>{selectedEvent.organizer.name}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-actions" style={{padding: '16px 24px', borderTop: '1px solid #f3f4f6', background: '#f9fafb'}}>
              <button className="btn-cancel" onClick={() => setIsEventDetailModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
