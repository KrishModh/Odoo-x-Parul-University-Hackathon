import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiActivity, FiCompass, FiFilter, FiMapPin, FiPlus, FiSearch, FiStar } from 'react-icons/fi';
import ThemeToggle from '../components/ThemeToggle.jsx';
import { useTrips } from '../context/TripContext.jsx';
import { useDebounce } from '../hooks/useDebounce.js';
import { itineraryService } from '../services/itineraryService.js';
import activitiesData from '../data/activities.json';
import citiesData from '../data/cities.json';
import '../styles/pages/SearchExplorer.css';

const categories = ['adventure', 'food', 'nightlife', 'sightseeing', 'nature', 'luxury', 'family'];
const fallbackCity = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80';
const fallbackActivity = 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1000&q=80';

export default function SearchExplorer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { trips, refreshTrips } = useTrips();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'activities' ? 'activities' : 'cities');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [cityFilters, setCityFilters] = useState({ country: '', region: '', budget: '', popularity: '' });
  const [activityFilters, setActivityFilters] = useState({ category: '', budget: '', duration: '' });
  const [cities, setCities] = useState([]);
  const [activities, setActivities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');
  const debouncedQuery = useDebounce(query);

  const selectedTrip = useMemo(() => trips.find((trip) => String(trip.id) === String(selectedTripId)), [trips, selectedTripId]);

  useEffect(() => {
    refreshTrips();
  }, [refreshTrips]);

  useEffect(() => {
    const nextTab = searchParams.get('tab');
    const nextQuery = searchParams.get('q');
    if (nextTab === 'activities' || nextTab === 'cities') setActiveTab(nextTab);
    if (nextQuery) setQuery(nextQuery);
  }, [searchParams]);

  useEffect(() => {
    if (!selectedTripId && trips[0]) setSelectedTripId(String(trips[0].id));
  }, [trips, selectedTripId]);

  useEffect(() => {
    if (!selectedSectionId && selectedTrip?.sections?.[0]) setSelectedSectionId(String(selectedTrip.sections[0].id));
  }, [selectedTrip, selectedSectionId]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    window.setTimeout(() => {
      if (!active) return;
      const normalizedQuery = debouncedQuery.trim().toLowerCase();
      if (activeTab === 'cities') {
        const nextCities = citiesData.filter((city) => {
          const text = `${city.name} ${city.state} ${city.country} ${city.tagline} ${city.description} ${city.trip_type.join(' ')}`.toLowerCase();
          const matchesQuery = !normalizedQuery || text.includes(normalizedQuery);
          const matchesCountry = !cityFilters.country || city.country.toLowerCase().includes(cityFilters.country.toLowerCase());
          const matchesRegion = !cityFilters.region || city.state.toLowerCase().includes(cityFilters.region.toLowerCase());
          const matchesBudget = !cityFilters.budget || Number(city.avg_budget) <= Number(cityFilters.budget);
          const matchesPopularity = !cityFilters.popularity || Number(city.popularity_score) >= Number(cityFilters.popularity);
          return matchesQuery && matchesCountry && matchesRegion && matchesBudget && matchesPopularity;
        });
        setCities(nextCities);
      } else {
        const nextActivities = activitiesData.filter((activity) => {
          const city = citiesData.find((item) => item.id === activity.city_id);
          const text = `${activity.title} ${activity.category} ${activity.description} ${activity.activity_type} ${city?.name || ''}`.toLowerCase();
          const matchesQuery = !normalizedQuery || text.includes(normalizedQuery);
          const matchesCategory = !activityFilters.category || activity.category.toLowerCase() === activityFilters.category.toLowerCase() || activity.activity_type.toLowerCase() === activityFilters.category.toLowerCase();
          const matchesBudget = !activityFilters.budget || Number(activity.estimated_cost) <= Number(activityFilters.budget);
          const matchesDuration = !activityFilters.duration || activity.duration.toLowerCase().includes(activityFilters.duration.toLowerCase());
          return matchesQuery && matchesCategory && matchesBudget && matchesDuration;
        });
        setActivities(nextActivities);
      }
      setLoading(false);
    }, 220);

    return () => {
      active = false;
    };
  }, [activeTab, debouncedQuery, cityFilters, activityFilters]);

  const flash = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2300);
  };

  const addCityToTrip = async (city) => {
    if (!selectedTrip) {
      setError('Create or select a trip first.');
      return;
    }

    try {
      await itineraryService.createSection({
        trip_id: selectedTrip.id,
        city_name: city.name,
        start_date: selectedTrip.start_date,
        end_date: selectedTrip.end_date,
        notes: `${city.name}, ${city.state}. ${city.tagline}. Best season: ${city.best_season || 'Flexible'}. Highlights: ${(city.top_highlights || []).join(', ')}.`
      });
      await refreshTrips();
      flash(`${city.name} added to ${selectedTrip.trip_name}.`);
    } catch (cityError) {
      setError(cityError.message);
    }
  };

  const addActivityToItinerary = async (activity) => {
    if (!selectedSectionId) {
      setError('Add or select a city section before adding activities.');
      return;
    }

    try {
      await itineraryService.createActivity({
        section_id: Number(selectedSectionId),
        activity_name: activity.title || activity.activity_name,
        description: activity.description,
        estimated_cost: activity.estimated_cost,
        activity_time: activity.best_time === 'Evening' ? '18:00' : activity.best_time === 'Night' ? '21:00' : '10:00',
        category: activity.category
      });
      await refreshTrips();
      flash(`${activity.title || activity.activity_name} added to itinerary.`);
    } catch (activityError) {
      setError(activityError.message);
    }
  };

  return (
    <main className="search-explorer-page">
      <header className="search-explorer-header">
        <div>
          <span className="eyebrow"><FiCompass /> AI discovery system</span>
          <h1>Explore cities and activities that fit your trip.</h1>
          <p>Search destination intelligence, compare travel signals, and push discoveries directly into real itineraries.</p>
        </div>
        <ThemeToggle />
      </header>

      <section className="discovery-control-panel">
        <div className="search-tabs">
          <button className={activeTab === 'cities' ? 'active' : ''} type="button" onClick={() => setActiveTab('cities')}><FiMapPin /> City Search</button>
          <button className={activeTab === 'activities' ? 'active' : ''} type="button" onClick={() => setActiveTab('activities')}><FiActivity /> Activity Search</button>
        </div>
        <label className="discovery-search"><FiSearch /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${activeTab}`} /></label>
        <div className="trip-target-controls">
          <select value={selectedTripId} onChange={(event) => { setSelectedTripId(event.target.value); setSelectedSectionId(''); }}>
            <option value="">Select trip</option>
            {trips.map((trip) => <option key={trip.id} value={trip.id}>{trip.trip_name}</option>)}
          </select>
          <select value={selectedSectionId} onChange={(event) => setSelectedSectionId(event.target.value)}>
            <option value="">Select itinerary section</option>
            {(selectedTrip?.sections || []).map((section) => <option key={section.id} value={section.id}>{section.city_name}</option>)}
          </select>
        </div>
      </section>

      <section className="discovery-filters">
        <FiFilter />
        {activeTab === 'cities' ? (
          <>
            <input placeholder="Country" value={cityFilters.country} onChange={(event) => setCityFilters({ ...cityFilters, country: event.target.value })} />
            <input placeholder="Region" value={cityFilters.region} onChange={(event) => setCityFilters({ ...cityFilters, region: event.target.value })} />
            <input type="number" placeholder="Max budget" value={cityFilters.budget} onChange={(event) => setCityFilters({ ...cityFilters, budget: event.target.value })} />
            <input type="number" placeholder="Min popularity" value={cityFilters.popularity} onChange={(event) => setCityFilters({ ...cityFilters, popularity: event.target.value })} />
          </>
        ) : (
          <>
            <select value={activityFilters.category} onChange={(event) => setActivityFilters({ ...activityFilters, category: event.target.value })}>
              <option value="">All categories</option>
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            <input type="number" placeholder="Max budget" value={activityFilters.budget} onChange={(event) => setActivityFilters({ ...activityFilters, budget: event.target.value })} />
            <input placeholder="Duration" value={activityFilters.duration} onChange={(event) => setActivityFilters({ ...activityFilters, duration: event.target.value })} />
          </>
        )}
      </section>

      {toast && <div className="discovery-toast">{toast}</div>}
      {error && <div className="form-alert">{error}</div>}

      {loading ? (
        <section className="discovery-skeleton"><span /><span /><span /></section>
      ) : activeTab === 'cities' ? (
        <section className="discovery-grid">
          {cities.length ? cities.map((city) => (
            <motion.article className="discovery-card" key={city.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
              <div className="discovery-image" style={{ '--card-image': `url(${city.hero_image || fallbackCity})` }}><span>{city.popularity_score} score</span></div>
              <div className="discovery-card-body">
                <h2>{city.name}</h2>
                <p>{city.country} · {city.state}</p>
                <p>{city.description}</p>
                <div><span>Avg INR {Number(city.avg_budget).toLocaleString()}</span><span>{city.best_season}</span></div>
                <div className="discovery-card-actions">
                  <button type="button" onClick={() => setSelectedCity(city)}>View Details</button>
                  <button type="button" onClick={() => addCityToTrip(city)}><FiPlus /> Add to Trip</button>
                </div>
              </div>
            </motion.article>
          )) : <div className="empty-discovery">No curated cities found. Try a different search or filter.</div>}
        </section>
      ) : (
        <section className="discovery-grid">
          {activities.length ? activities.map((activity) => (
            <motion.article className="discovery-card" key={activity.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
              <div className="discovery-image" style={{ '--card-image': `url(${activity.activity_image || fallbackActivity})` }}><span><FiStar /> {activity.rating || 'New'}</span></div>
              <div className="discovery-card-body">
                <h2>{activity.title || activity.activity_name}</h2>
                <p>{activity.category} · {activity.duration || 'Flexible'} · {citiesData.find((city) => city.id === activity.city_id)?.name}</p>
                <p>{activity.description}</p>
                <div><span>INR {Number(activity.estimated_cost).toLocaleString()}</span><span>{activity.best_time}</span></div>
                <button type="button" onClick={() => addActivityToItinerary(activity)}><FiPlus /> Add to Itinerary</button>
              </div>
            </motion.article>
          )) : <div className="empty-discovery">No curated activities found. Try a different search or filter.</div>}
        </section>
      )}

      {selectedCity && (
        <div className="city-detail-modal" role="dialog" aria-modal="true">
          <motion.article initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <button className="city-detail-close" type="button" onClick={() => setSelectedCity(null)}>Close</button>
            <div className="city-detail-hero" style={{ '--city-hero': `url(${selectedCity.hero_image})` }}>
              <span>{selectedCity.popularity_score} popularity</span>
              <h2>{selectedCity.name}</h2>
              <p>{selectedCity.tagline}</p>
            </div>
            <div className="city-detail-body">
              <p>{selectedCity.description}</p>
              <div className="city-detail-stats">
                <span>Budget INR {Number(selectedCity.avg_budget).toLocaleString()}</span>
                <span>{selectedCity.best_season}</span>
                <span>{selectedCity.ideal_duration}</span>
                <span>{selectedCity.weather}</span>
              </div>
              <div className="city-detail-gallery">
                {selectedCity.gallery_images.map((image) => <img src={image} alt={`${selectedCity.name} gallery`} key={image} />)}
              </div>
              <div className="city-detail-lists">
                <div><h3>Top highlights</h3>{selectedCity.top_highlights.map((item) => <span key={item}>{item}</span>)}</div>
                <div><h3>Travel tips</h3>{selectedCity.travel_tips.map((item) => <span key={item}>{item}</span>)}</div>
              </div>
              <div className="city-detail-activities">
                <h3>Top activities</h3>
                {activitiesData.filter((activity) => activity.city_id === selectedCity.id).slice(0, 4).map((activity) => (
                  <button type="button" key={activity.id} onClick={() => addActivityToItinerary(activity)}>
                    <strong>{activity.title}</strong>
                    <span>{activity.category} · INR {Number(activity.estimated_cost).toLocaleString()}</span>
                  </button>
                ))}
              </div>
              <button className="primary-button" type="button" onClick={() => addCityToTrip(selectedCity)}><FiPlus /> Add {selectedCity.name} to Trip</button>
            </div>
          </motion.article>
        </div>
      )}
    </main>
  );
}
