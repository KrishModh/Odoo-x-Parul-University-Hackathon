import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiActivity, FiBell, FiBookOpen, FiBriefcase, FiCalendar, FiCheckSquare, FiChevronDown, FiCreditCard, FiHome, FiMap, FiMenu, FiPackage, FiPlus, FiSearch, FiSettings, FiShare2, FiUser, FiX } from 'react-icons/fi';
import Logo from '../components/Logo.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/layouts/MainLayout.css';

const navItems = [
  { label: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
  { label: 'My Trips', icon: <FiBriefcase />, path: '/my-trips' },
  { label: 'Create Trip', icon: <FiPlus />, path: '/create-trip' },
  { label: 'Itinerary', icon: <FiCalendar />, path: '/my-trips' },
  { label: 'Itinerary View', icon: <FiMap />, path: '/my-trips' },
  { label: 'Budget Planner', icon: <FiCreditCard />, path: '/my-trips' },
  { label: 'Activities', icon: <FiActivity />, path: '/explore' },
  { label: 'Packing Checklist', icon: <FiPackage />, path: '/packing' },
  { label: 'Notes / Journal', icon: <FiBookOpen />, path: '/my-trips' },
  { label: 'Shared Trips', icon: <FiShare2 />, path: '/my-trips' },
  { label: 'Profile', icon: <FiUser />, path: '/profile' },
  { label: 'Settings', icon: <FiSettings />, path: '/profile' }
];

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const displayName = user?.first_name || user?.username || 'traveler';

  const go = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <main className="main-layout">
      <aside className={`main-sidebar ${collapsed ? 'main-sidebar--collapsed' : ''} ${mobileOpen ? 'main-sidebar--open' : ''}`}>
        <div className="main-sidebar-top">
          <Logo />
          <button type="button" onClick={() => setCollapsed((current) => !current)} aria-label="Toggle sidebar">
            {collapsed ? <FiMenu /> : <FiX />}
          </button>
        </div>
        <nav className="main-sidebar-nav">
          {navItems.map((item) => (
            <button className={location.pathname === item.path ? 'active' : ''} type="button" key={item.label} onClick={() => go(item.path)}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="main-sidebar-card">
          <FiCheckSquare />
          <strong>Travel OS</strong>
          <span>Trips, budgets, activities, and packing stay synced.</span>
        </div>
      </aside>
      {mobileOpen && <button className="main-layout-scrim" type="button" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}

      <section className="main-workspace">
        <header className="main-topbar">
          <button className="main-mobile-button" type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><FiMenu /></button>
          <div className="main-title">
            <span>Traveloop workspace</span>
            <h1>{displayName}'s travel command center</h1>
          </div>
          <label className="main-search"><FiSearch /><input placeholder="Search trips, activities, budgets..." /></label>
          <div className="main-actions">
            <button className="main-icon-button" type="button" aria-label="Notifications"><FiBell /><span /></button>
            <ThemeToggle />
            <div className="main-profile-menu">
              <button type="button" onClick={() => setProfileOpen((open) => !open)}>
                <span>{displayName.charAt(0).toUpperCase()}</span>
                <div><strong>{displayName}</strong><small>{user?.email || 'traveler@traveloop.ai'}</small></div>
                <FiChevronDown />
              </button>
              {profileOpen && (
                <div className="main-profile-dropdown">
                  <button type="button" onClick={() => go('/profile')}><FiUser /> Profile</button>
                  <button type="button" onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="main-content">{children}</div>
      </section>
    </main>
  );
}
