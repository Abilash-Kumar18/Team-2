import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: 'SHICHAN FAMILYS',
    email: 'shichanfamilys@gmail.com',
    role: 'student',
    picture: ''
  });

  // Education default values from screenshot
  const [profileData, setProfileData] = useState({
    college: 'ACHARYA SCHOOL OF MANAGEMENT',
    department: 'Computer Science Engineering',
    degree: 'B.E (Bachelor of Engineering)',
    specialization: 'Artificial Intelligence',
    followers: 0,
    following: 0,
    posts: 0,
    points: 0,
    rank: '--',
    won: 0
  });

  // Settings Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCollege, setFormCollege] = useState('');
  const [formDept, setFormDept] = useState('');
  const [formDegree, setFormDegree] = useState('');
  const [formSpec, setFormSpec] = useState('');

  useEffect(() => {
    // 1. Get main user from localStorage
    const storedUser = localStorage.getItem('user');
    let currentUser = null;
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        currentUser = parsed;
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }

    // 2. Load custom profile details
    const storedProfile = localStorage.getItem('custom_profile_data');
    if (storedProfile) {
      try {
        const parsedProfile = JSON.parse(storedProfile);
        setProfileData(prev => ({
          ...prev,
          ...parsedProfile
        }));
      } catch (e) {
        console.error('Failed to parse profile data', e);
      }
    } else if (currentUser) {
      // Fallback/derive details from user signup if possible
      const derivedDept = currentUser.deptYear || 'Computer Science Engineering';
      setProfileData(prev => ({
        ...prev,
        department: derivedDept
      }));
    }
  }, []);

  const openSettingsModal = () => {
    setFormName(user.name);
    setFormCollege(profileData.college);
    setFormDept(profileData.department);
    setFormDegree(profileData.degree);
    setFormSpec(profileData.specialization);
    setIsModalOpen(true);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();

    // 1. Update user name locally and in localStorage
    const updatedUser = { ...user, name: formName };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // 2. Update and save education fields
    const updatedProfile = {
      ...profileData,
      college: formCollege,
      department: formDept,
      degree: formDegree,
      specialization: formSpec
    };
    setProfileData(updatedProfile);
    localStorage.setItem('custom_profile_data', JSON.stringify(updatedProfile));

    setIsModalOpen(false);
  };

  // Helper to get initials
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Check if profile avatar is a Google profile photo URL
  const userAvatar = user.picture || user.avatarUrl || user.avatar;

  return (
    <div className="profile-page-container">
      {/* Back navigation */}
      <div className="profile-header-nav">
        <button onClick={() => navigate('/dashboard')} className="btn-go-back">
          ← Go Back
        </button>
      </div>

      {/* Main Profile Identity Card */}
      <div className="profile-hero-card">
        <div className="profile-identity-section">
          {/* Avatar with dynamic photo vs fallback initials */}
          <div className="profile-avatar-wrapper">
            {userAvatar ? (
              <img src={userAvatar} alt="Google Profile" className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-initials">
                {getInitials(user.name)}
              </div>
            )}
            <div className="profile-online-badge"></div>
          </div>

          <div className="profile-info-block">
            <div className="profile-name-row">
              <h2 className="profile-display-name">{user.name}</h2>
              {/* Verified Blue Check Badge */}
              <span className="verified-blue-badge" title="Verified Account">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </span>
            </div>

            <div className="profile-handle-row">
              <span className="profile-handle-text">
                @{user.name ? user.name.toLowerCase().replace(/\s+/g, '') : 'username'}
              </span>
              <span className="profile-badge-pill">Portfolio</span>
            </div>
          </div>

          <button onClick={openSettingsModal} className="btn-profile-settings">
            ⚙️ Profile Settings
          </button>
        </div>

        {/* Followers, Following, Posts Row */}
        <div className="profile-stats-row">
          <div className="profile-stat-box">
            <span className="profile-stat-number">{profileData.followers}</span>
            <span className="profile-stat-label">Followers</span>
          </div>
          <div className="profile-stat-box">
            <span className="profile-stat-number">{profileData.following}</span>
            <span className="profile-stat-label">Following</span>
          </div>
          <div className="profile-stat-box">
            <span className="profile-stat-number">{profileData.posts}</span>
            <span className="profile-stat-label">Posts</span>
          </div>
        </div>

        {/* Points & Rank Bronze Banner */}
        <div className="profile-points-banner">
          <div className="points-banner-item">
            <span className="points-banner-icon">🏆</span>
            <div className="points-banner-info">
              <span className="points-banner-value">{profileData.points}</span>
              <span className="points-banner-label">Points</span>
            </div>
          </div>

          <div className="points-banner-item">
            <div className="points-banner-info" style={{ textAlign: 'center' }}>
              <span className="points-banner-value">{profileData.rank}</span>
              <span className="points-banner-label">Rank</span>
            </div>
          </div>

          <div className="points-banner-item">
            <span className="points-banner-icon">🏅</span>
            <div className="points-banner-info">
              <span className="points-banner-value">{profileData.won}</span>
              <span className="points-banner-label">Won</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Bottom Grid */}
      <div className="profile-bottom-layout">
        
        {/* Education Sidebar */}
        <div className="profile-info-card">
          <div className="card-title-row">
            <span className="card-title-icon">🎓</span>
            <h3>Education</h3>
          </div>

          <div className="education-items-list">
            <div className="education-item-pill">
              <span className="education-pill-label">College</span>
              <span className="education-pill-value">{profileData.college}</span>
            </div>

            <div className="education-item-pill">
              <span className="education-pill-label">Department</span>
              <span className="education-pill-value">{profileData.department}</span>
            </div>

            <div className="education-item-pill">
              <span className="education-pill-label">Degree</span>
              <span className="education-pill-value">{profileData.degree}</span>
            </div>

            <div className="education-item-pill">
              <span className="education-pill-label">Specialization</span>
              <span className="education-pill-value">{profileData.specialization}</span>
            </div>
          </div>
        </div>

        {/* Content Column (Activity & Achievements) */}
        <div className="profile-content-column">
          
          {/* Activity Timeline Card */}
          <div className="profile-info-card">
            <div className="card-title-row">
              <span className="card-title-icon">🕒</span>
              <h3>Activity Timeline</h3>
            </div>
            <div className="profile-empty-state">
              <div className="empty-state-icon-circle">🕒</div>
              <h4>No Activities Yet</h4>
              <p>Start participating in events, earning achievements, and building your profile to see your activity timeline here!</p>
              <button onClick={() => navigate('/dashboard?tab=browse-events')} className="btn-browse-events btn-browse-green">
                Browse Events
              </button>
            </div>
          </div>

          {/* Achievements Card */}
          <div className="profile-info-card">
            <div className="card-title-row">
              <span className="card-title-icon">🏆</span>
              <h3>Achievements</h3>
            </div>
            <div className="profile-empty-state">
              <div className="empty-state-icon-circle">🏆</div>
              <h4>No Achievements Yet</h4>
              <p>Start participating in events to earn achievements and build your profile! Your journey to greatness begins here.</p>
              <button onClick={() => navigate('/dashboard?tab=browse-events')} className="btn-browse-events btn-browse-orange">
                Browse Events
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* Edit Settings Glassmorphic Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="settings-modal-card">
            <div className="modal-header">
              <h3>Edit Profile Details</h3>
              <button onClick={() => setIsModalOpen(false)} className="modal-close-btn">✕</button>
            </div>
            
            <form onSubmit={handleSaveSettings} className="modal-body">
              <div className="modal-form-group">
                <label>Display Name</label>
                <input 
                  type="text" 
                  value={formName} 
                  onChange={(e) => setFormName(e.target.value)} 
                  className="modal-input" 
                  required 
                />
              </div>

              <div className="modal-form-group">
                <label>College / School Name</label>
                <input 
                  type="text" 
                  value={formCollege} 
                  onChange={(e) => setFormCollege(e.target.value)} 
                  className="modal-input" 
                  required 
                />
              </div>

              <div className="modal-form-group">
                <label>Department</label>
                <input 
                  type="text" 
                  value={formDept} 
                  onChange={(e) => setFormDept(e.target.value)} 
                  className="modal-input" 
                  required 
                />
              </div>

              <div className="modal-form-group">
                <label>Degree</label>
                <input 
                  type="text" 
                  value={formDegree} 
                  onChange={(e) => setFormDegree(e.target.value)} 
                  className="modal-input" 
                  required 
                />
              </div>

              <div className="modal-form-group">
                <label>Specialization</label>
                <input 
                  type="text" 
                  value={formSpec} 
                  onChange={(e) => setFormSpec(e.target.value)} 
                  className="modal-input" 
                  required 
                />
              </div>

              <div className="modal-actions-row">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
