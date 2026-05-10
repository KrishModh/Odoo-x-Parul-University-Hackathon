import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCalendar, FiChevronDown, FiClock, FiCreditCard, FiMapPin, FiPlus, FiSave, FiTrash2 } from 'react-icons/fi';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { useTrips } from '../context/TripContext.jsx';
import { itineraryService } from '../services/itineraryService.js';
import { tripService } from '../services/tripService.js';
import '../styles/pages/ItineraryBuilder.css';

const emptySection = {
  city_name: '',
  start_date: '',
  end_date: '',
  notes: ''
};

const emptyActivity = {
  activity_name: '',
  description: '',
  estimated_cost: '',
  activity_time: '09:00',
  category: 'experience'
};

export default function ItineraryBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { upsertTrip, refreshTrips } = useTrips();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [sectionForm, setSectionForm] = useState(emptySection);
  const [activityForms, setActivityForms] = useState({});
  const [collapsed, setCollapsed] = useState({});

  const totalActivityCost = useMemo(() => {
    return (trip?.sections || []).reduce((total, section) => {
      return total + (section.activities || []).reduce((sum, activity) => sum + Number(activity.estimated_cost || 0), 0);
    }, 0);
  }, [trip]);

  const loadTrip = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = await tripService.getTrip(id);
      setTrip(payload.trip);
      upsertTrip(payload.trip);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
    // The builder refetches on trip changes so My Trips and Dashboard stay consistent.
  }, [id]);

  const flashToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };

  const handleCreateSection = async (event) => {
    event.preventDefault();
    try {
      await itineraryService.createSection({ ...sectionForm, trip_id: Number(id) });
      setSectionForm(emptySection);
      await loadTrip();
      await refreshTrips();
      flashToast('Section saved and itinerary synced.');
    } catch (sectionError) {
      setError(sectionError.message);
    }
  };

  const handleUpdateSection = async (section, patch) => {
    try {
      await itineraryService.updateSection({ section_id: section.id, ...section, ...patch });
      await loadTrip();
      await refreshTrips();
      flashToast('Auto-saved section.');
    } catch (sectionError) {
      setError(sectionError.message);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await itineraryService.deleteSection(sectionId);
      await loadTrip();
      await refreshTrips();
      flashToast('Section deleted.');
    } catch (sectionError) {
      setError(sectionError.message);
    }
  };

  const handleCreateActivity = async (sectionId) => {
    const form = activityForms[sectionId] || emptyActivity;
    try {
      await itineraryService.createActivity({ ...form, section_id: sectionId });
      setActivityForms((current) => ({ ...current, [sectionId]: emptyActivity }));
      await loadTrip();
      await refreshTrips();
      flashToast('Activity added.');
    } catch (activityError) {
      setError(activityError.message);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    try {
      await itineraryService.deleteActivity(activityId);
      await loadTrip();
      await refreshTrips();
      flashToast('Activity deleted.');
    } catch (activityError) {
      setError(activityError.message);
    }
  };

  if (loading) {
    return <main className="itinerary-page"><section className="itinerary-loading">Loading itinerary workspace...</section></main>;
  }

  if (!trip) {
    return <main className="itinerary-page"><section className="form-alert">{error || 'Trip not found.'}</section></main>;
  }

  return (
    <main className="itinerary-page">
      <header className="itinerary-header">
        <button type="button" className="back-link" onClick={() => navigate('/my-trips')}><FiArrowLeft /> My Trips</button>
        <ThemeToggle />
      </header>

      <section className="itinerary-hero">
        <div>
          <span className="eyebrow"><FiMapPin /> Itinerary Builder</span>
          <h1>{trip.trip_name}</h1>
          <p>{trip.destination} · {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</p>
        </div>
        <div className="itinerary-budget-card">
          <span>Planned activity cost</span>
          <strong>INR {totalActivityCost.toLocaleString()}</strong>
          <small>Trip budget INR {Number(trip.estimated_budget).toLocaleString()}</small>
        </div>
      </section>

      {toast && <div className="itinerary-toast">{toast}</div>}
      {error && <div className="form-alert">{error}</div>}

      <section className="itinerary-layout">
        <form className="section-composer" onSubmit={handleCreateSection}>
          <h2>Add city section</h2>
          <label><span>City</span><input value={sectionForm.city_name} onChange={(event) => setSectionForm({ ...sectionForm, city_name: event.target.value })} placeholder="Udaipur" /></label>
          <label><span>Start date</span><input type="date" value={sectionForm.start_date} onChange={(event) => setSectionForm({ ...sectionForm, start_date: event.target.value })} /></label>
          <label><span>End date</span><input type="date" value={sectionForm.end_date} onChange={(event) => setSectionForm({ ...sectionForm, end_date: event.target.value })} /></label>
          <label><span>Notes</span><textarea value={sectionForm.notes} onChange={(event) => setSectionForm({ ...sectionForm, notes: event.target.value })} placeholder="Stay area, transfer notes, pacing..." /></label>
          <button className="primary-button" type="submit"><FiPlus /> Add section</button>
        </form>

        <div className="itinerary-sections">
          {(trip.sections || []).length === 0 && (
            <div className="empty-itinerary">
              <h2>No itinerary sections yet.</h2>
              <p>Add your first city section to start building day-wise activities and budget flow.</p>
            </div>
          )}

          {(trip.sections || []).map((section, index) => {
            const form = activityForms[section.id] || emptyActivity;
            const isCollapsed = collapsed[section.id];
            const sectionCost = (section.activities || []).reduce((sum, activity) => sum + Number(activity.estimated_cost || 0), 0);

            return (
              <motion.article className="itinerary-section-card" key={section.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
                <button className="section-card-header" type="button" onClick={() => setCollapsed((current) => ({ ...current, [section.id]: !current[section.id] }))}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h2>{section.city_name}</h2>
                    <p>{section.start_date} - {section.end_date} · INR {sectionCost.toLocaleString()}</p>
                  </div>
                  <FiChevronDown />
                </button>

                {!isCollapsed && (
                  <div className="section-card-body">
                    <div className="inline-section-edit">
                      <input defaultValue={section.city_name} onBlur={(event) => event.target.value !== section.city_name && handleUpdateSection(section, { city_name: event.target.value })} />
                      <input type="date" defaultValue={section.start_date} onBlur={(event) => event.target.value !== section.start_date && handleUpdateSection(section, { start_date: event.target.value })} />
                      <input type="date" defaultValue={section.end_date} onBlur={(event) => event.target.value !== section.end_date && handleUpdateSection(section, { end_date: event.target.value })} />
                      <button type="button" onClick={() => handleDeleteSection(section.id)}><FiTrash2 /></button>
                    </div>

                    <div className="activity-timeline-builder">
                      {(section.activities || []).map((activity) => (
                        <article className="builder-activity-card" key={activity.id}>
                          <time><FiClock /> {activity.activity_time}</time>
                          <div>
                            <strong>{activity.activity_name}</strong>
                            <span>{activity.category} · INR {Number(activity.estimated_cost).toLocaleString()}</span>
                            {activity.description && <p>{activity.description}</p>}
                          </div>
                          <button type="button" onClick={() => handleDeleteActivity(activity.id)}><FiTrash2 /></button>
                        </article>
                      ))}
                    </div>

                    <div className="activity-composer">
                      <input value={form.activity_name} onChange={(event) => setActivityForms((current) => ({ ...current, [section.id]: { ...form, activity_name: event.target.value } }))} placeholder="Activity name" />
                      <input type="time" value={form.activity_time} onChange={(event) => setActivityForms((current) => ({ ...current, [section.id]: { ...form, activity_time: event.target.value } }))} />
                      <input type="number" value={form.estimated_cost} onChange={(event) => setActivityForms((current) => ({ ...current, [section.id]: { ...form, estimated_cost: event.target.value } }))} placeholder="Cost" />
                      <input value={form.category} onChange={(event) => setActivityForms((current) => ({ ...current, [section.id]: { ...form, category: event.target.value } }))} placeholder="Category" />
                      <textarea value={form.description} onChange={(event) => setActivityForms((current) => ({ ...current, [section.id]: { ...form, description: event.target.value } }))} placeholder="Notes for this activity" />
                      <button type="button" onClick={() => handleCreateActivity(section.id)}><FiSave /> Save activity</button>
                    </div>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      </section>

      <Link className="floating-create-trip" to="/trips/create"><FiPlus /></Link>
    </main>
  );
}
