import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiActivity,
  FiBell,
  FiBookOpen,
  FiBriefcase,
  FiCalendar,
  FiCheckSquare,
  FiChevronDown,
  FiCompass,
  FiCreditCard,
  FiEdit3,
  FiGrid,
  FiHeart,
  FiHome,
  FiMap,
  FiMenu,
  FiPlus,
  FiSearch,
  FiSend,
  FiSettings,
  FiShare2,
  FiTrendingUp,
  FiUser,
  FiX
} from 'react-icons/fi';
import Logo from '../components/Logo.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/pages/Dashboard.css';

const sidebarItems = [
  { label: 'Dashboard', icon: <FiHome />, active: true },
  { label: 'My Trips', icon: <FiBriefcase /> },
  { label: 'Create Trip', icon: <FiPlus /> },
  { label: 'Itinerary', icon: <FiCalendar /> },
  { label: 'Budget Planner', icon: <FiCreditCard /> },
  { label: 'Activities', icon: <FiActivity /> },
  { label: 'Packing Checklist', icon: <FiCheckSquare /> },
  { label: 'Notes / Journal', icon: <FiBookOpen /> },
  { label: 'Shared Trips', icon: <FiShare2 /> },
  { label: 'Profile', icon: <FiUser /> },
  { label: 'Settings', icon: <FiSettings /> }
];

const stats = [
  { label: 'Active trips', value: '04', trend: '+2 this month' },
  { label: 'Budget saved', value: '18%', trend: 'AI optimized' },
  { label: 'Cities planned', value: '27', trend: '8 countries' }
];

const trips = [
  {
    destination: 'Jaipur Heritage Loop',
    dates: '12 Aug - 18 Aug',
    budget: 'INR 58,400',
    status: 'Planning',
    progress: 72,
    image: 'https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=1000&q=80'
  },
  {
    destination: 'Kerala Slow Escape',
    dates: '04 Sep - 11 Sep',
    budget: 'INR 46,900',
    status: 'Confirmed',
    progress: 88,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80'
  },
  {
    destination: 'Ladakh Altitude Run',
    dates: '20 Oct - 29 Oct',
    budget: 'INR 74,200',
    status: 'Draft',
    progress: 43,
    image: 'https://images.unsplash.com/photo-1589793907316-f94025b46850?auto=format&fit=crop&w=1000&q=80'
  }
];

const insights = [
  { title: 'Budget usage', value: '64%', icon: <FiCreditCard />, detail: 'INR 32k remaining', meter: 64 },
  { title: 'Upcoming travel', value: '12 days', icon: <FiCalendar />, detail: 'Jaipur departure', meter: 78 },
  { title: 'Top cities', value: 'Delhi', icon: <FiMap />, detail: 'Most visited hub', meter: 52 },
  { title: 'Activity load', value: 'Balanced', icon: <FiTrendingUp />, detail: '2 intense days flagged', meter: 70 }
];

const quickActions = [
  { label: 'Create New Trip', icon: <FiPlus /> },
  { label: 'Explore Destinations', icon: <FiCompass /> },
  { label: 'Generate AI Itinerary', icon: <FiSend /> },
  { label: 'Share Trip', icon: <FiShare2 /> }
];

const destinations = [
  { name: 'Udaipur', meta: 'Lakes, palaces, slow sunsets', score: '94', image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=900&q=80' },
  { name: 'Goa', meta: 'Coastal workation route', score: '91', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80' },
  { name: 'Rishikesh', meta: 'Adventure and wellness arc', score: '89', image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=900&q=80' }
];

const activities = [
  { time: '09:00', title: 'Amber Fort guided entry', city: 'Jaipur', type: 'Culture' },
  { time: '13:30', title: 'Local thali reservation', city: 'Jaipur', type: 'Food' },
  { time: '17:45', title: 'Sunset viewpoint transfer', city: 'Nahargarh', type: 'Scenic' },
  { time: '21:00', title: 'Journal prompt and budget sync', city: 'Workspace', type: 'AI' }
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const displayName = user?.first_name || user?.username || 'traveler';

  return (
    <main className="app-dashboard">
      <aside className={`app-sidebar ${sidebarCollapsed ? 'app-sidebar--collapsed' : ''} ${mobileSidebarOpen ? 'app-sidebar--open' : ''}`}>
        <div className="sidebar-top">
          <Logo />
          <button type="button" className="sidebar-toggle" onClick={() => setSidebarCollapsed((current) => !current)} aria-label="Toggle sidebar">
            {sidebarCollapsed ? <FiMenu /> : <FiX />}
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          {sidebarItems.map((item) => (
            <button className={item.active ? 'active' : ''} type="button" key={item.label}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-upgrade">
          <FiHeart />
          <strong>AI Pro Loop</strong>
          <span>Unlock live pricing, smart packing, and share analytics.</span>
        </div>
      </aside>

      {mobileSidebarOpen && <button className="sidebar-scrim" type="button" aria-label="Close sidebar" onClick={() => setMobileSidebarOpen(false)} />}

      <section className="dashboard-workspace">
        <header className="dashboard-header">
          <button className="mobile-sidebar-button" type="button" onClick={() => setMobileSidebarOpen(true)} aria-label="Open sidebar">
            <FiMenu />
          </button>
          <div className="dashboard-title">
            <span>AI travel workspace</span>
            <h1>Welcome Back, {displayName}</h1>
          </div>
          <label className="dashboard-search">
            <FiSearch />
            <input placeholder="Search trips, cities, budgets..." />
          </label>
          <div className="dashboard-header-actions">
            <button className="dashboard-icon-button" type="button" aria-label="Notifications">
              <FiBell />
              <span />
            </button>
            <ThemeToggle />
            <div className="profile-menu">
              <button type="button" onClick={() => setProfileOpen((open) => !open)}>
                <span>{displayName.charAt(0).toUpperCase()}</span>
                <div>
                  <strong>{displayName}</strong>
                  <small>{user?.email || 'traveler@traveloop.ai'}</small>
                </div>
                <FiChevronDown />
              </button>
              {profileOpen && (
                <motion.div className="profile-dropdown" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                  <button type="button"><FiUser /> Profile</button>
                  <button type="button"><FiSettings /> Settings</button>
                  <button type="button" onClick={logout}>Logout</button>
                </motion.div>
              )}
            </div>
          </div>
        </header>

        <motion.section className="dashboard-hero-panel" initial="hidden" animate="visible" variants={fadeUp}>
          <div className="hero-panel-copy">
            <span className="eyebrow">Current active trip</span>
            <h2>Jaipur Heritage Loop is 72% ready.</h2>
            <p>Your AI planner found two schedule conflicts, saved 18% on estimated spend, and prepared a shareable itinerary draft.</p>
            <div className="hero-panel-actions">
              <button className="primary-button" type="button"><FiEdit3 /> Continue planning</button>
              <button className="dashboard-secondary-button" type="button"><FiShare2 /> Share preview</button>
            </div>
          </div>
          <div className="hero-route-card">
            <div className="route-orbit">
              <span>DEL</span>
              <span>JAI</span>
              <span>UDR</span>
            </div>
            <div className="route-meta">
              <strong>6 days</strong>
              <span>3 cities, 14 activities</span>
            </div>
          </div>
          <div className="dashboard-stat-row">
            {stats.map((stat) => (
              <article key={stat.label}>
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
                <small>{stat.trend}</small>
              </article>
            ))}
          </div>
        </motion.section>

        <section className="dashboard-grid">
          <div className="dashboard-main-column">
            <section className="dashboard-section">
              <div className="dashboard-section-heading">
                <div>
                  <span>Recent trips</span>
                  <h2>Your travel loops</h2>
                </div>
                <button type="button">View all</button>
              </div>
              <div className="trip-card-grid">
                {trips.map((trip, index) => (
                  <motion.article className="trip-card" key={trip.destination} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.06 }}>
                    <div className="trip-cover" style={{ '--trip-image': `url(${trip.image})` }}>
                      <span>{trip.status}</span>
                    </div>
                    <div className="trip-card-body">
                      <h3>{trip.destination}</h3>
                      <p>{trip.dates}</p>
                      <div>
                        <span>{trip.budget}</span>
                        <strong>{trip.progress}%</strong>
                      </div>
                      <div className="trip-progress"><span style={{ width: `${trip.progress}%` }} /></div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>

            <section className="dashboard-section">
              <div className="dashboard-section-heading">
                <div>
                  <span>Quick actions</span>
                  <h2>Move the trip forward</h2>
                </div>
              </div>
              <div className="quick-action-grid">
                {quickActions.map((action) => (
                  <button type="button" key={action.label}>
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="dashboard-section">
              <div className="dashboard-section-heading">
                <div>
                  <span>Trending destinations</span>
                  <h2>AI-recommended next stops</h2>
                </div>
              </div>
              <div className="trending-grid">
                {destinations.map((destination) => (
                  <article className="trending-card" key={destination.name} style={{ '--destination-image': `url(${destination.image})` }}>
                    <div>
                      <span>{destination.score} fit</span>
                      <h3>{destination.name}</h3>
                      <p>{destination.meta}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <aside className="dashboard-side-column">
            <section className="dashboard-section insights-section">
              <div className="dashboard-section-heading">
                <div>
                  <span>AI insights</span>
                  <h2>Travel signals</h2>
                </div>
              </div>
              <div className="insight-grid">
                {insights.map((insight) => (
                  <article className="insight-card" key={insight.title}>
                    <div>
                      {insight.icon}
                      <span>{insight.title}</span>
                    </div>
                    <strong>{insight.value}</strong>
                    <p>{insight.detail}</p>
                    <div className="insight-meter"><span style={{ width: `${insight.meter}%` }} /></div>
                  </article>
                ))}
              </div>
            </section>

            <section className="dashboard-section activities-section">
              <div className="dashboard-section-heading">
                <div>
                  <span>Today timeline</span>
                  <h2>Upcoming activities</h2>
                </div>
              </div>
              <div className="activity-timeline">
                {activities.map((activity) => (
                  <article key={`${activity.time}-${activity.title}`}>
                    <time>{activity.time}</time>
                    <div>
                      <strong>{activity.title}</strong>
                      <span>{activity.city} - {activity.type}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}
