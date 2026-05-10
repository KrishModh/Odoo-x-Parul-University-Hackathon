import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiEdit3, FiEye, FiMapPin, FiPlus, FiSearch, FiSliders, FiTrash2 } from 'react-icons/fi';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { useTrips } from '../context/TripContext.jsx';
import { tripService } from '../services/tripService.js';
import '../styles/pages/MyTrips.css';

const fallbackImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80';

function getTripStatus(trip) {
  const today = new Date();
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  if (end < today) return 'completed';
  if (start <= today && end >= today) return 'ongoing';
  return 'upcoming';
}

function itineraryProgress(trip) {
  const sections = trip.sections || [];
  const activities = sections.flatMap((section) => section.activities || []);
  if (!sections.length) return 18;
  return Math.min(96, 30 + sections.length * 12 + activities.length * 6);
}

export default function MyTrips() {
  const navigate = useNavigate();
  const { trips, loadingTrips, tripError, refreshTrips, removeTrip } = useTrips();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [toast, setToast] = useState('');
  const [editingTrip, setEditingTrip] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    refreshTrips();
  }, [refreshTrips]);

  const visibleTrips = useMemo(() => {
    const filtered = trips.filter((trip) => {
      const status = getTripStatus(trip);
      const matchesFilter = filter === 'all' || status === filter;
      const haystack = `${trip.trip_name} ${trip.destination}`.toLowerCase();
      return matchesFilter && haystack.includes(query.toLowerCase());
    });

    return [...filtered].sort((a, b) => {
      if (sort === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sort === 'budget') return Number(b.estimated_budget) - Number(a.estimated_budget);
      if (sort === 'destination') return a.destination.localeCompare(b.destination);
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [trips, query, filter, sort]);

  const groupedTrips = {
    ongoing: visibleTrips.filter((trip) => getTripStatus(trip) === 'ongoing'),
    upcoming: visibleTrips.filter((trip) => getTripStatus(trip) === 'upcoming'),
    completed: visibleTrips.filter((trip) => getTripStatus(trip) === 'completed')
  };

  const handleDelete = async (tripId) => {
    try {
      await removeTrip(tripId);
      setToast('Trip deleted and dashboard synced.');
      window.setTimeout(() => setToast(''), 2200);
    } catch (error) {
      setToast(error.message);
    }
  };

  const openEdit = (trip) => {
    setEditingTrip(trip);
    setEditForm({
      trip_name: trip.trip_name,
      destination: trip.destination,
      start_date: trip.start_date,
      end_date: trip.end_date,
      description: trip.description,
      estimated_budget: trip.estimated_budget,
      travelers_count: trip.travelers_count,
      travel_type: trip.travel_type,
      visibility: trip.visibility,
      tags: (trip.tags || []).join(', '),
      notes: trip.notes || ''
    });
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(editForm).forEach(([key, value]) => formData.append(key, value));

    try {
      await tripService.updateTrip(editingTrip.id, formData);
      await refreshTrips();
      setEditingTrip(null);
      setToast('Trip updated and synced.');
      window.setTimeout(() => setToast(''), 2200);
    } catch (error) {
      setToast(error.message);
    }
  };

  const renderTripCard = (trip) => {
    const progress = itineraryProgress(trip);
    return (
      <motion.article className="my-trip-card" key={trip.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <div className="my-trip-cover" style={{ '--trip-image': `url(${trip.cover_image || fallbackImage})` }}>
          <span>{getTripStatus(trip)}</span>
        </div>
        <div className="my-trip-body">
          <div>
            <h3>{trip.trip_name}</h3>
            <p><FiMapPin /> {trip.destination}</p>
            <p><FiCalendar /> {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</p>
          </div>
          <div className="my-trip-meta">
            <span>Budget INR {Number(trip.estimated_budget).toLocaleString()}</span>
            <strong>{progress}% itinerary</strong>
          </div>
          <div className="trip-progress"><span style={{ width: `${progress}%` }} /></div>
          <div className="my-trip-actions">
            <button type="button" onClick={() => navigate(`/trip/${trip.id}/view`)}><FiEye /> View</button>
            <button type="button" onClick={() => openEdit(trip)}><FiEdit3 /> Edit</button>
            <button type="button" onClick={() => navigate(`/trip/${trip.id}/itinerary`)}>Open Itinerary</button>
            <button type="button" onClick={() => navigate(`/trip/${trip.id}/packing`)}>Packing</button>
            <button className="danger" type="button" onClick={() => handleDelete(trip.id)}><FiTrash2 /></button>
          </div>
        </div>
      </motion.article>
    );
  };

  return (
    <main className="my-trips-page">
      <header className="my-trips-header">
        <div>
          <span className="eyebrow">Trip management</span>
          <h1>My Trips</h1>
          <p>Search, manage, and open itinerary workspaces for every saved Traveloop journey.</p>
        </div>
        <div>
          <ThemeToggle />
          <button className="primary-button" type="button" onClick={() => navigate('/trips/create')}><FiPlus /> Create Trip</button>
        </div>
      </header>

      <section className="trip-controls">
        <label><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by trip or destination" /></label>
        <label><FiSliders /><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All trips</option><option value="ongoing">Ongoing</option><option value="upcoming">Upcoming</option><option value="completed">Completed</option></select></label>
        <label><FiSliders /><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="budget">Budget</option><option value="destination">Destination</option></select></label>
      </section>

      {toast && <div className="trip-toast">{toast}</div>}
      {tripError && <div className="form-alert">{tripError}</div>}

      {loadingTrips ? (
        <section className="trips-skeleton"><span /><span /><span /></section>
      ) : (
        ['ongoing', 'upcoming', 'completed'].map((group) => (
          <section className="trip-group" key={group}>
            <div className="trip-group-heading">
              <h2>{group} Trips</h2>
              <span>{groupedTrips[group].length}</span>
            </div>
            {groupedTrips[group].length ? (
              <div className="my-trip-grid">{groupedTrips[group].map(renderTripCard)}</div>
            ) : (
              <div className="empty-trips">No {group} trips found.</div>
            )}
          </section>
        ))
      )}

      {editingTrip && editForm && (
        <div className="trip-edit-modal" role="dialog" aria-modal="true">
          <form onSubmit={handleEditSubmit}>
            <div className="trip-group-heading">
              <h2>Edit Trip</h2>
              <button type="button" onClick={() => setEditingTrip(null)}>Close</button>
            </div>
            <input value={editForm.trip_name} onChange={(event) => setEditForm({ ...editForm, trip_name: event.target.value })} placeholder="Trip name" />
            <input value={editForm.destination} onChange={(event) => setEditForm({ ...editForm, destination: event.target.value })} placeholder="Destination" />
            <input type="date" value={editForm.start_date} onChange={(event) => setEditForm({ ...editForm, start_date: event.target.value })} />
            <input type="date" value={editForm.end_date} onChange={(event) => setEditForm({ ...editForm, end_date: event.target.value })} />
            <input type="number" value={editForm.estimated_budget} onChange={(event) => setEditForm({ ...editForm, estimated_budget: event.target.value })} placeholder="Budget" />
            <input type="number" value={editForm.travelers_count} onChange={(event) => setEditForm({ ...editForm, travelers_count: event.target.value })} placeholder="Travelers" />
            <select value={editForm.travel_type} onChange={(event) => setEditForm({ ...editForm, travel_type: event.target.value })}>
              <option value="solo">Solo</option>
              <option value="family">Family</option>
              <option value="friends">Friends</option>
              <option value="business">Business</option>
              <option value="couple">Couple</option>
            </select>
            <select value={editForm.visibility} onChange={(event) => setEditForm({ ...editForm, visibility: event.target.value })}>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
            <textarea value={editForm.description} onChange={(event) => setEditForm({ ...editForm, description: event.target.value })} />
            <input value={editForm.tags} onChange={(event) => setEditForm({ ...editForm, tags: event.target.value })} placeholder="Tags" />
            <textarea value={editForm.notes} onChange={(event) => setEditForm({ ...editForm, notes: event.target.value })} placeholder="Notes" />
            <button className="primary-button" type="submit">Save Trip</button>
          </form>
        </div>
      )}
    </main>
  );
}
