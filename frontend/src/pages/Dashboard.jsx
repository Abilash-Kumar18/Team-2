import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService, scanService } from '../services/api';
import './Dashboard.css';

// Default mock events in case backend is empty
const defaultEvents = [
  {
    _id: 'mock_event_1',
    title: 'Smart Tech Hackathon',
    description: 'A 24-hour coding marathon where students solve real-world industry challenges using cutting-edge AI and web technologies.',
    date: '2026-07-15T09:00:00.000Z',
    location: 'Main Seminar Hall',
    capacity: 100,
    clubName: 'Coding Club',
    organizer: { name: 'Coding Club Coordinator', email: 'coding@college.edu' }
  },
  {
    _id: 'mock_event_2',
    title: 'Robo Wars 2026',
    description: 'Design, build, and battle! Watch custom-engineered robots clash in a high-octane battle arena to win the grand cash prize.',
    date: '2026-07-22T10:00:00.000Z',
    location: 'College Indoor Stadium',
    capacity: 60,
    clubName: 'Robotics Club',
    organizer: { name: 'Robotics Coordinator', email: 'robotics@college.edu' }
  },
  {
    _id: 'mock_event_3',
    title: 'Cultural Fusion 2026',
    description: 'An evening of music, choreography, and dramatic performances celebrating national heritage and student talent.',
    date: '2026-08-05T17:00:00.000Z',
    location: 'Open Air Auditorium',
    capacity: 600,
    clubName: 'Arts & Music Club',
    organizer: { name: 'Cultural Committee', email: 'cultural@college.edu' }
  },
  {
    _id: 'mock_event_4',
    title: 'Web Craft React Workshop',
    description: 'Learn modern single-page application development using React, Vite, and tailwind. Perfect for beginners and intermediates.',
    date: '2026-06-10T10:00:00.000Z', // Closed/past event
    location: 'CSE Department Lab 3',
    capacity: 40,
    clubName: 'Web Dev Club',
    organizer: { name: 'Web Dev Coordinator', email: 'webdev@college.edu' }
  }
];

// Default announcements
const defaultAnnouncements = [
  {
    id: 'ann_1',
    title: 'Smart Tech Hackathon Registrations are Live!',
    body: 'Register before July 10th to confirm your participation. Team details can be submitted on the event plan tab.',
    date: '2026-06-25T11:00:00.000Z',
    author: 'Coding Club'
  },
  {
    id: 'ann_2',
    title: 'Robo Wars Safety Guidelines',
    body: 'All participating teams must download and review the mechanical guidelines PDF. Weight inspection starts at 8 AM.',
    date: '2026-06-24T09:30:00.000Z',
    author: 'Robotics Club'
  },
  {
    id: 'ann_3',
    title: 'Web Craft Workshop Certificates Released',
    body: 'Participants who checked in can now access and download their participation certificates directly from their certificates page.',
    date: '2026-06-12T16:00:00.000Z',
    author: 'Web Dev Club'
  }
];

// Default Staff
const defaultStaff = [
  { id: 'staff_1', name: 'Dr. A. Ramesh', dept: 'Computer Science', role: 'Event Coordinator', email: 'ramesh.cs@college.edu' },
  { id: 'staff_2', name: 'Mrs. K. Priya', dept: 'Information Technology', role: 'Faculty Advisor', email: 'priya.it@college.edu' },
  { id: 'staff_3', name: 'Sanjay Kumar', dept: 'Electrical Engineering', role: 'Student Volunteer Head', email: 'sanjay.ee@student.edu' }
];

// Default Clubs
const defaultClubs = [
  { id: 'club_1', name: 'Coding Club', dept: 'CSE & IT', president: 'Abishek R', desc: 'Promoting coding culture through workshops, hackathons, and technical projects.' },
  { id: 'club_2', name: 'Robotics Club', dept: 'ECE & EEE', president: 'Deepak S', desc: 'Fostering innovation in automation, embedded systems, and robotic systems.' },
  { id: 'club_3', name: 'Arts & Music Club', dept: 'All Depts', president: 'Sruthi V', desc: 'Bringing out artistic, theatrical, and musical capabilities of college students.' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Navigation Tab State synced with URL query (?tab=...)
  const [currentTab, setCurrentTab] = useState(() => {
    return new URLSearchParams(window.location.search).get('tab') || 'home';
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [browseFilter, setBrowseFilter] = useState('all'); // 'all' | 'upcoming' | 'closed'

  // Data States
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [staff, setStaff] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [results, setResults] = useState({});

  // Loading and Error States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Modals state
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventDetailModalOpen, setIsEventDetailModalOpen] = useState(false);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [isAddClubModalOpen, setIsAddClubModalOpen] = useState(false);
  const [isCreateAnnouncementModalOpen, setIsCreateAnnouncementModalOpen] = useState(false);
  const [isResultEntryModalOpen, setIsResultEntryModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Form Input States
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    capacity: 100,
    clubName: ''
  });

  const [staffForm, setStaffForm] = useState({
    name: '',
    dept: '',
    role: '',
    email: ''
  });

  const [clubForm, setClubForm] = useState({
    name: '',
    dept: '',
    president: '',
    desc: ''
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    body: '',
    author: ''
  });

  const [resultForm, setResultForm] = useState({
    eventId: '',
    firstPlace: '',
    secondPlace: '',
    thirdPlace: ''
  });

  // QR Scan Sim states
  const [qrScanEventId, setQrScanEventId] = useState('');
  const [qrScanStudentReg, setQrScanStudentReg] = useState('');
  const [qrScanResult, setQrScanResult] = useState(null);

  // Sync tab with URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set('tab', currentTab);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
  }, [currentTab]);

  // Auth check
  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  // Load Dashboard Data
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch events from API
        let apiEvents = [];
        try {
          apiEvents = await eventService.getAll();
        } catch (e) {
          console.warn('Backend API event fetch failed, falling back to default events.', e);
        }

        // Merge API events and fallback events
        const mergedEvents = apiEvents.length > 0 ? apiEvents : defaultEvents;
        setEvents(mergedEvents);

        // Load Persistent local storage data
        const storedAnn = localStorage.getItem('dash_announcements');
        if (storedAnn) {
          setAnnouncements(JSON.parse(storedAnn));
        } else {
          localStorage.setItem('dash_announcements', JSON.stringify(defaultAnnouncements));
          setAnnouncements(defaultAnnouncements);
        }

        const storedStaff = localStorage.getItem('dash_staff');
        if (storedStaff) {
          setStaff(JSON.parse(storedStaff));
        } else {
          localStorage.setItem('dash_staff', JSON.stringify(defaultStaff));
          setStaff(defaultStaff);
        }

        const storedClubs = localStorage.getItem('dash_clubs');
        if (storedClubs) {
          setClubs(JSON.parse(storedClubs));
        } else {
          localStorage.setItem('dash_clubs', JSON.stringify(defaultClubs));
          setClubs(defaultClubs);
        }

        const storedResults = localStorage.getItem('dash_results');
        if (storedResults) {
          setResults(JSON.parse(storedResults));
        }

        // Initialize user registrations list
        const userRegKey = `dash_registered_${user._id}`;
        const storedUserRegs = localStorage.getItem(userRegKey);
        const regIds = storedUserRegs ? JSON.parse(storedUserRegs) : [];
        setRegisteredEventIds(regIds);

        // Initialize general registrations table list (persisted globally in localStorage)
        const storedAllRegs = localStorage.getItem('dash_global_registrations');
        let allRegs = [];
        if (storedAllRegs) {
          allRegs = JSON.parse(storedAllRegs);
        } else {
          // Prepopulate some default registrations
          allRegs = [
            {
              id: 'reg_default_1',
              eventId: 'mock_event_1',
              eventTitle: 'Smart Tech Hackathon',
              studentId: user._id,
              studentName: user.name,
              studentReg: user.regNo || '21CSR01',
              studentEmail: user.email,
              date: new Date().toISOString(),
              status: 'Approved',
              checkedIn: false
            },
            {
              id: 'reg_default_2',
              eventId: 'mock_event_4',
              eventTitle: 'Web Craft React Workshop',
              studentId: user._id,
              studentName: user.name,
              studentReg: user.regNo || '21CSR01',
              studentEmail: user.email,
              date: '2026-06-08T10:00:00.000Z',
              status: 'Approved',
              checkedIn: true, // Attended
              checkInTime: '2026-06-10T10:15:00.000Z'
            }
          ];
          localStorage.setItem('dash_global_registrations', JSON.stringify(allRegs));
          // Prepopulate registered IDs for active user
          if (regIds.length === 0) {
            const initialIds = ['mock_event_1', 'mock_event_4'];
            localStorage.setItem(userRegKey, JSON.stringify(initialIds));
            setRegisteredEventIds(initialIds);
          }
        }
        setRegistrations(allRegs);

      } catch (err) {
        setError('Error loading dashboard data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Alert dismiss timers
  useEffect(() => {
    if (actionSuccess) {
      const timer = setTimeout(() => setActionSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [actionSuccess]);

  if (!user) return null;

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Student Actions: Register for event
  const handleRegisterEvent = async (event) => {
    if (registeredEventIds.includes(event._id)) {
      setActionSuccess('You are already registered for this event.');
      return;
    }

    try {
      // 1. Try real API registration
      try {
        await eventService.register(event._id);
      } catch (e) {
        console.warn('API registration check failed. Simulating local registration persistence.', e);
      }

      // 2. Persist registration locally in state/localStorage
      const updatedRegs = [...registeredEventIds, event._id];
      const userRegKey = `dash_registered_${user._id}`;
      localStorage.setItem(userRegKey, JSON.stringify(updatedRegs));
      setRegisteredEventIds(updatedRegs);

      // Add to global registrations log
      const newReg = {
        id: `reg_${Date.now()}`,
        eventId: event._id,
        eventTitle: event.title,
        studentId: user._id,
        studentName: user.name,
        studentReg: user.regNo || '21CSR01',
        studentEmail: user.email,
        date: new Date().toISOString(),
        status: 'Pending',
        checkedIn: false
      };
      const updatedGlobalRegs = [...registrations, newReg];
      localStorage.setItem('dash_global_registrations', JSON.stringify(updatedGlobalRegs));
      setRegistrations(updatedGlobalRegs);

      setActionSuccess(`Successfully registered for ${event.title}! Approval is pending from organizer.`);
      setIsEventDetailModalOpen(false);
    } catch (err) {
      setError(err.message || 'Registration failed. Capacity may be full.');
    }
  };

  // Organizer Actions: Create/Publish Event
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setError('');
    setActionSuccess('');

    if (!eventForm.title || !eventForm.description || !eventForm.date || !eventForm.location || !eventForm.clubName) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      let createdEvent = null;
      // 1. Try backend API save
      try {
        createdEvent = await eventService.create({
          title: eventForm.title,
          description: eventForm.description,
          date: new Date(eventForm.date).toISOString(),
          location: eventForm.location,
          capacity: parseInt(eventForm.capacity) || 100
        });
      } catch (err) {
        console.warn('Backend API event creation failed. Simulating local event creation.', err);
      }

      // 2. Fallback / merge locally
      if (!createdEvent) {
        createdEvent = {
          _id: `event_${Date.now()}`,
          title: eventForm.title,
          description: eventForm.description,
          date: new Date(eventForm.date).toISOString(),
          location: eventForm.location,
          capacity: parseInt(eventForm.capacity) || 100,
          clubName: eventForm.clubName,
          organizer: { name: user.name, email: user.email }
        };
      } else {
        // Enrich from form inputs
        createdEvent.clubName = eventForm.clubName;
      }

      const updatedEvents = [createdEvent, ...events];
      setEvents(updatedEvents);
      // Persist created events in localStorage if running completely offline
      localStorage.setItem('dash_custom_events', JSON.stringify(updatedEvents));

      setActionSuccess(`Successfully created event "${eventForm.title}"!`);
      setEventForm({ title: '', description: '', date: '', location: '', capacity: 100, clubName: user.clubName || '' });
      setCurrentTab('home'); // Go back to main dashboard
    } catch (err) {
      setError(err.message || 'Failed to create event. Make sure you are authorized.');
    }
  };

  // Organizer: Approve / Reject Student Registration
  const handleUpdateRegistrationStatus = (regId, status) => {
    const updated = registrations.map(reg => {
      if (reg.id === regId) {
        return { ...reg, status };
      }
      return reg;
    });
    setRegistrations(updated);
    localStorage.setItem('dash_global_registrations', JSON.stringify(updated));
    setActionSuccess(`Registration status updated to ${status}.`);
  };

  // Organizer: Add Staff
  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.dept || !staffForm.role || !staffForm.email) {
      setError('Please fill in all staff fields.');
      return;
    }
    const newStaff = {
      id: `staff_${Date.now()}`,
      ...staffForm
    };
    const updated = [...staff, newStaff];
    setStaff(updated);
    localStorage.setItem('dash_staff', JSON.stringify(updated));
    setStaffForm({ name: '', dept: '', role: '', email: '' });
    setIsAddStaffModalOpen(false);
    setActionSuccess('Staff member added successfully!');
  };

  // Organizer: Add Club
  const handleAddClub = (e) => {
    e.preventDefault();
    if (!clubForm.name || !clubForm.dept || !clubForm.president || !clubForm.desc) {
      setError('Please fill in all club fields.');
      return;
    }
    const newClub = {
      id: `club_${Date.now()}`,
      ...clubForm
    };
    const updated = [...clubs, newClub];
    setClubs(updated);
    localStorage.setItem('dash_clubs', JSON.stringify(updated));
    setClubForm({ name: '', dept: '', president: '', desc: '' });
    setIsAddClubModalOpen(false);
    setActionSuccess('Club added successfully!');
  };

  // Organizer: Create Announcement
  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementForm.title || !announcementForm.body) {
      setError('Please provide announcement title and content.');
      return;
    }
    const newAnn = {
      id: `ann_${Date.now()}`,
      title: announcementForm.title,
      body: announcementForm.body,
      date: new Date().toISOString(),
      author: announcementForm.author || user.name
    };
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('dash_announcements', JSON.stringify(updated));
    setAnnouncementForm({ title: '', body: '', author: '' });
    setIsCreateAnnouncementModalOpen(false);
    setActionSuccess('New announcement published successfully!');
  };

  // Organizer: Result Entry
  const handleAddResult = (e) => {
    e.preventDefault();
    if (!resultForm.eventId || !resultForm.firstPlace) {
      setError('Please select an event and fill at least the first place winner.');
      return;
    }
    const updatedResults = {
      ...results,
      [resultForm.eventId]: {
        firstPlace: resultForm.firstPlace,
        secondPlace: resultForm.secondPlace,
        thirdPlace: resultForm.thirdPlace,
        datePublished: new Date().toISOString()
      }
    };
    setResults(updatedResults);
    localStorage.setItem('dash_results', JSON.stringify(updatedResults));
    setResultForm({ eventId: '', firstPlace: '', secondPlace: '', thirdPlace: '' });
    setIsResultEntryModalOpen(false);
    setActionSuccess('Event results published successfully!');
  };

  // Organizer: Scan check-in attendee simulation
  const handleCheckInSimulate = async (studentRegStr, eventIdStr) => {
    setQrScanResult(null);
    setError('');

    const targetEventId = eventIdStr || qrScanEventId;
    const targetStudentReg = studentRegStr || qrScanStudentReg;

    if (!targetEventId || !targetStudentReg) {
      setError('Please select an event and enter Student ID/Registration Number.');
      return;
    }

    // Find if the registration exists
    const reg = registrations.find(r => r.eventId === targetEventId && (r.studentReg.toLowerCase() === targetStudentReg.toLowerCase() || r.studentName.toLowerCase() === targetStudentReg.toLowerCase()));

    if (!reg) {
      setQrScanResult({
        success: false,
        message: 'No registration record found for this student and event.'
      });
      return;
    }

    if (reg.status !== 'Approved') {
      setQrScanResult({
        success: false,
        message: 'Attendee registration is pending or rejected.'
      });
      return;
    }

    if (reg.checkedIn) {
      setQrScanResult({
        success: true,
        alreadyIn: true,
        message: `${reg.studentName} is already checked in.`,
        reg
      });
      return;
    }

    // Try scanning on backend API if matching details exist
    try {
      const qrData = JSON.stringify({ userId: reg.studentId, eventId: reg.eventId });
      await scanService.checkIn(qrData);
    } catch (e) {
      console.warn('Backend API scan failed. Simulating local check-in.', e);
    }

    // Mark checkedIn local state
    const updatedRegs = registrations.map(r => {
      if (r.id === reg.id) {
        return { ...r, checkedIn: true, checkInTime: new Date().toISOString() };
      }
      return r;
    });

    setRegistrations(updatedRegs);
    localStorage.setItem('dash_global_registrations', JSON.stringify(updatedRegs));
    setQrScanResult({
      success: true,
      message: `${reg.studentName} checked in successfully!`,
      reg: { ...reg, checkedIn: true, checkInTime: new Date().toISOString() }
    });
    setQrScanStudentReg('');
  };

  // Toggle checkedIn manual checklist state
  const handleToggleAttendanceCheck = (regId) => {
    const updated = registrations.map(r => {
      if (r.id === regId) {
        const isChecked = !r.checkedIn;
        return {
          ...r,
          checkedIn: isChecked,
          checkInTime: isChecked ? new Date().toISOString() : undefined
        };
      }
      return r;
    });
    setRegistrations(updated);
    localStorage.setItem('dash_global_registrations', JSON.stringify(updated));
    setActionSuccess('Attendance status updated.');
  };

  // Export report simulated trigger
  const handleExportReport = (format) => {
    setActionSuccess(`Compiling statistics... File "College_Event_Report_${Date.now()}.${format}" generated and downloading.`);
  };

  // Helper date text formatter
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + ' at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // Menu lists based on user role
  const isStudent = user.role === 'student';
  const isOrganizer = user.role === 'organizer';
  
  const studentTabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'browse-events', label: 'Browse Events', icon: '🔍' },
    { id: 'registrations', label: 'My Registrations', icon: '📝' },
    { id: 'attendance', label: 'My Attendance', icon: '📱' },
    { id: 'certificates', label: 'My Certificates', icon: '🏆' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    { id: 'calendar', label: 'Calendar', icon: '🗓️' },
    { id: 'profile', label: 'My Profile', icon: '👤' }
  ];

  const organizerTabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'event-plan', label: 'Event Plan', icon: '📅' },
    { id: 'registrations', label: 'Registrations', icon: '📝' },
    { id: 'approve-events', label: 'Approve Events', icon: '✅' },
    { id: 'announcements', label: 'Announcements', icon: '📢' },
    { id: 'staff', label: 'Staff Management', icon: '👥' },
    { id: 'clubs', label: 'Clubs Management', icon: '🏢' },
    { id: 'qr-attendance', label: 'QR Attendance', icon: '📱' },
    { id: 'attendance-list', label: 'Attendance List', icon: '📋' },
    { id: 'result-entry', label: 'Result Entry', icon: '🥇' },
    { id: 'report-menu', label: 'Report Menu', icon: '📊' },
    { id: 'profile', label: 'My Profile', icon: '👤' }
  ];

  const facultyTabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'faculty-events', label: 'Event Page', icon: '📅' },
    { id: 'faculty-registrations', label: 'Student Registrations', icon: '👨‍🎓' },
    { id: 'faculty-approve', label: 'Approve Events', icon: '✅' },
    { id: 'faculty-announcements', label: 'Announcements', icon: '📢' },
    { id: 'faculty-attendance', label: 'Attendance', icon: '📋' },
    { id: 'faculty-reports', label: 'Reports', icon: '📊' },
    { id: 'profile', label: 'My Profile', icon: '👤' }
  ];

  const isFaculty = user.role === 'faculty';
  const tabsToRender = isStudent ? studentTabs : isFaculty ? facultyTabs : organizerTabs;

  return (
    <div className="dashboard-container">
      {/* Sidebar backdrop */}
      {isSidebarOpen && <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />}

      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="user-avatar" style={{ borderRadius: '10px' }}>🏫</div>
          <div className="sidebar-title-container">
            <span className="sidebar-title">CAMPUS EVENTS</span>
            <span className="sidebar-subtitle">{isStudent ? 'Student Portal' : 'Organizer Portal'}</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          {tabsToRender.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setCurrentTab(tab.id);
                setIsSidebarOpen(false);
              }}
              className={`nav-item ${currentTab === tab.id ? 'active' : ''}`}
            >
              <span style={{ fontSize: '18px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-summary-card">
            <div className="user-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-info-brief">
              <span className="user-name-brief">{user.name}</span>
              <span className="user-role-brief">{user.role}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="nav-item" style={{ width: '100%', color: '#ff6b6b' }}>
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Dashboard Pages */}
      <main className="dashboard-main">
        {/* Topbar Welcome / Burger toggler */}
        <div className="dashboard-topbar">
          <div className="welcome-section">
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              aria-expanded={isSidebarOpen}
            >
              {isSidebarOpen ? '✕' : '☰'}
            </button>
            <div className="welcome-text">
              <h1>Welcome, {user.name}!</h1>
              <p>Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <span className="profile-role-badge">{user.role}</span>
          </div>
        </div>

        {/* Global Notifications */}
        {actionSuccess && (
          <div className="badge badge-success" style={{ padding: '12px 20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', width: '100%', fontSize: '14px' }}>
            ✨ {actionSuccess}
          </div>
        )}
        {error && (
          <div className="error-message" style={{ marginBottom: '20px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Render Tab Contents */}
        {loading ? (
          <div className="spinner">Loading campus network...</div>
        ) : (
          <>
            {/* -------------------- STUDENT DASHBOARD FLOWS -------------------- */}
            {isStudent && (
              <>
                {/* 1. Student Home Tab */}
                {currentTab === 'home' && (
                  <div>
                    {/* 1. Build Skills & Connect with Campus on the top below the welcome */}
                    <div className="dashboard-summary-banner" style={{ marginTop: '10px', marginBottom: '24px' }}>
                      <div className="banner-text">
                        <h2>Build Skills & Connect with Campus</h2>
                        <p>Explore technical events, hands-on workshops, and competitions. Register to participate, log attendance with QR codes, and download verified certificates.</p>
                      </div>
                    </div>

                    {/* 2. Overview (stats-grid) made a little bigger using stat-card-lg */}
                    <div className="stats-grid" style={{ marginBottom: '32px' }}>
                      <div className="stat-card stat-card-lg">
                        <div className="stat-icon">📝</div>
                        <div className="stat-info">
                          <span className="stat-value">{registeredEventIds.length}</span>
                          <span className="stat-label">Registered Events</span>
                        </div>
                      </div>
                      <div className="stat-card stat-card-lg">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                          <span className="stat-value">
                            {registrations.filter(r => r.studentId === user._id && r.checkedIn).length}
                          </span>
                          <span className="stat-label">Attended Events</span>
                        </div>
                      </div>
                      <div className="stat-card stat-card-lg">
                        <div className="stat-icon">🏆</div>
                        <div className="stat-info">
                          <span className="stat-value">
                            {registrations.filter(r => r.studentId === user._id && r.checkedIn).length}
                          </span>
                          <span className="stat-label">Certificates Earned</span>
                        </div>
                      </div>
                    </div>

                    {/* 3. Upcoming Recommended Events below overview */}
                    <div className="section-header" style={{ marginBottom: '16px' }}>
                      <h3 style={{ margin: 0 }}>Upcoming Recommended Events</h3>
                    </div>

                    <div className="event-grid">
                      {events.filter(e => new Date(e.date) >= new Date()).slice(0, 3).map((event) => {
                        const isRegistered = registeredEventIds.includes(event._id);
                        return (
                          <div key={event._id} className="dash-event-card">
                            <div className="event-card-header">
                              <span className="event-card-club">{event.clubName || 'College Club'}</span>
                            </div>
                            <div className="event-card-content">
                              <h4 className="event-card-title">{event.title}</h4>
                              <p className="event-card-desc">{event.description}</p>
                              <div className="event-card-info-row">
                                <div className="event-card-info-item">
                                  <span>📅</span> {formatDate(event.date)}
                                </div>
                                <div className="event-card-info-item">
                                  <span>📍</span> {event.location}
                                </div>
                              </div>
                              <div className="event-card-action-row">
                                <button
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    setIsEventDetailModalOpen(true);
                                  }}
                                  className="dash-btn dash-btn-secondary"
                                >
                                  Details
                                </button>
                                <button
                                  disabled={isRegistered}
                                  onClick={() => handleRegisterEvent(event)}
                                  className="dash-btn dash-btn-primary"
                                >
                                  {isRegistered ? 'Registered' : 'Quick Register'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Button for Upcoming Events at the bottom-right of this section */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', marginBottom: '32px' }}>
                      <button 
                        onClick={() => setCurrentTab('browse-events')} 
                        className="dash-btn dash-btn-outline" 
                        style={{ width: '90px', padding: '4px 10px', fontSize: '11px' }}
                      >
                        Browse All
                      </button>
                    </div>

                    {/* Separately: My Registrations and Announcements down the overview */}
                    <div className="home-split-grid">
                      {/* Left: My Registrations */}
                      <div className="home-column-section" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                        <div>
                          <div className="section-header" style={{ marginBottom: '16px' }}>
                            <h3 style={{ margin: 0 }}>My Registrations</h3>
                          </div>
                          <div className="dash-table-container">
                            <table className="dash-table">
                              <thead>
                                <tr>
                                  <th>Event</th>
                                  <th>Date</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {registrations.filter(r => r.studentId === user._id).slice().reverse().slice(0, 3).map((reg) => (
                                  <tr key={reg.id}>
                                    <td style={{ fontWeight: 'bold' }}>{reg.eventTitle}</td>
                                    <td>
                                      {formatDate(events.find(e => e._id === reg.eventId)?.date)}
                                    </td>
                                    <td>
                                      <span className={`badge ${
                                        reg.status === 'Approved' ? 'badge-success' :
                                        reg.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                                      }`}>
                                        {reg.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                                {registrations.filter(r => r.studentId === user._id).length === 0 && (
                                  <tr>
                                    <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: 'var(--dash-text-muted)' }}>
                                      No registered events yet.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        {/* Button for Registrations at the bottom-right of this section */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                          <button 
                            onClick={() => setCurrentTab('registrations')} 
                            className="dash-btn dash-btn-outline" 
                            style={{ width: '80px', padding: '4px 10px', fontSize: '11px' }}
                          >
                            View All
                          </button>
                        </div>
                      </div>

                      {/* Right: Latest Announcements */}
                      <div className="home-column-section" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                        <div>
                          <div className="section-header" style={{ marginBottom: '16px' }}>
                            <h3 style={{ margin: 0 }}>Latest Announcements</h3>
                          </div>
                          <div className="home-announcements-list">
                            {announcements.slice().reverse().slice(0, 3).map((ann) => (
                              <div key={ann.id} className="announcement-card" style={{ marginBottom: '12px', padding: '16px' }}>
                                <div className="announcement-header">
                                  <span className="announcement-title" style={{ fontSize: '14px' }}>{ann.title}</span>
                                  <span className="announcement-date">{formatDate(ann.date)}</span>
                                </div>
                                <p className="announcement-body" style={{ fontSize: '12.5px', margin: '6px 0 0 0' }}>{ann.body}</p>
                                <div className="announcement-author" style={{ fontSize: '10px', marginTop: '6px' }}>By: {ann.author}</div>
                              </div>
                            ))}
                            {announcements.length === 0 && (
                              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--dash-text-muted)', background: 'var(--dash-card-bg)', border: '1px dashed var(--dash-border)', borderRadius: '12px' }}>
                                No announcements yet.
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Button for Announcements at the bottom-right of this section */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                          <button 
                            onClick={() => setCurrentTab('announcements')} 
                            className="dash-btn dash-btn-outline" 
                            style={{ width: '80px', padding: '4px 10px', fontSize: '11px' }}
                          >
                            View All
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Student Browse Events Tab */}
                {currentTab === 'browse-events' && (() => {
                  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date());
                  const closedEvents   = events.filter(e => new Date(e.date) <  new Date());
                  const filteredEvents =
                    browseFilter === 'upcoming' ? upcomingEvents :
                    browseFilter === 'closed'   ? closedEvents   : events;

                  return (
                    <div>
                      {/* Header + Filter Tabs */}
                      <div className="section-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
                        <h3>Explore Campus Events</h3>
                        <div className="filter-tabs">
                          <button
                            className={`filter-btn ${browseFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setBrowseFilter('all')}
                          >
                            All&nbsp;<span style={{ opacity: 0.7 }}>({events.length})</span>
                          </button>
                          <button
                            className={`filter-btn ${browseFilter === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setBrowseFilter('upcoming')}
                          >
                            🟢 Upcoming&nbsp;<span style={{ opacity: 0.7 }}>({upcomingEvents.length})</span>
                          </button>
                          <button
                            className={`filter-btn ${browseFilter === 'closed' ? 'active' : ''}`}
                            onClick={() => setBrowseFilter('closed')}
                          >
                            🔴 Closed&nbsp;<span style={{ opacity: 0.7 }}>({closedEvents.length})</span>
                          </button>
                        </div>
                      </div>

                      {/* Event Cards */}
                      {filteredEvents.length === 0 ? (
                        <div style={{
                          textAlign: 'center', padding: '60px 20px',
                          color: 'var(--dash-text-muted)', fontSize: '15px'
                        }}>
                          {browseFilter === 'upcoming' ? '🗓️ No upcoming events at the moment. Check back soon!' :
                           browseFilter === 'closed'   ? '📁 No closed events found.' :
                           '📭 No events available.'}
                        </div>
                      ) : (
                        <div className="event-grid" style={{ marginTop: '20px' }}>
                          {filteredEvents.map((event) => {
                            const isRegistered = registeredEventIds.includes(event._id);
                            const isPast = new Date(event.date) < new Date();
                            return (
                              <div key={event._id} className="dash-event-card">
                                <div
                                  className="event-card-header"
                                  style={{
                                    background: isPast
                                      ? 'linear-gradient(135deg, rgba(80,80,80,0.4) 0%, rgba(20,20,20,0.9) 100%)'
                                      : 'linear-gradient(135deg, rgba(91,184,37,0.3) 0%, rgba(20,29,34,0.9) 100%)'
                                  }}
                                >
                                  <span className="event-card-club">{event.clubName || 'College Club'}</span>
                                  <span
                                    className="event-card-tag"
                                    style={isPast
                                      ? { background: '#444', color: '#aaa' }
                                      : { background: 'var(--brand-green-light)', color: 'var(--brand-text-green)' }
                                    }
                                  >
                                    {isPast ? '🔴 Closed' : '🟢 Upcoming'}
                                  </span>
                                </div>

                                <div className="event-card-content">
                                  <h4 className="event-card-title">{event.title}</h4>
                                  <p className="event-card-desc">{event.description}</p>
                                  <div className="event-card-info-row">
                                    <div className="event-card-info-item"><span>📅</span> {formatDate(event.date)}</div>
                                    <div className="event-card-info-item"><span>📍</span> {event.location}</div>
                                    <div className="event-card-info-item"><span>👥</span> Capacity: {event.capacity} seats</div>
                                  </div>
                                  <div className="event-card-action-row">
                                    <button
                                      onClick={() => { setSelectedEvent(event); setIsEventDetailModalOpen(true); }}
                                      className="dash-btn dash-btn-secondary"
                                    >
                                      Details
                                    </button>
                                    <button
                                      disabled={isRegistered || isPast}
                                      onClick={() => handleRegisterEvent(event)}
                                      className="dash-btn dash-btn-primary"
                                    >
                                      {isPast ? 'Closed' : isRegistered ? '✓ Registered' : 'Register Now'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 3. Student My Registrations Tab */}
                {currentTab === 'registrations' && (
                  <div>
                    <div className="section-header">
                      <h3>My Registered Events</h3>
                    </div>

                    <div className="dash-table-container">
                      <table className="dash-table">
                        <thead>
                          <tr>
                            <th>Event Title</th>
                            <th>Date & Time</th>
                            <th>Registration Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations.filter(r => r.studentId === user._id).map((reg) => (
                            <tr key={reg.id}>
                              <td style={{ fontWeight: 'bold' }}>{reg.eventTitle}</td>
                              <td>
                                {formatDate(events.find(e => e._id === reg.eventId)?.date)}
                              </td>
                              <td>{new Date(reg.date).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge ${
                                  reg.status === 'Approved' ? 'badge-success' :
                                  reg.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                                }`}>
                                  {reg.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {registrations.filter(r => r.studentId === user._id).length === 0 && (
                            <tr>
                              <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: 'var(--dash-text-muted)' }}>
                                You have not registered for any events yet. Click "Browse Events" to start.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. Student My Attendance Tab */}
                {currentTab === 'attendance' && (
                  <div>
                    <div className="section-header">
                      <h3>My Event Attendance & QR Entry</h3>
                    </div>

                    <div className="profile-layout">
                      <div className="profile-card">
                        <div className="qr-placeholder-svg" style={{ margin: '0 auto 20px auto' }}>
                          {/* Visual representation of a digital QR ticket */}
                          <div style={{ padding: '8px', border: '1px solid #ddd', background: '#fff' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 15px)', gridTemplateRows: 'repeat(10, 15px)', gap: '2px' }}>
                              {Array.from({ length: 100 }).map((_, i) => (
                                <div key={i} style={{
                                  width: '100%',
                                  height: '100%',
                                  backgroundColor: (i % 3 === 0 || i % 7 === 0 || (i > 10 && i < 20) || (i > 80 && i < 90)) ? '#000' : '#fff'
                                }}></div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <h3>Digital Check-In QR</h3>
                        <p style={{ fontSize: '12px' }}>Present this QR code at the event check-in counter to log attendance.</p>
                        <span className="profile-role-badge" style={{ backgroundColor: 'var(--brand-green-light)', color: '#3a7a10' }}>
                          ID: {user.regNo || user._id.slice(-6)}
                        </span>
                      </div>

                      <div>
                        <h3>Attendance Log</h3>
                        <div className="dash-table-container" style={{ marginTop: '16px' }}>
                          <table className="dash-table">
                            <thead>
                              <tr>
                                <th>Event Title</th>
                                <th>Check-in Status</th>
                                <th>Time logged</th>
                              </tr>
                            </thead>
                            <tbody>
                              {registrations.filter(r => r.studentId === user._id && r.status === 'Approved').map((reg) => (
                                <tr key={reg.id}>
                                  <td style={{ fontWeight: 'bold' }}>{reg.eventTitle}</td>
                                  <td>
                                    <span className={`badge ${reg.checkedIn ? 'badge-success' : 'badge-warning'}`}>
                                      {reg.checkedIn ? 'Present ✓' : 'Absent / Pending Scan'}
                                    </span>
                                  </td>
                                  <td>
                                    {reg.checkedIn ? formatDate(reg.checkInTime) : '--'}
                                  </td>
                                </tr>
                              ))}
                              {registrations.filter(r => r.studentId === user._id && r.status === 'Approved').length === 0 && (
                                <tr>
                                  <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: 'var(--dash-text-muted)' }}>
                                    No approved registrations found. Attendance is loggable only for approved events.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Student My Certificates Tab */}
                {currentTab === 'certificates' && (
                  <div>
                    <div className="section-header">
                      <h3>Participation & Winners Certificates</h3>
                    </div>

                    <div className="event-grid">
                      {registrations.filter(r => r.studentId === user._id && r.checkedIn).map((reg) => {
                        const hasWinnerResult = Object.entries(results).find(([eventId, val]) => {
                          return eventId === reg.eventId && (val.firstPlace.toLowerCase() === user.name.toLowerCase() || val.secondPlace.toLowerCase() === user.name.toLowerCase() || val.thirdPlace.toLowerCase() === user.name.toLowerCase());
                        });

                        return (
                          <div key={reg.id} className="dash-event-card" style={{ borderLeft: '4px solid var(--brand-green-light)' }}>
                            <div className="event-card-content" style={{ padding: '24px' }}>
                              <span style={{ fontSize: '32px' }}>🏆</span>
                              <h4 className="event-card-title" style={{ marginTop: '10px' }}>{reg.eventTitle}</h4>
                              <p className="event-card-desc">Verified Certificate of Participation</p>
                              {hasWinnerResult && (
                                <span className="badge badge-success" style={{ width: 'fit-content', marginTop: '6px' }}>
                                  Winner Placement Awarded!
                                </span>
                              )}
                              <div style={{ marginTop: '20px' }}>
                                <button
                                  onClick={() => setSelectedCertificate({
                                    eventTitle: reg.eventTitle,
                                    date: events.find(e => e._id === reg.eventId)?.date || reg.checkInTime,
                                    clubName: events.find(e => e._id === reg.eventId)?.clubName || 'College Events Club',
                                    isWinner: !!hasWinnerResult
                                  })}
                                  className="dash-btn dash-btn-primary"
                                >
                                  View Certificate
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {registrations.filter(r => r.studentId === user._id && r.checkedIn).length === 0 && (
                        <div style={{ width: '100%', gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px', background: 'var(--dash-card-bg)', border: '1px dashed var(--dash-border)', borderRadius: '12px' }}>
                          <span style={{ fontSize: '48px' }}>🎓</span>
                          <h4 style={{ color: '#fff', marginTop: '16px' }}>No Certificates Earned Yet</h4>
                          <p style={{ color: 'var(--dash-text-muted)', fontSize: '14px', maxWidth: '400px', margin: '8px auto 0 auto' }}>
                            Certificates are automatically generated after you register, attend, and are checked in at the event venue by the organizer.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 6. Student Announcements Tab */}
                {currentTab === 'announcements' && (
                  <div>
                    <div className="section-header">
                      <h3>Campus & Club Announcements</h3>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                      {announcements.map((ann) => (
                        <div key={ann.id} className="announcement-card">
                          <div className="announcement-header">
                            <span className="announcement-title">{ann.title}</span>
                            <span className="announcement-date">{formatDate(ann.date)}</span>
                          </div>
                          <p className="announcement-body">{ann.body}</p>
                          <div className="announcement-author">Posted by: {ann.author}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. Student Calendar Tab */}
                {currentTab === 'calendar' && (
                  <div>
                    <div className="section-header">
                      <h3>Event Schedule Calendar - June/July 2026</h3>
                    </div>

                    <div className="dash-table-container" style={{ padding: '20px' }}>
                      <div className="calendar-grid">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                          <div key={d} className="calendar-header-day">{d}</div>
                        ))}
                        {/* Print dates 28 to 30 of previous month */}
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={`prev-${i}`} className="calendar-day-box" style={{ opacity: 0.25 }}>
                            <span className="calendar-day-number">{28 + i}</span>
                          </div>
                        ))}
                        {/* Current month dates (June 1 to 30) */}
                        {Array.from({ length: 30 }).map((_, i) => {
                          const dayNum = i + 1;
                          const dateStr = `2026-06-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                          const dayEvents = events.filter(e => e.date.substring(0, 10) === dateStr);

                          return (
                            <div key={`june-${dayNum}`} className={`calendar-day-box ${dayNum === 26 ? 'today' : ''}`}>
                              <span className="calendar-day-number">{dayNum}</span>
                              {dayEvents.map(de => (
                                <div key={de._id} className="calendar-event-dot" title={de.title}>
                                  {de.title}
                                </div>
                              ))}
                            </div>
                          );
                        })}
                        {/* Next month July dates (July 1 to 2) */}
                        {Array.from({ length: 2 }).map((_, i) => {
                          const dayNum = i + 1;
                          const dateStr = `2026-07-0${dayNum}`;
                          const dayEvents = events.filter(e => e.date.substring(0, 10) === dateStr);

                          return (
                            <div key={`july-${dayNum}`} className="calendar-day-box">
                              <span className="calendar-day-number" style={{ color: 'var(--brand-green-light)' }}>Jul {dayNum}</span>
                              {dayEvents.map(de => (
                                <div key={de._id} className="calendar-event-dot" title={de.title}>
                                  {de.title}
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* -------------------- ORGANIZER DASHBOARD FLOWS -------------------- */}
            {isOrganizer && (
              <>
                {/* 1. Organizer Home Tab */}
                {currentTab === 'home' && (
                  <div>
                    <div className="dashboard-summary-banner">
                      <div className="banner-text">
                        <h2>Manage Events & Staff Accounts</h2>
                        <p>Draft technical specifications, authorize volunteer lists, post announcements, run QR attendance trackers, and export comprehensive spreadsheets.</p>
                      </div>
                      <button onClick={() => setCurrentTab('event-plan')} className="dash-btn dash-btn-primary" style={{ width: 'auto' }}>
                        + Plan New Event
                      </button>
                    </div>

                    <div className="stats-grid">
                      <div className="stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-info">
                          <span className="stat-value">{events.length}</span>
                          <span className="stat-label">Events Managed</span>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                          <span className="stat-value">{registrations.length}</span>
                          <span className="stat-label">Registrations Logged</span>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-info">
                          <span className="stat-value">
                            {registrations.filter(r => r.status === 'Pending').length}
                          </span>
                          <span className="stat-label">Pending Approvals</span>
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-icon">🏢</div>
                        <div className="stat-info">
                          <span className="stat-value">{clubs.length}</span>
                          <span className="stat-label">Active Clubs</span>
                        </div>
                      </div>
                    </div>

                    <div className="section-header">
                      <h3>Active Events Registry</h3>
                    </div>

                    <div className="dash-table-container">
                      <table className="dash-table">
                        <thead>
                          <tr>
                            <th>Event Name</th>
                            <th>Date & Time</th>
                            <th>Venue</th>
                            <th>Capacity Limit</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.map((event) => (
                            <tr key={event._id}>
                              <td style={{ fontWeight: 'bold' }}>{event.title}</td>
                              <td>{formatDate(event.date)}</td>
                              <td>{event.location}</td>
                              <td>{event.capacity} seats</td>
                              <td>
                                <button
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    setIsEventDetailModalOpen(true);
                                  }}
                                  className="dash-btn dash-btn-secondary"
                                  style={{ padding: '4px 10px', fontSize: '11px' }}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. Organizer Event Plan Form Tab */}
                {currentTab === 'event-plan' && (
                  <div>
                    <div className="section-header">
                      <h3>Plan & Publish College Event</h3>
                    </div>

                    <div className="dash-table-container" style={{ padding: '30px' }}>
                      <form onSubmit={handleCreateEvent} className="dash-form">
                        <div className="dash-form-group">
                          <label>Event Title</label>
                          <input
                            type="text"
                            value={eventForm.title}
                            onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                            className="dash-input"
                            placeholder="Enter event name (e.g. Codeathon 2026)"
                            required
                          />
                        </div>
                        <div className="dash-form-group">
                          <label>Organizing Club</label>
                          <input
                            type="text"
                            value={eventForm.clubName}
                            onChange={(e) => setEventForm({ ...eventForm, clubName: e.target.value })}
                            className="dash-input"
                            placeholder="e.g. Coding Club"
                            required
                          />
                        </div>

                        <div className="dash-form-group">
                          <label>Event Description</label>
                          <textarea
                            value={eventForm.description}
                            onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                            className="dash-textarea"
                            placeholder="Detail event schedule, constraints, criteria, and prize pools..."
                            required
                          ></textarea>
                        </div>

                        <div className="dash-form-group">
                          <label>Scheduled Date & Time</label>
                          <input
                            type="datetime-local"
                            value={eventForm.date}
                            onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                            className="dash-input"
                            required
                          />
                        </div>
                        <div className="dash-form-group">
                          <label>Venue Location</label>
                          <input
                            type="text"
                            value={eventForm.location}
                            onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                            className="dash-input"
                            placeholder="e.g. Main Auditorium"
                            required
                          />
                        </div>
                        <div className="dash-form-group">
                          <label>Capacity Limit (Attendees)</label>
                          <input
                            type="number"
                            value={eventForm.capacity}
                            onChange={(e) => setEventForm({ ...eventForm, capacity: e.target.value })}
                            className="dash-input"
                            min="10"
                            required
                          />
                        </div>


                        <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                          <button type="submit" className="dash-btn dash-btn-primary">
                            Publish Event Listing
                          </button>
                          <button type="button" onClick={() => setCurrentTab('home')} className="dash-btn dash-btn-secondary">
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* 3. Organizer Registrations Approval Tab */}
                {currentTab === 'registrations' && (
                  <div>
                    <div className="section-header">
                      <h3>Review Student Registrations</h3>
                    </div>

                    <div className="dash-table-container">
                      <table className="dash-table">
                        <thead>
                          <tr>
                            <th>Student Name</th>
                            <th>Reg Number</th>
                            <th>Event Applied</th>
                            <th>Date Applied</th>
                            <th>Current Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations.map((reg) => (
                            <tr key={reg.id}>
                              <td style={{ fontWeight: 'bold' }}>{reg.studentName}</td>
                              <td>{reg.studentReg}</td>
                              <td>{reg.eventTitle}</td>
                              <td>{new Date(reg.date).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge ${
                                  reg.status === 'Approved' ? 'badge-success' :
                                  reg.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                                }`}>
                                  {reg.status}
                                </span>
                              </td>
                              <td style={{ display: 'flex', gap: '6px' }}>
                                {reg.status === 'Pending' ? (
                                  <>
                                    <button
                                      onClick={() => handleUpdateRegistrationStatus(reg.id, 'Approved')}
                                      className="dash-btn dash-btn-primary"
                                      style={{ padding: '4px 8px', fontSize: '11px', flex: 'none' }}
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => handleUpdateRegistrationStatus(reg.id, 'Rejected')}
                                      className="dash-btn dash-btn-secondary"
                                      style={{ padding: '4px 8px', fontSize: '11px', flex: 'none', color: '#ff6b6b' }}
                                    >
                                      Reject
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateRegistrationStatus(reg.id, 'Pending')}
                                    className="dash-btn dash-btn-outline"
                                    style={{ padding: '4px 8px', fontSize: '11px', flex: 'none' }}
                                  >
                                    Reset to Pending
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                          {registrations.length === 0 && (
                            <tr>
                              <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--dash-text-muted)' }}>
                                No registrations logged on the server.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. Organizer Approve Events Panel */}
                {currentTab === 'approve-events' && (
                  <div>
                    <div className="section-header">
                      <h3>Approve Proposed Events</h3>
                    </div>

                    <div className="dash-table-container" style={{ padding: '24px' }}>
                      <div className="badge badge-info" style={{ width: '100%', padding: '16px', display: 'flex', borderRadius: '8px', marginBottom: '20px' }}>
                        ℹ️ This admin module manages proposals submitted by minor student chapters before they go public.
                      </div>

                      <table className="dash-table">
                        <thead>
                          <tr>
                            <th>Proposing Club</th>
                            <th>Proposed Event</th>
                            <th>Proposed Venue</th>
                            <th>Estimated Cost</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: 'bold' }}>Astronomy Club</td>
                            <td>Star Gazing Night 2026</td>
                            <td>Academic Block C Terrace</td>
                            <td>$150</td>
                            <td>
                              <button onClick={() => setActionSuccess('Approved astronomy event proposed.')} className="dash-btn dash-btn-primary" style={{ padding: '4px 10px', fontSize: '11px' }}>
                                Approve
                              </button>
                            </td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: 'bold' }}>Gaming League</td>
                            <td>VALORANT Campus Cup</td>
                            <td>CSE Seminar Hall</td>
                            <td>$400</td>
                            <td>
                              <button onClick={() => setActionSuccess('Approved gaming league proposal.')} className="dash-btn dash-btn-primary" style={{ padding: '4px 10px', fontSize: '11px' }}>
                                Approve
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 5. Organizer Announcements Creation Tab */}
                {currentTab === 'announcements' && (
                  <div>
                    <div className="section-header">
                      <h3>Announcements Broadcast Feed</h3>
                      <button onClick={() => setIsCreateAnnouncementModalOpen(true)} className="dash-btn dash-btn-primary" style={{ width: 'auto' }}>
                        + Post Announcement
                      </button>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                      {announcements.map((ann) => (
                        <div key={ann.id} className="announcement-card">
                          <div className="announcement-header">
                            <span className="announcement-title">{ann.title}</span>
                            <span className="announcement-date">{formatDate(ann.date)}</span>
                          </div>
                          <p className="announcement-body">{ann.body}</p>
                          <div className="announcement-author">Published by: {ann.author}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Organizer Staff Tab */}
                {currentTab === 'staff' && (
                  <div>
                    <div className="section-header">
                      <h3>Staff & Volunteer Roster</h3>
                      <button onClick={() => setIsAddStaffModalOpen(true)} className="dash-btn dash-btn-primary" style={{ width: 'auto' }}>
                        + Add Staff/Volunteer
                      </button>
                    </div>

                    <div className="dash-table-container" style={{ marginTop: '20px' }}>
                      <table className="dash-table">
                        <thead>
                          <tr>
                            <th>Staff Name</th>
                            <th>Department</th>
                            <th>System Role</th>
                            <th>Contact Email</th>
                          </tr>
                        </thead>
                        <tbody>
                          {staff.map((s) => (
                            <tr key={s.id}>
                              <td style={{ fontWeight: 'bold' }}>{s.name}</td>
                              <td>{s.dept}</td>
                              <td>
                                <span className={`badge ${s.role.includes('Faculty') || s.role.includes('Coordinator') ? 'badge-success' : 'badge-info'}`}>
                                  {s.role}
                                </span>
                              </td>
                              <td>{s.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 7. Organizer Clubs Tab */}
                {currentTab === 'clubs' && (
                  <div>
                    <div className="section-header">
                      <h3>Affiliated Clubs Directory</h3>
                      <button onClick={() => setIsAddClubModalOpen(true)} className="dash-btn dash-btn-primary" style={{ width: 'auto' }}>
                        + Add New Club
                      </button>
                    </div>

                    <div className="dash-table-container" style={{ marginTop: '20px' }}>
                      <table className="dash-table">
                        <thead>
                          <tr>
                            <th>Club Name</th>
                            <th>Department Scope</th>
                            <th>President Name</th>
                            <th>Description Summary</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clubs.map((c) => (
                            <tr key={c.id}>
                              <td style={{ fontWeight: 'bold' }}>{c.name}</td>
                              <td>{c.dept}</td>
                              <td>{c.president}</td>
                              <td style={{ color: 'var(--dash-text-muted)' }}>{c.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 8. Organizer QR Attendance Simulation Tab */}
                {currentTab === 'qr-attendance' && (
                  <div>
                    <div className="section-header">
                      <h3>QR Code Attendance Scanning</h3>
                    </div>

                    <div className="profile-layout">
                      <div className="profile-card">
                        <h3>Mock QR Scanner</h3>
                        <div className="qr-scanner-camera-feed" style={{ marginTop: '20px' }}>
                          <div className="scanner-laser"></div>
                          <span style={{ fontSize: '32px' }}>📷</span>
                          <span className="viewfinder-text">Position QR ticket code within grid...</span>
                        </div>
                      </div>

                      <div className="dash-table-container" style={{ padding: '24px' }}>
                        <h3 style={{ margin: '0 0 16px 0' }}>Scan Input Simulator</h3>
                        
                        <div className="dash-form">
                          <div className="dash-form-group">
                            <label>1. Select Event</label>
                            <select
                              value={qrScanEventId}
                              onChange={(e) => setQrScanEventId(e.target.value)}
                              className="dash-select"
                            >
                              <option value="">-- Choose Event --</option>
                              {events.map(ev => (
                                <option key={ev._id} value={ev._id}>{ev.title}</option>
                              ))}
                            </select>
                          </div>

                          <div className="dash-form-group">
                            <label>2. Scan Registration Number / Name</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input
                                type="text"
                                value={qrScanStudentReg}
                                onChange={(e) => setQrScanStudentReg(e.target.value)}
                                className="dash-input"
                                placeholder="Scan/Type Reg. No (e.g. 21CSR01) or Name"
                              />
                              <button
                                onClick={() => handleCheckInSimulate()}
                                className="dash-btn dash-btn-primary"
                                style={{ flex: 'none', width: 'auto' }}
                              >
                                Trigger Scan
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Scanner Simulated Quick Action Toggles */}
                        <div style={{ marginTop: '20px', borderTop: '1px solid var(--dash-border)', paddingTop: '16px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--dash-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                            Quick Simulation Profiles:
                          </span>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {registrations.filter(r => r.eventId === qrScanEventId && !r.checkedIn).map(reg => (
                              <button
                                key={reg.id}
                                onClick={() => handleCheckInSimulate(reg.studentReg, qrScanEventId)}
                                className="dash-btn dash-btn-outline"
                                style={{ padding: '6px 12px', fontSize: '11px', width: 'auto', flex: 'none' }}
                              >
                                Scan ticket: {reg.studentName} ({reg.studentReg})
                              </button>
                            ))}
                            {registrations.filter(r => r.eventId === qrScanEventId && !r.checkedIn).length === 0 && (
                              <p style={{ fontSize: '12px', color: 'var(--dash-text-muted)', margin: 0 }}>
                                (Select an event with pending approved registrations to view quick profiles)
                              </p>
                            )}
                          </div>
                        </div>

                        {qrScanResult && (
                          <div className={qrScanResult.success ? 'scan-success' : 'scan-error'} style={{ marginTop: '20px', color: '#fff' }}>
                            <h4 style={{ margin: '0 0 6px 0' }}>{qrScanResult.success ? '✓ Scan Accepted' : '❌ Scan Error'}</h4>
                            <p style={{ margin: 0, fontSize: '13px' }}>{qrScanResult.message}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 9. Organizer Attendance Checklist Tab */}
                {currentTab === 'attendance-list' && (
                  <div>
                    <div className="section-header">
                      <h3>Manual Attendance Checklist</h3>
                    </div>

                    <div className="dash-table-container" style={{ padding: '24px' }}>
                      <div className="dash-form-group" style={{ maxWidth: '400px', marginBottom: '20px' }}>
                        <label>Select Event Roster</label>
                        <select
                          value={qrScanEventId}
                          onChange={(e) => setQrScanEventId(e.target.value)}
                          className="dash-select"
                        >
                          <option value="">-- Select Event --</option>
                          {events.map(ev => (
                            <option key={ev._id} value={ev._id}>{ev.title}</option>
                          ))}
                        </select>
                      </div>

                      <table className="dash-table">
                        <thead>
                          <tr>
                            <th>Student Name</th>
                            <th>Reg. Number</th>
                            <th>Email</th>
                            <th>Attendance Checked</th>
                            <th>Timestamp Logged</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations.filter(r => r.eventId === qrScanEventId).map((reg) => (
                            <tr key={reg.id}>
                              <td style={{ fontWeight: 'bold' }}>{reg.studentName}</td>
                              <td>{reg.studentReg}</td>
                              <td>{reg.studentEmail}</td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={reg.checkedIn}
                                  onChange={() => handleToggleAttendanceCheck(reg.id)}
                                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <span style={{ marginLeft: '8px', fontSize: '12px', verticalAlign: 'super' }}>
                                  {reg.checkedIn ? 'Present' : 'Absent'}
                                </span>
                              </td>
                              <td>{reg.checkedIn ? formatDate(reg.checkInTime) : '--'}</td>
                            </tr>
                          ))}
                          {(!qrScanEventId) && (
                            <tr>
                              <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--dash-text-muted)' }}>
                                Please select an event to view its attendee checklist.
                              </td>
                            </tr>
                          )}
                          {qrScanEventId && registrations.filter(r => r.eventId === qrScanEventId).length === 0 && (
                            <tr>
                              <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--dash-text-muted)' }}>
                                No student registrations approved for this event.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 10. Organizer Result Entry Tab */}
                {currentTab === 'result-entry' && (
                  <div>
                    <div className="section-header">
                      <h3>Announce Competition Winners</h3>
                      <button onClick={() => setIsResultEntryModalOpen(true)} className="dash-btn dash-btn-primary" style={{ width: 'auto' }}>
                        Publish Winners Result
                      </button>
                    </div>

                    <div className="dash-table-container" style={{ marginTop: '20px' }}>
                      <table className="dash-table">
                        <thead>
                          <tr>
                            <th>Event Name</th>
                            <th>🥇 1st Place</th>
                            <th>🥈 2nd Place</th>
                            <th>🥉 3rd Place</th>
                            <th>Date Published</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(results).map(([eventId, val]) => (
                            <tr key={eventId}>
                              <td style={{ fontWeight: 'bold' }}>
                                {events.find(e => e._id === eventId)?.title || 'Hackathon / Event'}
                              </td>
                              <td><span style={{ fontSize: '14px' }}>🥇</span> {val.firstPlace}</td>
                              <td><span style={{ fontSize: '14px' }}>🥈</span> {val.secondPlace}</td>
                              <td><span style={{ fontSize: '14px' }}>🥉</span> {val.thirdPlace}</td>
                              <td>{new Date(val.datePublished).toLocaleDateString()}</td>
                            </tr>
                          ))}
                          {Object.keys(results).length === 0 && (
                            <tr>
                              <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--dash-text-muted)' }}>
                                No winners results announced yet. Click "Publish Winners Result" to begin.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 11. Organizer Report Menu Tab */}
                {currentTab === 'report-menu' && (
                  <div>
                    <div className="section-header">
                      <h3>Reports & Analytics Menu</h3>
                    </div>

                    <div className="profile-layout">
                      <div className="profile-card">
                        <h3>Download Formats</h3>
                        <p>Generate analytical sheets of registration trends, attendance metrics, and winner pools.</p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '16px' }}>
                          <button onClick={() => handleExportReport('xlsx')} className="dash-btn dash-btn-primary">
                            Export Excel Worksheet (.xlsx)
                          </button>
                          <button onClick={() => handleExportReport('pdf')} className="dash-btn dash-btn-outline">
                            Export PDF Report (.pdf)
                          </button>
                          <button onClick={() => handleExportReport('csv')} className="dash-btn dash-btn-secondary">
                            Export Raw Data (.csv)
                          </button>
                        </div>
                      </div>

                      <div className="dash-table-container" style={{ padding: '24px' }}>
                        <h3>Report Statistics Summaries</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--dash-border)' }}>
                            <span style={{ color: 'var(--dash-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Participation Rate</span>
                            <h4 style={{ color: '#fff', fontSize: '20px', margin: '4px 0 0 0' }}>
                              {registrations.length > 0
                                ? Math.round((registrations.filter(r => r.checkedIn).length / registrations.length) * 100)
                                : 0}%
                            </h4>
                          </div>
                          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--dash-border)' }}>
                            <span style={{ color: 'var(--dash-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Total Accounts Registered</span>
                            <h4 style={{ color: '#fff', fontSize: '20px', margin: '4px 0 0 0' }}>
                              {new Set(registrations.map(r => r.studentId)).size} Students
                            </h4>
                          </div>
                          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--dash-border)' }}>
                            <span style={{ color: 'var(--dash-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Clubs represented</span>
                            <h4 style={{ color: '#fff', fontSize: '20px', margin: '4px 0 0 0' }}>{clubs.length}</h4>
                          </div>
                          <div style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--dash-border)' }}>
                            <span style={{ color: 'var(--dash-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Seeded Staff Coordinators</span>
                            <h4 style={{ color: '#fff', fontSize: '20px', margin: '4px 0 0 0' }}>{staff.length}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* -------------------- FACULTY DASHBOARD FLOWS -------------------- */}
            {isFaculty && (
              <>
                {/* 1. Faculty Home Tab */}
                {currentTab === 'home' && (
                  <div>
                    <div className="faculty-summary-banner">
                      <div className="banner-text">
                        <h2>Faculty Event Management Dashboard</h2>
                        <p>Oversee student participation, approve event proposals, monitor attendance, and generate comprehensive reports.</p>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="stats-grid">
                      <div className="stat-card faculty-stat-card">
                        <div className="stat-icon">📅</div>
                        <div className="stat-info">
                          <span className="stat-value">{events.length}</span>
                          <span className="stat-label">Active Events</span>
                        </div>
                      </div>
                      <div className="stat-card faculty-stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                          <span className="stat-value">{registrations.length}</span>
                          <span className="stat-label">Total Registrations</span>
                        </div>
                      </div>
                      <div className="stat-card faculty-stat-card">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-info">
                          <span className="stat-value">
                            {registrations.filter(r => r.status === 'Pending').length}
                          </span>
                          <span className="stat-label">Pending Approvals</span>
                        </div>
                      </div>
                      <div className="stat-card faculty-stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                          <span className="stat-value">
                            {registrations.filter(r => r.checkedIn).length}
                          </span>
                          <span className="stat-label">Checked In</span>
                        </div>
                      </div>
                    </div>

                    {/* Pending Approvals Card */}
                    <div className="section-header" style={{ marginTop: '32px', marginBottom: '20px' }}>
                      <h3>Pending Event Approvals</h3>
                    </div>

                    <div className="dash-table-container">
                      <table className="dash-table">
                        <thead>
                          <tr>
                            <th>Event Name</th>
                            <th>Club</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.slice(0, 3).map((event) => (
                            <tr key={event._id}>
                              <td style={{ fontWeight: 'bold' }}>{event.title}</td>
                              <td>{event.clubName}</td>
                              <td>{formatDate(event.date)}</td>
                              <td>
                                <span className="badge badge-warning">Pending Review</span>
                              </td>
                              <td>
                                <button
                                  onClick={() => setCurrentTab('faculty-approve')}
                                  className="dash-btn dash-btn-outline"
                                  style={{ padding: '4px 10px', fontSize: '11px' }}
                                >
                                  Review
                                </button>
                              </td>
                            </tr>
                          ))}
                          {events.length === 0 && (
                            <tr>
                              <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: 'var(--dash-text-muted)' }}>
                                No pending approvals.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Recent Activity */}
                    <div className="section-header" style={{ marginTop: '32px', marginBottom: '20px' }}>
                      <h3>Recent Activity</h3>
                    </div>

                    <div className="home-announcements-list">
                      {announcements.slice().reverse().slice(0, 4).map((ann) => (
                        <div key={ann.id} className="announcement-card" style={{ marginBottom: '12px' }}>
                          <div className="announcement-header">
                            <span className="announcement-title" style={{ fontSize: '14px' }}>{ann.title}</span>
                            <span className="announcement-date">{formatDate(ann.date)}</span>
                          </div>
                          <p className="announcement-body" style={{ fontSize: '12.5px', margin: '6px 0 0 0' }}>{ann.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Faculty Event Page Tab */}
                {currentTab === 'faculty-events' && (() => {
                  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date());
                  const closedEvents = events.filter(e => new Date(e.date) < new Date());
                  const filteredEvents =
                    browseFilter === 'upcoming' ? upcomingEvents :
                    browseFilter === 'closed' ? closedEvents : events;

                  return (
                    <div>
                      <div className="section-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
                        <h3>College Events</h3>
                        <div className="filter-tabs">
                          <button
                            className={`filter-btn ${browseFilter === 'all' ? 'active' : ''}`}
                            onClick={() => setBrowseFilter('all')}
                          >
                            All ({events.length})
                          </button>
                          <button
                            className={`filter-btn ${browseFilter === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setBrowseFilter('upcoming')}
                          >
                            🟢 Upcoming ({upcomingEvents.length})
                          </button>
                          <button
                            className={`filter-btn ${browseFilter === 'closed' ? 'active' : ''}`}
                            onClick={() => setBrowseFilter('closed')}
                          >
                            🔴 Closed ({closedEvents.length})
                          </button>
                        </div>
                      </div>

                      <div className="event-grid" style={{ marginTop: '20px' }}>
                        {filteredEvents.map((event) => {
                          const isPast = new Date(event.date) < new Date();
                          const eventRegs = registrations.filter(r => r.eventId === event._id);
                          return (
                            <div key={event._id} className="dash-event-card">
                              <div
                                className="event-card-header"
                                style={{
                                  background: isPast
                                    ? 'linear-gradient(135deg, rgba(80,80,80,0.4) 0%, rgba(20,20,20,0.9) 100%)'
                                    : 'linear-gradient(135deg, rgba(96,150,186,0.3) 0%, rgba(20,29,34,0.9) 100%)'
                                }}
                              >
                                <span className="event-card-club">{event.clubName}</span>
                              </div>

                              <div className="event-card-content">
                                <h4 className="event-card-title">{event.title}</h4>
                                <p className="event-card-desc">{event.description}</p>
                                <div className="event-card-info-row">
                                  <div className="event-card-info-item"><span>📅</span> {formatDate(event.date)}</div>
                                  <div className="event-card-info-item"><span>📍</span> {event.location}</div>
                                  <div className="event-card-info-item"><span>👥</span> {eventRegs.length} registered</div>
                                </div>
                                <div className="event-card-action-row">
                                  <button
                                    onClick={() => { setSelectedEvent(event); setIsEventDetailModalOpen(true); }}
                                    className="dash-btn dash-btn-secondary"
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* 3. Faculty Student Registrations Tab */}
                {currentTab === 'faculty-registrations' && (
                  <div>
                    <div className="section-header">
                      <h3>Student Event Registrations</h3>
                    </div>

                    <div className="dash-table-container" style={{ marginBottom: '20px', padding: '16px' }}>
                      <div className="dash-form-group" style={{ maxWidth: '400px' }}>
                        <label>Filter by Event</label>
                        <select
                          value={qrScanEventId}
                          onChange={(e) => setQrScanEventId(e.target.value)}
                          className="dash-select"
                        >
                          <option value="">-- All Events --</option>
                          {events.map(ev => (
                            <option key={ev._id} value={ev._id}>{ev.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Stats for selected event */}
                    {qrScanEventId && (
                      <div className="stats-grid" style={{ marginBottom: '24px' }}>
                        <div className="stat-card faculty-stat-card">
                          <div className="stat-icon">📝</div>
                          <div className="stat-info">
                            <span className="stat-value">{registrations.filter(r => r.eventId === qrScanEventId).length}</span>
                            <span className="stat-label">Total Registered</span>
                          </div>
                        </div>
                        <div className="stat-card faculty-stat-card">
                          <div className="stat-icon">✅</div>
                          <div className="stat-info">
                            <span className="stat-value">
                              {registrations.filter(r => r.eventId === qrScanEventId && r.checkedIn).length}
                            </span>
                            <span className="stat-label">Attended</span>
                          </div>
                        </div>
                        <div className="stat-card faculty-stat-card">
                          <div className="stat-icon">⏳</div>
                          <div className="stat-info">
                            <span className="stat-value">
                              {registrations.filter(r => r.eventId === qrScanEventId && r.status === 'Pending').length}
                            </span>
                            <span className="stat-label">Pending Approval</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="dash-table-container">
                      <table className="dash-table">
                        <thead>
                          <tr>
                            <th>Student Name</th>
                            <th>Reg. Number</th>
                            <th>Email</th>
                            <th>Event</th>
                            <th>Status</th>
                            <th>Attended</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(qrScanEventId
                            ? registrations.filter(r => r.eventId === qrScanEventId)
                            : registrations).map((reg) => (
                            <tr key={reg.id}>
                              <td style={{ fontWeight: 'bold' }}>{reg.studentName}</td>
                              <td>{reg.studentReg}</td>
                              <td>{reg.studentEmail}</td>
                              <td>{reg.eventTitle}</td>
                              <td>
                                <span className={`badge ${
                                  reg.status === 'Approved' ? 'badge-success' :
                                  reg.status === 'Rejected' ? 'badge-danger' : 'badge-warning'
                                }`}>
                                  {reg.status}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${reg.checkedIn ? 'badge-success' : 'badge-warning'}`}>
                                  {reg.checkedIn ? 'Yes ✓' : 'No'}
                                </span>
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={reg.checkedIn}
                                  onChange={() => handleToggleAttendanceCheck(reg.id)}
                                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                  title="Mark attendance"
                                />
                              </td>
                            </tr>
                          ))}
                          {registrations.length === 0 && (
                            <tr>
                              <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--dash-text-muted)' }}>
                                No student registrations found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. Faculty Approve Events Tab */}
                {currentTab === 'faculty-approve' && (
                  <div>
                    <div className="section-header">
                      <h3>Event Approval Panel</h3>
                    </div>

                    <div className="filter-tabs" style={{ marginBottom: '20px' }}>
                      <button
                        className={`filter-btn ${browseFilter === 'pending' ? 'active' : ''}`}
                        onClick={() => setBrowseFilter('pending')}
                      >
                        ⏳ Pending
                      </button>
                      <button
                        className={`filter-btn ${browseFilter === 'approved' ? 'active' : ''}`}
                        onClick={() => setBrowseFilter('approved')}
                      >
                        ✅ Approved
                      </button>
                      <button
                        className={`filter-btn ${browseFilter === 'rejected' ? 'active' : ''}`}
                        onClick={() => setBrowseFilter('rejected')}
                      >
                        ❌ Rejected
                      </button>
                    </div>

                    <div className="dash-table-container">
                      <table className="dash-table">
                        <thead>
                          <tr>
                            <th>Event Name</th>
                            <th>Club</th>
                            <th>Date</th>
                            <th>Venue</th>
                            <th>Capacity</th>
                            <th>Approval Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.map((event, idx) => {
                            const statusToShow = browseFilter === 'pending' ? 'Pending Review' :
                              browseFilter === 'approved' ? 'Approved' :
                              browseFilter === 'rejected' ? 'Rejected' : 'Pending Review';
                            // For demo, alternate statuses
                            const demoStatus = idx % 3 === 0 ? 'Pending Review' : idx % 3 === 1 ? 'Approved' : 'Rejected';
                            if (browseFilter !== 'all' && statusToShow !== demoStatus) return null;

                            return (
                              <tr key={event._id}>
                                <td style={{ fontWeight: 'bold' }}>{event.title}</td>
                                <td>{event.clubName}</td>
                                <td>{formatDate(event.date)}</td>
                                <td>{event.location}</td>
                                <td>{event.capacity}</td>
                                <td>
                                  <span className={`badge ${
                                    demoStatus === 'Approved' ? 'badge-success' :
                                    demoStatus === 'Rejected' ? 'badge-danger' : 'badge-warning'
                                  }`}>
                                    {demoStatus}
                                  </span>
                                </td>
                                <td style={{ display: 'flex', gap: '6px' }}>
                                  {demoStatus === 'Pending Review' && (
                                    <>
                                      <button
                                        onClick={() => setActionSuccess(`Approved: ${event.title}`)}
                                        className="dash-btn dash-btn-primary"
                                        style={{ padding: '4px 8px', fontSize: '10px', flex: 'none' }}
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => setActionSuccess(`Rejected: ${event.title}`)}
                                        className="dash-btn dash-btn-secondary"
                                        style={{ padding: '4px 8px', fontSize: '10px', flex: 'none', color: '#ff6b6b' }}
                                      >
                                        Reject
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 5. Faculty Announcements Tab */}
                {currentTab === 'faculty-announcements' && (
                  <div>
                    <div className="section-header">
                      <h3>Campus Announcements</h3>
                      <button onClick={() => setIsCreateAnnouncementModalOpen(true)} className="dash-btn dash-btn-primary" style={{ width: 'auto' }}>
                        + Create Announcement
                      </button>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                      {announcements.map((ann) => (
                        <div key={ann.id} className="announcement-card">
                          <div className="announcement-header">
                            <span className="announcement-title">{ann.title}</span>
                            <span className="announcement-date">{formatDate(ann.date)}</span>
                          </div>
                          <p className="announcement-body">{ann.body}</p>
                          <div className="announcement-author">Posted by: {ann.author}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 6. Faculty Attendance Tab */}
                {currentTab === 'faculty-attendance' && (
                  <div>
                    <div className="section-header">
                      <h3>QR Attendance Management</h3>
                    </div>

                    <div className="profile-layout">
                      <div className="profile-card">
                        <h3>QR Scanner</h3>
                        <div className="qr-scanner-camera-feed" style={{ marginTop: '20px' }}>
                          <div className="scanner-laser"></div>
                          <span style={{ fontSize: '32px' }}>📷</span>
                          <span className="viewfinder-text">Position QR code within grid...</span>
                        </div>
                      </div>

                      <div className="dash-table-container" style={{ padding: '24px' }}>
                        <h3 style={{ margin: '0 0 16px 0' }}>Mark Attendance</h3>
                        
                        <div className="dash-form">
                          <div className="dash-form-group">
                            <label>Select Event</label>
                            <select
                              value={qrScanEventId}
                              onChange={(e) => setQrScanEventId(e.target.value)}
                              className="dash-select"
                            >
                              <option value="">-- Choose Event --</option>
                              {events.map(ev => (
                                <option key={ev._id} value={ev._id}>{ev.title}</option>
                              ))}
                            </select>
                          </div>

                          <div className="dash-form-group">
                            <label>Student Registration / Name</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input
                                type="text"
                                value={qrScanStudentReg}
                                onChange={(e) => setQrScanStudentReg(e.target.value)}
                                className="dash-input"
                                placeholder="Enter Reg. No or Student Name"
                              />
                              <button
                                onClick={() => handleCheckInSimulate()}
                                className="dash-btn dash-btn-primary"
                                style={{ flex: 'none', width: 'auto' }}
                              >
                                Scan
                              </button>
                            </div>
                          </div>
                        </div>

                        {qrScanResult && (
                          <div className={qrScanResult.success ? 'scan-success' : 'scan-error'} style={{ marginTop: '20px', color: '#fff', padding: '12px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 6px 0' }}>{qrScanResult.success ? '✓ Check-in Successful' : '❌ Check-in Failed'}</h4>
                            <p style={{ margin: 0, fontSize: '13px' }}>{qrScanResult.message}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Faculty Reports Tab */}
                {currentTab === 'faculty-reports' && (
                  <div>
                    <div className="section-header">
                      <h3>Event Reports & Analytics</h3>
                    </div>

                    <div className="profile-layout">
                      <div className="profile-card">
                        <h3>Report Filters</h3>
                        
                        <div className="dash-form" style={{ marginTop: '16px' }}>
                          <div className="dash-form-group">
                            <label>Select Event</label>
                            <select
                              value={qrScanEventId}
                              onChange={(e) => setQrScanEventId(e.target.value)}
                              className="dash-select"
                            >
                              <option value="">-- All Events --</option>
                              {events.map(ev => (
                                <option key={ev._id} value={ev._id}>{ev.title}</option>
                              ))}
                            </select>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                            <button onClick={() => handleExportReport('xlsx')} className="dash-btn dash-btn-primary">
                              📊 Export Excel
                            </button>
                            <button onClick={() => handleExportReport('pdf')} className="dash-btn dash-btn-outline">
                              📄 Export PDF
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="dash-table-container" style={{ padding: '24px' }}>
                        <h3>Report Metrics</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                          <div style={{ padding: '16px', background: 'rgba(96,150,186,0.1)', borderRadius: '10px', border: '1px solid rgba(96,150,186,0.3)' }}>
                            <span style={{ color: 'var(--dash-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Total Registrations</span>
                            <h4 style={{ color: '#fff', fontSize: '20px', margin: '4px 0 0 0' }}>
                              {qrScanEventId
                                ? registrations.filter(r => r.eventId === qrScanEventId).length
                                : registrations.length
                              }
                            </h4>
                          </div>
                          <div style={{ padding: '16px', background: 'rgba(96,150,186,0.1)', borderRadius: '10px', border: '1px solid rgba(96,150,186,0.3)' }}>
                            <span style={{ color: 'var(--dash-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Attendance Count</span>
                            <h4 style={{ color: '#fff', fontSize: '20px', margin: '4px 0 0 0' }}>
                              {qrScanEventId
                                ? registrations.filter(r => r.eventId === qrScanEventId && r.checkedIn).length
                                : registrations.filter(r => r.checkedIn).length
                              }
                            </h4>
                          </div>
                          <div style={{ padding: '16px', background: 'rgba(96,150,186,0.1)', borderRadius: '10px', border: '1px solid rgba(96,150,186,0.3)' }}>
                            <span style={{ color: 'var(--dash-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Attendance Rate</span>
                            <h4 style={{ color: '#fff', fontSize: '20px', margin: '4px 0 0 0' }}>
                              {qrScanEventId
                                ? registrations.filter(r => r.eventId === qrScanEventId).length > 0
                                  ? Math.round((registrations.filter(r => r.eventId === qrScanEventId && r.checkedIn).length / registrations.filter(r => r.eventId === qrScanEventId).length) * 100)
                                  : 0
                                : registrations.length > 0
                                ? Math.round((registrations.filter(r => r.checkedIn).length / registrations.length) * 100)
                                : 0
                              }%
                            </h4>
                          </div>
                          <div style={{ padding: '16px', background: 'rgba(96,150,186,0.1)', borderRadius: '10px', border: '1px solid rgba(96,150,186,0.3)' }}>
                            <span style={{ color: 'var(--dash-text-muted)', fontSize: '12px', textTransform: 'uppercase' }}>Pending Approvals</span>
                            <h4 style={{ color: '#fff', fontSize: '20px', margin: '4px 0 0 0' }}>
                              {registrations.filter(r => r.status === 'Pending').length}
                            </h4>
                          </div>
                        </div>

                        <div className="dash-table-container" style={{ marginTop: '24px', padding: '16px' }}>
                          <h4 style={{ margin: '0 0 12px 0' }}>Event Details</h4>
                          <table className="dash-table">
                            <thead>
                              <tr>
                                <th>Event Name</th>
                                <th>Date</th>
                                <th>Total Regs</th>
                                <th>Attended</th>
                                <th>Attend %</th>
                              </tr>
                            </thead>
                            <tbody>
                              {events.map((event) => {
                                const eventRegs = registrations.filter(r => r.eventId === event._id);
                                const attended = eventRegs.filter(r => r.checkedIn).length;
                                const rate = eventRegs.length > 0 ? Math.round((attended / eventRegs.length) * 100) : 0;
                                return (
                                  <tr key={event._id}>
                                    <td style={{ fontWeight: 'bold' }}>{event.title}</td>
                                    <td>{formatDate(event.date).split(' at')[0]}</td>
                                    <td>{eventRegs.length}</td>
                                    <td>{attended}</td>
                                    <td>{rate}%</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* -------------------- SHARED GENERAL PROFILE TAB -------------------- */}
            {currentTab === 'profile' && (
              <div>
                <div className="section-header">
                  <h3>My Account Profile</h3>
                </div>

                <div className="profile-layout">
                  <div className="profile-card">
                    <div className="profile-avatar-large">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <h3>{user.name}</h3>
                    <p style={{ margin: '4px 0 16px 0' }}>{user.email}</p>
                    <span className="profile-role-badge">{user.role}</span>
                  </div>

                  <div className="dash-table-container" style={{ padding: '30px' }}>
                    <h3 style={{ margin: '0 0 20px 0' }}>Personal Information Details</h3>

                    <div className="dash-form">
                      <div className="form-row">
                        <div className="dash-form-group">
                          <label>Full Name</label>
                          <input type="text" value={user.name} className="dash-input" disabled />
                        </div>
                        <div className="dash-form-group">
                          <label>Role Privilege</label>
                          <input type="text" value={user.role.toUpperCase()} className="dash-input" disabled />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="dash-form-group">
                          <label>Email Address</label>
                          <input type="email" value={user.email} className="dash-input" disabled />
                        </div>
                        {user.regNo && (
                          <div className="dash-form-group">
                            <label>Registration Number</label>
                            <input type="text" value={user.regNo} className="dash-input" disabled />
                          </div>
                        )}
                      </div>

                      {isStudent && user.deptYear && (
                        <div className="dash-form-group">
                          <label>Department / Year</label>
                          <input type="text" value={user.deptYear} className="dash-input" disabled />
                        </div>
                      )}

                      {isOrganizer && user.clubName && (
                        <div className="dash-form-group">
                          <label>Assigned Club Name</label>
                          <input type="text" value={user.clubName} className="dash-input" disabled />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ------------------------- DIALOG MODALS ------------------------- */}

      {/* A. Event Detail Modal */}
      {isEventDetailModalOpen && selectedEvent && (
        <div className="modal-overlay" onClick={() => setIsEventDetailModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedEvent.title}</h3>
              <button className="modal-close-btn" onClick={() => setIsEventDetailModalOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
                <span className="badge badge-info">{selectedEvent.clubName || 'General'}</span>
                <span className="badge badge-success">Capacity: {selectedEvent.capacity} seats</span>
              </div>
              
              <h4 style={{ color: 'var(--brand-green-light)', margin: '0 0 8px 0' }}>Description</h4>
              <p style={{ color: 'var(--dash-text-muted)', lineHeight: '1.6', margin: '0 0 20px 0' }}>{selectedEvent.description}</p>
              
              <h4 style={{ color: 'var(--brand-green-light)', margin: '0 0 8px 0' }}>Venue & Time</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#fff', fontSize: '14px', marginBottom: '20px' }}>
                <div>📍 <strong>Location:</strong> {selectedEvent.location}</div>
                <div>📅 <strong>Date:</strong> {formatDate(selectedEvent.date)}</div>
              </div>

              {selectedEvent.organizer && (
                <div style={{ borderTop: '1px solid var(--dash-border)', paddingTop: '16px' }}>
                  <h4 style={{ color: 'var(--brand-green-light)', margin: '0 0 4px 0', fontSize: '13px' }}>Organizer Contacts</h4>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--dash-text-muted)' }}>
                    Name: {selectedEvent.organizer.name} | Email: {selectedEvent.organizer.email}
                  </p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="dash-btn dash-btn-secondary" onClick={() => setIsEventDetailModalOpen(false)}>
                Close
              </button>
              {isStudent && (
                <button
                  disabled={registeredEventIds.includes(selectedEvent._id)}
                  onClick={() => handleRegisterEvent(selectedEvent)}
                  className="dash-btn dash-btn-primary"
                >
                  {registeredEventIds.includes(selectedEvent._id) ? 'Registered✓' : 'Confirm Registration'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* B. Add Staff Modal */}
      {isAddStaffModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddStaffModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleAddStaff}>
              <div className="modal-header">
                <h3>Add Staff / Volunteer</h3>
                <button type="button" className="modal-close-btn" onClick={() => setIsAddStaffModalOpen(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="dash-form">
                  <div className="dash-form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={staffForm.name}
                      onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                      className="dash-input"
                      placeholder="e.g. Dr. B. Anitha"
                      required
                    />
                  </div>
                  <div className="dash-form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      value={staffForm.dept}
                      onChange={(e) => setStaffForm({ ...staffForm, dept: e.target.value })}
                      className="dash-input"
                      placeholder="e.g. CSE"
                      required
                    />
                  </div>
                  <div className="dash-form-group">
                    <label>System Role</label>
                    <input
                      type="text"
                      value={staffForm.role}
                      onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                      className="dash-input"
                      placeholder="e.g. Coordinator / Volunteer"
                      required
                    />
                  </div>

                  <div className="dash-form-group">
                    <label>Email ID</label>
                    <input
                      type="email"
                      value={staffForm.email}
                      onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                      className="dash-input"
                      placeholder="staff@college.edu"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="dash-btn dash-btn-secondary" onClick={() => setIsAddStaffModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="dash-btn dash-btn-primary">
                  Save Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* C. Add Club Modal */}
      {isAddClubModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddClubModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleAddClub}>
              <div className="modal-header">
                <h3>Add Affiliated Club</h3>
                <button type="button" className="modal-close-btn" onClick={() => setIsAddClubModalOpen(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="dash-form">
                  <div className="dash-form-group">
                    <label>Club Name</label>
                    <input
                      type="text"
                      value={clubForm.name}
                      onChange={(e) => setClubForm({ ...clubForm, name: e.target.value })}
                      className="dash-input"
                      placeholder="e.g. Fine Arts Club"
                      required
                    />
                  </div>
                  <div className="dash-form-group">
                    <label>Department Scope</label>
                    <input
                      type="text"
                      value={clubForm.dept}
                      onChange={(e) => setClubForm({ ...clubForm, dept: e.target.value })}
                      className="dash-input"
                      placeholder="e.g. ECE / MECH"
                      required
                    />
                  </div>

                  <div className="dash-form-group">
                    <label>President Name</label>
                    <input
                      type="text"
                      value={clubForm.president}
                      onChange={(e) => setClubForm({ ...clubForm, president: e.target.value })}
                      className="dash-input"
                      placeholder="e.g. Arun Kumar"
                      required
                    />
                  </div>
                  <div className="dash-form-group">
                    <label>Brief Description</label>
                    <textarea
                      value={clubForm.desc}
                      onChange={(e) => setClubForm({ ...clubForm, desc: e.target.value })}
                      className="dash-textarea"
                      placeholder="Describe the club's focus..."
                      required
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="dash-btn dash-btn-secondary" onClick={() => setIsAddClubModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="dash-btn dash-btn-primary">
                  Register Club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* D. Create Announcement Modal */}
      {isCreateAnnouncementModalOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateAnnouncementModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateAnnouncement}>
              <div className="modal-header">
                <h3>Publish New Announcement</h3>
                <button type="button" className="modal-close-btn" onClick={() => setIsCreateAnnouncementModalOpen(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="dash-form">
                  <div className="dash-form-group">
                    <label>Title Headline</label>
                    <input
                      type="text"
                      value={announcementForm.title}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                      className="dash-input"
                      placeholder="e.g. Schedule adjustment notice"
                      required
                    />
                  </div>
                  <div className="dash-form-group">
                    <label>Message Content</label>
                    <textarea
                      value={announcementForm.body}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, body: e.target.value })}
                      className="dash-textarea"
                      placeholder="Type details for students..."
                      required
                    ></textarea>
                  </div>
                  <div className="dash-form-group">
                    <label>Publishing Author (Optional)</label>
                    <input
                      type="text"
                      value={announcementForm.author}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, author: e.target.value })}
                      className="dash-input"
                      placeholder={user.name}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="dash-btn dash-btn-secondary" onClick={() => setIsCreateAnnouncementModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="dash-btn dash-btn-primary">
                  Publish Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* E. Result Entry Modal */}
      {isResultEntryModalOpen && (
        <div className="modal-overlay" onClick={() => setIsResultEntryModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleAddResult}>
              <div className="modal-header">
                <h3>Publish Competition Results</h3>
                <button type="button" className="modal-close-btn" onClick={() => setIsResultEntryModalOpen(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="dash-form">
                  <div className="dash-form-group">
                    <label>Select Event</label>
                    <select
                      value={resultForm.eventId}
                      onChange={(e) => setResultForm({ ...resultForm, eventId: e.target.value })}
                      className="dash-select"
                      required
                    >
                      <option value="">-- Choose Event --</option>
                      {events.map(ev => (
                        <option key={ev._id} value={ev._id}>{ev.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="dash-form-group">
                    <label>🥇 First Place Winner Name</label>
                    <input
                      type="text"
                      value={resultForm.firstPlace}
                      onChange={(e) => setResultForm({ ...resultForm, firstPlace: e.target.value })}
                      className="dash-input"
                      placeholder="Student full name"
                      required
                    />
                  </div>

                  <div className="dash-form-group">
                    <label>🥈 Second Place Winner Name</label>
                    <input
                      type="text"
                      value={resultForm.secondPlace}
                      onChange={(e) => setResultForm({ ...resultForm, secondPlace: e.target.value })}
                      className="dash-input"
                      placeholder="Student full name"
                    />
                  </div>

                  <div className="dash-form-group">
                    <label>🥉 Third Place Winner Name</label>
                    <input
                      type="text"
                      value={resultForm.thirdPlace}
                      onChange={(e) => setResultForm({ ...resultForm, thirdPlace: e.target.value })}
                      className="dash-input"
                      placeholder="Student full name"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="dash-btn dash-btn-secondary" onClick={() => setIsResultEntryModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="dash-btn dash-btn-primary">
                  Publish Winners
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* F. Certificate View Modal */}
      {selectedCertificate && (
        <div className="modal-overlay" onClick={() => setSelectedCertificate(null)}>
          <div className="modal-content" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Verified Digital Certificate</h3>
              <button className="modal-close-btn" onClick={() => setSelectedCertificate(null)}>×</button>
            </div>
            <div className="modal-body" id="printable-certificate-area">
              <div className="certificate-preview-box">
                <div style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', color: '#666', marginBottom: '10px' }}>
                  College Event Management System
                </div>
                <div className="cert-title">
                  Certificate of {selectedCertificate.isWinner ? 'Achievement' : 'Participation'}
                </div>
                <div className="cert-subtitle">This certificate is proudly presented to:</div>
                <div className="cert-name">{user.name}</div>
                <div className="cert-text">
                  for {selectedCertificate.isWinner ? 'securing a winning placement' : 'satisfactory participation'} in the campus event{' '}
                  <strong>"{selectedCertificate.eventTitle}"</strong> organized by the <strong>{selectedCertificate.clubName}</strong> held on{' '}
                  {new Date(selectedCertificate.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.
                </div>
                <div className="cert-signature-row">
                  <div className="cert-signature">
                    <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '15px', color: '#444' }}>
                      {selectedCertificate.clubName.split(' ')[0]} Head
                    </div>
                    Event Coordinator
                  </div>
                  <div className="cert-signature">
                    <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '15px', color: '#444' }}>
                      Dr. K. Sridhar
                    </div>
                    College Principal
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="dash-btn dash-btn-secondary" onClick={() => setSelectedCertificate(null)}>
                Close
              </button>
              <button
                onClick={() => {
                  const printContent = document.getElementById('printable-certificate-area').innerHTML;
                  const originalContent = document.body.innerHTML;
                  const styleContent = `
                    <style>
                      body { background: white !important; color: black !important; padding: 20px; }
                      .certificate-preview-box { border: 15px double #5BB825 !important; background: white !important; box-shadow: none !important; }
                      .cert-title { color: #1a4d10 !important; }
                      .modal-header, .modal-footer { display: none !important; }
                    </style>
                  `;
                  const printWindow = window.open('', '_blank');
                  printWindow.document.write('<html><head><title>Print Certificate</title>' + styleContent + '</head><body>' + printContent + '</body></html>');
                  printWindow.document.close();
                  printWindow.focus();
                  printWindow.print();
                  printWindow.close();
                }}
                className="dash-btn dash-btn-primary"
              >
                Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
