import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiActivity, FiArrowRight, FiCalendar, FiMapPin, FiSearch } from 'react-icons/fi';
import { useTrips } from '../context/TripContext.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import activitiesData from '../data/activities.json';
import citiesData from '../data/cities.json';
import '../styles/components/GlobalSearch.css';

const resultIcons = {
  trip: <FiCalendar />,
  city: <FiMapPin />,
  activity: <FiActivity />,
  itinerary: <FiSearch />
};

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

export default function GlobalSearch({ className = '' }) {
  const navigate = useNavigate();
  const { trips, refreshTrips } = useTrips();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 220);
  const wrapperRef = useRef(null);

  useEffect(() => {
    refreshTrips();
  }, [refreshTrips]);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setFocused(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const timeout = window.setTimeout(() => setLoading(false), 180);
    return () => window.clearTimeout(timeout);
  }, [query]);

  const results = useMemo(() => {
    const term = normalize(debouncedQuery);
    if (!term) return [];

    const tripMatches = trips
      .filter((trip) => normalize(`${trip.trip_name} ${trip.destination} ${trip.description}`).includes(term))
      .slice(0, 4)
      .map((trip) => ({
        id: `trip-${trip.id}`,
        type: 'trip',
        title: trip.trip_name,
        meta: trip.destination,
        image: trip.cover_image,
        path: `/trip/${trip.id}/itinerary`
      }));

    const itineraryMatches = trips
      .flatMap((trip) => (trip.sections || []).flatMap((section) => [
        {
          id: `section-${section.id}`,
          type: 'itinerary',
          title: section.city_name,
          meta: `${trip.trip_name} itinerary section`,
          path: `/trip/${trip.id}/itinerary`
        },
        ...(section.activities || []).map((activity) => ({
          id: `activity-item-${activity.id}`,
          type: 'itinerary',
          title: activity.activity_name,
          meta: `${section.city_name} · ${trip.trip_name}`,
          path: `/trip/${trip.id}/itinerary`
        }))
      ]))
      .filter((item) => normalize(`${item.title} ${item.meta}`).includes(term))
      .slice(0, 4);

    const cityMatches = citiesData
      .filter((city) => normalize(`${city.name} ${city.state} ${city.country} ${city.tagline} ${city.trip_type.join(' ')}`).includes(term))
      .slice(0, 4)
      .map((city) => ({
        id: `city-${city.id}`,
        type: 'city',
        title: city.name,
        meta: `${city.state}, ${city.country}`,
        image: city.hero_image,
        path: `/explore?tab=cities&q=${encodeURIComponent(city.name)}`
      }));

    const activityMatches = activitiesData
      .filter((activity) => normalize(`${activity.title} ${activity.category} ${activity.description} ${activity.activity_type}`).includes(term))
      .slice(0, 5)
      .map((activity) => ({
        id: `activity-${activity.id}`,
        type: 'activity',
        title: activity.title,
        meta: `${activity.category} · ${citiesData.find((city) => city.id === activity.city_id)?.name || 'India'}`,
        image: activity.activity_image,
        path: `/explore?tab=activities&q=${encodeURIComponent(activity.title)}`
      }));

    return [...tripMatches, ...itineraryMatches, ...cityMatches, ...activityMatches].slice(0, 9);
  }, [debouncedQuery, trips]);

  const openResult = (path) => {
    navigate(path);
    setQuery('');
    setFocused(false);
  };

  const isOpen = focused && (query.trim().length > 0 || results.length > 0);

  return (
    <div className={`global-search ${className}`} ref={wrapperRef}>
      <label className="global-search-input">
        <FiSearch />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search trips, cities, activities..."
          aria-label="Global search"
        />
      </label>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="global-search-panel"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16 }}
          >
            <div className="global-search-heading">
              <span>Live search</span>
              <small>{loading ? 'Scanning travel graph...' : `${results.length} matches`}</small>
            </div>
            {loading ? (
              <div className="global-search-loading"><span /><span /><span /></div>
            ) : results.length ? (
              <div className="global-search-results">
                {results.map((result) => (
                  <button type="button" key={result.id} onClick={() => openResult(result.path)}>
                    <span className="global-search-avatar">
                      {result.image ? <img src={result.image} alt="" /> : resultIcons[result.type]}
                    </span>
                    <span>
                      <strong>{result.title}</strong>
                      <small>{result.meta}</small>
                    </span>
                    <em>{result.type}</em>
                    <FiArrowRight />
                  </button>
                ))}
              </div>
            ) : (
              <div className="global-search-empty">No matches yet. Try a trip name, city, or activity.</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
