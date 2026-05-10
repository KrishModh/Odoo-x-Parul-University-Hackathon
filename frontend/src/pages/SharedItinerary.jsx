import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCopy, FiDownload, FiShare2, FiTrendingUp } from 'react-icons/fi';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { shareService } from '../services/shareService.js';
import '../styles/pages/SharedItinerary.css';

const fallbackCover = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80';

export default function SharedItinerary() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    shareService.getShared(slug)
      .then((data) => active && setPayload(data))
      .catch((sharedError) => active && setError(sharedError.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [slug]);

  const trip = payload?.trip;
  const sections = trip?.sections || [];
  const totalActivities = useMemo(
    () => sections.reduce((sum, section) => sum + (section.activities?.length || 0), 0),
    [sections]
  );
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyLink = async () => {
    await navigator.clipboard?.writeText(shareUrl);
    setToast('Public itinerary link copied.');
    window.setTimeout(() => setToast(''), 2200);
  };

  const copyTrip = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const data = await shareService.copyShared(slug);
      navigate(`/trip/${data.trip.id}/itinerary`);
    } catch (copyError) {
      setError(copyError.message);
    }
  };

  if (loading) {
    return <main className="shared-itinerary-page"><div className="shared-skeleton" /></main>;
  }

  if (error || !trip) {
    return <main className="shared-itinerary-page"><div className="shared-error">{error || 'Shared itinerary not found.'}</div></main>;
  }

  return (
    <main className="shared-itinerary-page">
      <nav className="shared-nav">
        <Logo />
        <div>
          <button type="button" onClick={copyLink}><FiCopy /> Copy link</button>
          <button type="button" onClick={copyTrip}><FiDownload /> Copy trip</button>
        </div>
      </nav>

      {toast && <div className="shared-toast">{toast}</div>}

      <section className="shared-hero" style={{ '--shared-cover': `url(${trip.cover_image || fallbackCover})` }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <span>Public Traveloop itinerary</span>
          <h1>{trip.trip_name}</h1>
          <p>{trip.description}</p>
          <div className="shared-hero-stats">
            <strong>{trip.destination}</strong>
            <strong>{sections.length} cities</strong>
            <strong>{totalActivities} activities</strong>
            <strong>INR {Number(trip.estimated_budget || 0).toLocaleString()}</strong>
          </div>
        </motion.div>
      </section>

      <section className="shared-content-grid">
        <div className="shared-main">
          <div className="shared-section-heading">
            <span>Timeline</span>
            <h2>Day-wise itinerary</h2>
          </div>
          <div className="shared-timeline">
            {sections.length ? sections.map((section, index) => (
              <article key={section.id} className="shared-city-block">
                <div className="shared-day-badge">Day {index + 1}</div>
                <div>
                  <h3>{section.city_name}</h3>
                  <p>{section.start_date} to {section.end_date}</p>
                  {section.notes && <p>{section.notes}</p>}
                  <div className="shared-activities">
                    {(section.activities || []).map((activity) => (
                      <div key={activity.id}>
                        <time>{activity.activity_time}</time>
                        <strong>{activity.activity_name}</strong>
                        <span>{activity.category} · INR {Number(activity.estimated_cost || 0).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            )) : <div className="shared-empty">This shared trip has no itinerary sections yet.</div>}
          </div>
        </div>

        <aside className="shared-side">
          <article className="shared-budget-card">
            <FiTrendingUp />
            <span>Budget intelligence</span>
            <h3>INR {Number(payload.budget?.spent || 0).toLocaleString()} planned</h3>
            <div><span style={{ width: `${Math.min(100, ((payload.budget?.spent || 0) / (trip.estimated_budget || 1)) * 100)}%` }} /></div>
            <p>Remaining: INR {Number(payload.budget?.remaining_budget || 0).toLocaleString()}</p>
          </article>

          <article className="shared-note-card">
            <span>Travel notes</span>
            {(payload.journal || []).length ? payload.journal.map((note) => (
              <div key={note.id}>
                <strong>{note.title}</strong>
                <p>{note.content}</p>
              </div>
            )) : <p>No public journal notes yet.</p>}
          </article>

          <article className="shared-note-card">
            <span>Packing readiness</span>
            <h3>{payload.packing?.completion || 0}% complete</h3>
            {(payload.packing?.items || []).slice(0, 5).map((item) => (
              <p key={item.id}>{item.is_completed ? '[x]' : '[ ]'} {item.item_name}</p>
            ))}
          </article>

          <button className="shared-social-button" type="button" onClick={copyLink}><FiShare2 /> Share itinerary</button>
        </aside>
      </section>
    </main>
  );
}
