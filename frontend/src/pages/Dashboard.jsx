import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useTrips } from '../context/TripContext.jsx';
import { checklistService } from '../services/checklistService.js';
import { journalService } from '../services/journalService.js';
import activitiesData from '../data/activities.json';
import citiesData from '../data/cities.json';
import '../styles/pages/Dashboard.css';

const fallbackImage = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80';

const sidebarItems = [
  { label: 'Dashboard', icon: <FiHome />, active: true, path: '/dashboard' },
  { label: 'My Trips', icon: <FiBriefcase />, path: '/my-trips' },
  { label: 'Create Trip', icon: <FiPlus />, path: '/create-trip' },
  { label: 'Itinerary', icon: <FiCalendar />, path: '/my-trips' },
  { label: 'Budget Planner', icon: <FiCreditCard />, path: '/my-trips' },
  { label: 'Activities', icon: <FiActivity />, path: '/explore' },
  { label: 'Packing Checklist', icon: <FiCheckSquare />, path: '/packing' },
  { label: 'Notes / Journal', icon: <FiBookOpen />, path: '/journal' },
  { label: 'Shared Trips', icon: <FiShare2 />, path: '/my-trips' },
  { label: 'Profile', icon: <FiUser />, path: '/profile' },
  { label: 'Settings', icon: <FiSettings />, path: '/profile' }
];

const quickActions = [
  { label: 'Create New Trip', icon: <FiPlus />, path: '/create-trip' },
  { label: 'Explore Destinations', icon: <FiCompass />, path: '/explore' },
  { label: 'Open My Trips', icon: <FiSend />, path: '/my-trips' },
  { label: 'Write Journal', icon: <FiShare2 />, path: '/journal' }
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 }
};

function dateLabel(dateString) {
  return dateString ? new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Flexible';
}

function tripProgress(trip) {
  const sections = trip.sections || [];
  const activities = sections.flatMap((section) => section.activities || []);
  const itineraryScore = Math.min(60, sections.length * 18 + activities.length * 6);
  const coverScore = trip.cover_image ? 10 : 0;
  const notesScore = trip.notes ? 10 : 0;
  return Math.min(100, itineraryScore + coverScore + notesScore + 20);
}

function budgetSpent(trip) {
  return (trip.sections || [])
    .flatMap((section) => section.activities || [])
    .reduce((sum, activity) => sum + Number(activity.estimated_cost || 0), 0);
}

function findCityForTrip(trip) {
  const text = `${trip.destination} ${trip.trip_name} ${(trip.sections || []).map((section) => section.city_name).join(' ')}`.toLowerCase();
  return citiesData.find((city) => text.includes(city.name.toLowerCase()));
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { trips: savedTrips, refreshTrips } = useTrips();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [checklistByTrip, setChecklistByTrip] = useState({});
  const [journalByTrip, setJournalByTrip] = useState({});
  const displayName = user?.first_name || user?.username || 'traveler';

  useEffect(() => {
    refreshTrips();
  }, [refreshTrips]);

  useEffect(() => {
    let active = true;
    async function loadConnectedTripSignals() {
      const checklistEntries = await Promise.allSettled(
        savedTrips.slice(0, 8).map(async (trip) => [trip.id, await checklistService.getChecklist(trip.id)])
      );
      const journalEntries = await Promise.allSettled(
        savedTrips.slice(0, 8).map(async (trip) => [trip.id, await journalService.getJournal(trip.id)])
      );
      if (!active) return;
      const nextChecklist = {};
      const nextJournal = {};
      checklistEntries.forEach((entry) => {
        if (entry.status === 'fulfilled') nextChecklist[entry.value[0]] = entry.value[1].items || [];
      });
      journalEntries.forEach((entry) => {
        if (entry.status === 'fulfilled') nextJournal[entry.value[0]] = entry.value[1].notes || [];
      });
      setChecklistByTrip(nextChecklist);
      setJournalByTrip(nextJournal);
    }
    if (savedTrips.length) {
      loadConnectedTripSignals();
    } else {
      setChecklistByTrip({});
      setJournalByTrip({});
    }
    return () => {
      active = false;
    };
  }, [savedTrips]);

  const activeTrip = useMemo(() => {
    const now = new Date();
    return savedTrips.find((trip) => new Date(trip.start_date) <= now && new Date(trip.end_date) >= now) || savedTrips[0];
  }, [savedTrips]);

  const dashboardStats = useMemo(() => {
    const allActivities = savedTrips.flatMap((trip) => (trip.sections || []).flatMap((section) => section.activities || []));
    const checklistItems = Object.values(checklistByTrip).flat();
    const packed = checklistItems.filter((item) => item.is_completed).length;
    const packingProgress = checklistItems.length ? Math.round((packed / checklistItems.length) * 100) : 0;
    const averageProgress = savedTrips.length ? Math.round(savedTrips.reduce((sum, trip) => sum + tripProgress(trip), 0) / savedTrips.length) : 0;
    return [
      { label: 'Active trips', value: String(savedTrips.length).padStart(2, '0'), trend: savedTrips.length ? 'Synced from PostgreSQL' : 'Create your first loop' },
      { label: 'Itinerary progress', value: `${averageProgress}%`, trend: `${allActivities.length} real activities` },
      { label: 'Packing progress', value: `${packingProgress}%`, trend: checklistItems.length ? `${packed}/${checklistItems.length} packed` : 'No checklist yet' }
    ];
  }, [savedTrips, checklistByTrip]);

  const visibleTrips = useMemo(() => savedTrips.slice(0, 3).map((trip) => ({
    id: trip.id,
    destination: trip.trip_name,
    dates: `${dateLabel(trip.start_date)} - ${dateLabel(trip.end_date)}`,
    budget: `INR ${Number(trip.estimated_budget || 0).toLocaleString()}`,
    status: trip.is_public || trip.visibility === 'public' ? 'Public' : 'Private',
    progress: tripProgress(trip),
    image: trip.cover_image || fallbackImage
  })), [savedTrips]);

  const upcomingActivities = useMemo(() => savedTrips
    .flatMap((trip) => (trip.sections || []).flatMap((section) => (section.activities || []).map((activity) => ({ ...activity, trip, section }))))
    .sort((a, b) => `${a.section.start_date} ${a.activity_time}`.localeCompare(`${b.section.start_date} ${b.activity_time}`))
    .slice(0, 5), [savedTrips]);

  const recommendations = useMemo(() => {
    const matchedCities = savedTrips.map(findCityForTrip).filter(Boolean);
    const cityIds = matchedCities.map((city) => city.id);
    const activityRecommendations = activitiesData
      .filter((activity) => cityIds.includes(activity.city_id))
      .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
      .slice(0, 3)
      .map((activity) => ({
        name: activity.title,
        meta: `${activity.category} in ${citiesData.find((city) => city.id === activity.city_id)?.name}`,
        score: Math.round(Number(activity.rating || 4.4) * 20),
        image: activity.activity_image || fallbackImage,
        query: activity.title,
        tab: 'activities'
      }));

    if (activityRecommendations.length) return activityRecommendations;
    return citiesData.slice(0, 3).map((city) => ({
      name: city.name,
      meta: city.tagline,
      score: Math.round(city.popularity_score * 10),
      image: city.hero_image || fallbackImage,
      query: city.name,
      tab: 'cities'
    }));
  }, [savedTrips]);

  const insights = useMemo(() => {
    const totalBudget = savedTrips.reduce((sum, trip) => sum + Number(trip.estimated_budget || 0), 0);
    const spent = savedTrips.reduce((sum, trip) => sum + budgetSpent(trip), 0);
    const usage = totalBudget ? Math.round((spent / totalBudget) * 100) : 0;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowKey = tomorrow.toISOString().slice(0, 10);
    const tomorrowActivities = upcomingActivities.filter((activity) => activity.section.start_date === tomorrowKey).length;
    const emptySections = savedTrips.flatMap((trip) => trip.sections || []).filter((section) => !(section.activities || []).length).length;
    const checklistItems = Object.values(checklistByTrip).flat();
    const journalItems = Object.values(journalByTrip).flat();
    const packing = checklistItems.length ? Math.round((checklistItems.filter((item) => item.is_completed).length / checklistItems.length) * 100) : 0;
    return [
      { title: 'Budget usage', value: `${usage}%`, icon: <FiCreditCard />, detail: totalBudget ? `INR ${Math.max(totalBudget - spent, 0).toLocaleString()} remaining` : 'Add budgets to trips', meter: Math.min(100, usage) },
      { title: 'Upcoming travel', value: activeTrip ? dateLabel(activeTrip.start_date) : 'None', icon: <FiCalendar />, detail: activeTrip ? activeTrip.destination : 'Create a trip to activate signals', meter: activeTrip ? tripProgress(activeTrip) : 0 },
      { title: 'Tomorrow plan', value: String(tomorrowActivities), icon: <FiMap />, detail: tomorrowActivities ? 'activities planned for tomorrow' : `${emptySections} sections need activities`, meter: Math.min(100, tomorrowActivities * 25) },
      { title: 'Packing health', value: `${packing}%`, icon: <FiTrendingUp />, detail: checklistItems.length ? 'checklist completion' : 'No packing list connected', meter: packing },
      { title: 'Journal memory', value: String(journalItems.length), icon: <FiBookOpen />, detail: journalItems.length ? 'notes captured across trips' : 'No journal memories yet', meter: Math.min(100, journalItems.length * 20) }
    ];
  }, [savedTrips, checklistByTrip, journalByTrip, upcomingActivities, activeTrip]);

  const heroTitle = activeTrip ? `${activeTrip.trip_name} is ${tripProgress(activeTrip)}% ready.` : 'Your travel operating system is ready.';
  const heroCopy = activeTrip
    ? `${activeTrip.destination} has ${(activeTrip.sections || []).length} city sections and ${(activeTrip.sections || []).flatMap((section) => section.activities || []).length} planned activities.`
    : 'Create a trip to unlock live itinerary, budget, packing, and recommendation signals.';

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
            <button className={item.active ? 'active' : ''} type="button" key={item.label} onClick={() => item.path && navigate(item.path)}>
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-upgrade">
          <FiHeart />
          <strong>Live Travel Graph</strong>
          <span>Trips, itineraries, budgets, journals, and packing now sync from your saved data.</span>
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
            <h1>Welcome back, {displayName}</h1>
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
                  <button type="button" onClick={() => navigate('/profile')}><FiUser /> Profile</button>
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
            <h2>{heroTitle}</h2>
            <p>{heroCopy}</p>
            <div className="hero-panel-actions">
              <button className="primary-button" type="button" onClick={() => navigate(activeTrip ? `/trip/${activeTrip.id}/itinerary` : '/create-trip')}><FiEdit3 /> Continue planning</button>
              <button className="dashboard-secondary-button" type="button" onClick={() => navigate(activeTrip ? `/trip/${activeTrip.id}/journal` : '/journal')}><FiShare2 /> Open journal</button>
            </div>
          </div>
          <div className="hero-route-card">
            <div className="route-orbit">
              {(activeTrip?.sections?.length ? activeTrip.sections.slice(0, 3) : [{ city_name: 'TRV' }, { city_name: 'LOP' }, { city_name: 'AI' }]).map((section) => (
                <span key={section.city_name}>{section.city_name.slice(0, 3).toUpperCase()}</span>
              ))}
            </div>
            <div className="route-meta">
              <strong>{activeTrip ? `${(activeTrip.sections || []).length || 1} stops` : '0 stops'}</strong>
              <span>{activeTrip ? `${(activeTrip.sections || []).flatMap((section) => section.activities || []).length} activities connected` : 'No itinerary yet'}</span>
            </div>
          </div>
          <div className="dashboard-stat-row">
            {dashboardStats.map((stat) => (
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
                <button type="button" onClick={() => navigate('/my-trips')}>View all</button>
              </div>
              <div className="trip-card-grid">
                {visibleTrips.length ? visibleTrips.map((trip, index) => (
                  <motion.article className="trip-card" key={trip.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: index * 0.06 }} onClick={() => navigate(`/trip/${trip.id}/itinerary`)}>
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
                )) : <div className="dashboard-empty">No trips yet. Create your first trip to activate live dashboard intelligence.</div>}
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
                  <button type="button" key={action.label} onClick={() => navigate(action.path)}>
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="dashboard-section">
              <div className="dashboard-section-heading">
                <div>
                  <span>Dynamic recommendations</span>
                  <h2>AI-recommended next stops</h2>
                </div>
              </div>
              <div className="trending-grid">
                {recommendations.map((destination) => (
                  <article className="trending-card" key={destination.name} style={{ '--destination-image': `url(${destination.image})` }} onClick={() => navigate(`/explore?tab=${destination.tab}&q=${encodeURIComponent(destination.query)}`)}>
                    <div>
                      <span>{destination.score}% fit</span>
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
                  <span>Live timeline</span>
                  <h2>Upcoming activities</h2>
                </div>
              </div>
              <div className="activity-timeline">
                {upcomingActivities.length ? upcomingActivities.map((activity) => (
                  <article key={`${activity.id}-${activity.trip.id}`}>
                    <time>{activity.activity_time}</time>
                    <div>
                      <strong>{activity.activity_name}</strong>
                      <span>{activity.section.city_name} · {activity.category} · {dateLabel(activity.section.start_date)}</span>
                    </div>
                  </article>
                )) : <div className="dashboard-empty">No upcoming activities yet. Add activities from Explore or the itinerary builder.</div>}
              </div>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}
