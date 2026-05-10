import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBarChart2, FiClock, FiCreditCard, FiDownload, FiEdit3, FiPieChart, FiShare2, FiTrash2 } from 'react-icons/fi';
import { itineraryService } from '../services/itineraryService.js';
import '../styles/pages/ItineraryView.css';

export default function ItineraryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const payload = await itineraryService.getItinerary(id);
      setTrip(payload.trip);
      setBudget(payload.budget);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const days = useMemo(() => {
    if (!trip) return [];
    const grouped = {};
    (trip.sections || []).forEach((section) => {
      (section.activities || []).forEach((activity) => {
        const dayKey = section.start_date;
        grouped[dayKey] ||= { date: dayKey, city: section.city_name, activities: [], cost: 0 };
        grouped[dayKey].activities.push(activity);
        grouped[dayKey].cost += Number(activity.estimated_cost || 0);
      });
    });
    return Object.values(grouped);
  }, [trip]);

  const removeActivity = async (activityId) => {
    await itineraryService.deleteActivity(activityId);
    setToast('Activity removed and budget recalculated.');
    window.setTimeout(() => setToast(''), 2200);
    load();
  };

  if (loading) return <section className="itinerary-view-page"><div className="view-skeleton">Loading itinerary view...</div></section>;
  if (!trip) return <section className="itinerary-view-page"><div className="form-alert">{error || 'Trip not found.'}</div></section>;

  const categories = budget?.categories || {};
  const spentPercent = budget?.total_estimated_budget ? Math.min(100, (budget.spent / budget.total_estimated_budget) * 100) : 0;

  return (
    <main className="itinerary-view-page">
      <section className="itinerary-view-hero">
        <div>
          <span className="eyebrow">Itinerary view</span>
          <h1>{trip.trip_name}</h1>
          <p>{trip.destination} · {trip.start_date} - {trip.end_date}</p>
        </div>
        <div className="view-actions">
          <button type="button" onClick={() => navigate(`/trip/${trip.id}/itinerary`)}><FiEdit3 /> Edit</button>
          <button type="button"><FiShare2 /> Share</button>
          <button type="button"><FiDownload /> Export</button>
        </div>
      </section>

      {toast && <div className="itinerary-view-toast">{toast}</div>}

      <section className="budget-dashboard">
        <article className="budget-ring-card">
          <div className="budget-ring" style={{ '--spent': `${spentPercent}%` }}><span>{Math.round(spentPercent)}%</span></div>
          <strong>Budget used</strong>
          <p>Remaining INR {Number(budget?.remaining_budget || 0).toLocaleString()}</p>
        </article>
        <article><FiCreditCard /><span>Total estimated</span><strong>INR {Number(budget?.total_estimated_budget || 0).toLocaleString()}</strong></article>
        <article><FiBarChart2 /><span>Cost per day</span><strong>INR {Number(budget?.cost_per_day || 0).toLocaleString()}</strong></article>
        <article><FiPieChart /><span>Activity costs</span><strong>INR {Number(categories.activities || 0).toLocaleString()}</strong></article>
      </section>

      <section className="budget-breakdown">
        {['activities', 'transport', 'stay', 'food'].map((category) => (
          <article key={category}>
            <div><span>{category}</span><strong>INR {Number(categories[category] || 0).toLocaleString()}</strong></div>
            <div className="budget-bar"><span style={{ width: `${budget?.spent ? ((categories[category] || 0) / budget.spent) * 100 : 0}%` }} /></div>
          </article>
        ))}
      </section>

      <section className="day-wise-itinerary">
        {days.length ? days.map((day, index) => (
          <motion.article className="day-card" key={day.date} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <div className="day-card-heading">
              <span>Day {index + 1}</span>
              <div><h2>{day.city}</h2><p>{day.date} · INR {day.cost.toLocaleString()}</p></div>
            </div>
            <div className="view-activity-list">
              {day.activities.map((activity) => (
                <article key={activity.id}>
                  <time><FiClock /> {activity.activity_time}</time>
                  <div><strong>{activity.activity_name}</strong><span>{activity.category} · INR {Number(activity.estimated_cost).toLocaleString()}</span><p>{activity.description}</p></div>
                  <button type="button" onClick={() => removeActivity(activity.id)}><FiTrash2 /></button>
                </article>
              ))}
            </div>
          </motion.article>
        )) : (
          <div className="empty-view">No activities yet. Open the builder to create your timeline.</div>
        )}
      </section>
    </main>
  );
}
