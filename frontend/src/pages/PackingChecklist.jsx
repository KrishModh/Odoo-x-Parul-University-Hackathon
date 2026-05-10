import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiPackage, FiPlus, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { useTrips } from '../context/TripContext.jsx';
import { checklistService } from '../services/checklistService.js';
import '../styles/pages/PackingChecklist.css';

const categories = ['Clothing', 'Documents', 'Electronics', 'Toiletries', 'Medicines', 'Accessories', 'Miscellaneous'];
const suggestions = {
  solo: ['Power bank', 'ID proof', 'Compact backpack'],
  family: ['Snacks', 'Medical kit', 'Extra documents'],
  friends: ['Bluetooth speaker', 'Shared expense tracker', 'Cards'],
  business: ['Laptop', 'Formal wear', 'Presentation adapter'],
  couple: ['Camera', 'Dinner outfit', 'Reservation copies']
};

export default function PackingChecklist() {
  const { tripId } = useParams();
  const { trips, refreshTrips } = useTrips();
  const [selectedTripId, setSelectedTripId] = useState(tripId || '');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ item_name: '', category: 'Clothing' });
  const [filter, setFilter] = useState('All');
  const [toast, setToast] = useState('');
  const [error, setError] = useState('');

  const selectedTrip = useMemo(() => trips.find((trip) => String(trip.id) === String(selectedTripId)), [trips, selectedTripId]);
  const completed = items.filter((item) => item.is_completed).length;
  const progress = items.length ? Math.round((completed / items.length) * 100) : 0;
  const visibleItems = filter === 'All' ? items : items.filter((item) => item.category === filter);

  const load = async (id = selectedTripId) => {
    if (!id) return;
    try {
      const payload = await checklistService.getChecklist(id);
      setItems(payload.items || []);
    } catch (loadError) {
      setError(loadError.message);
    }
  };

  useEffect(() => {
    refreshTrips();
  }, [refreshTrips]);

  useEffect(() => {
    if (!selectedTripId && trips[0]) setSelectedTripId(String(trips[0].id));
  }, [trips, selectedTripId]);

  useEffect(() => {
    load();
  }, [selectedTripId]);

  const flash = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };

  const createItem = async (event) => {
    event.preventDefault();
    if (!selectedTripId || !form.item_name.trim()) return;
    await checklistService.createItem({ trip_id: Number(selectedTripId), ...form });
    setForm({ item_name: '', category: form.category });
    await load();
    flash('Checklist item added.');
  };

  const toggleItem = async (item) => {
    const result = await checklistService.updateItem({ item_id: item.id, is_completed: !item.is_completed });
    setItems((current) => current.map((entry) => (entry.id === item.id ? result.item : entry)));
  };

  const deleteItem = async (itemId) => {
    await checklistService.deleteItem(itemId);
    setItems((current) => current.filter((item) => item.id !== itemId));
    flash('Item removed.');
  };

  const addSuggestion = async (name) => {
    if (!selectedTripId) return;
    await checklistService.createItem({ trip_id: Number(selectedTripId), item_name: name, category: 'Miscellaneous' });
    await load();
  };

  const reset = async () => {
    await checklistService.resetChecklist(selectedTripId);
    setItems([]);
    flash('Checklist reset.');
  };

  return (
    <main className="packing-page">
      <section className="packing-hero">
        <div>
          <span className="eyebrow"><FiPackage /> Smart packing</span>
          <h1>Packing Checklist</h1>
          <p>{selectedTrip ? `${selectedTrip.trip_name} · ${selectedTrip.destination}` : 'Select a trip to start packing.'}</p>
        </div>
        <div className="packing-progress">
          <div style={{ '--progress': `${progress}%` }}><span>{progress}%</span></div>
          <strong>{completed}/{items.length} packed</strong>
        </div>
      </section>

      {toast && <div className="packing-toast">{toast}</div>}
      {error && <div className="form-alert">{error}</div>}

      <section className="packing-controls">
        <select value={selectedTripId} onChange={(event) => setSelectedTripId(event.target.value)}>
          <option value="">Select trip</option>
          {trips.map((trip) => <option key={trip.id} value={trip.id}>{trip.trip_name}</option>)}
        </select>
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option>All</option>
          {categories.map((category) => <option key={category}>{category}</option>)}
        </select>
        <button type="button" onClick={reset}><FiRefreshCw /> Reset</button>
      </section>

      <section className="packing-layout">
        <form className="packing-composer" onSubmit={createItem}>
          <h2>Add item</h2>
          <input value={form.item_name} onChange={(event) => setForm({ ...form, item_name: event.target.value })} placeholder="Passport, charger, jacket..." />
          <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <button className="primary-button" type="submit"><FiPlus /> Add to checklist</button>

          <div className="packing-suggestions">
            <h3>Smart suggestions</h3>
            {(suggestions[selectedTrip?.travel_type] || suggestions.solo).map((item) => (
              <button type="button" key={item} onClick={() => addSuggestion(item)}>{item}</button>
            ))}
          </div>
        </form>

        <div className="packing-list">
          {visibleItems.length ? visibleItems.map((item) => (
            <motion.article className={item.is_completed ? 'packed' : ''} key={item.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
              <button type="button" className="packing-check" onClick={() => toggleItem(item)}>{item.is_completed && <FiCheckCircle />}</button>
              <div><strong>{item.item_name}</strong><span>{item.category}</span></div>
              <button type="button" onClick={() => deleteItem(item.id)}><FiTrash2 /></button>
            </motion.article>
          )) : (
            <div className="empty-packing">No checklist items in this category yet.</div>
          )}
        </div>
      </section>
    </main>
  );
}
