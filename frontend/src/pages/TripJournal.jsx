import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCamera, FiEdit3, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useTrips } from '../context/TripContext.jsx';
import { journalService } from '../services/journalService.js';
import '../styles/pages/TripJournal.css';

const emptyForm = { title: '', content: '', note_type: 'trip', image: null };

export default function TripJournal() {
  const { tripId } = useParams();
  const { trips, refreshTrips } = useTrips();
  const [selectedTripId, setSelectedTripId] = useState(tripId || '');
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const selectedTrip = useMemo(
    () => trips.find((trip) => String(trip.id) === String(selectedTripId)),
    [trips, selectedTripId]
  );

  useEffect(() => {
    refreshTrips();
  }, [refreshTrips]);

  useEffect(() => {
    if (!selectedTripId && trips[0]) setSelectedTripId(String(trips[0].id));
  }, [trips, selectedTripId]);

  const loadNotes = async () => {
    if (!selectedTripId) return;
    setLoading(true);
    try {
      const data = await journalService.getJournal(selectedTripId);
      setNotes(data.notes || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, [selectedTripId]);

  const submitNote = async (event) => {
    event.preventDefault();
    if (!selectedTripId) return;
    const payload = new FormData();
    payload.append('trip_id', selectedTripId);
    payload.append('title', form.title);
    payload.append('content', form.content);
    payload.append('note_type', form.note_type);
    if (form.image) payload.append('image', form.image);
    if (editingId) payload.append('note_id', editingId);

    setSaving(true);
    try {
      if (editingId) {
        await journalService.updateNote(payload);
      } else {
        await journalService.createNote(payload);
      }
      setForm(emptyForm);
      setEditingId(null);
      setMessage('Journal synced to your trip.');
      await loadNotes();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setForm({ title: note.title, content: note.content, note_type: note.note_type, image: null });
  };

  const deleteNote = async (noteId) => {
    try {
      await journalService.deleteNote(noteId);
      setNotes((current) => current.filter((note) => note.id !== noteId));
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <main className="trip-journal-page">
      <header className="journal-hero">
        <div>
          <span className="eyebrow">Trip notes / journal</span>
          <h1>Capture the story behind every travel loop.</h1>
          <p>Save day notes, city observations, activity memories, and photo-backed journal entries directly against your trip.</p>
        </div>
        <select value={selectedTripId} onChange={(event) => setSelectedTripId(event.target.value)}>
          <option value="">Select trip</option>
          {trips.map((trip) => <option key={trip.id} value={trip.id}>{trip.trip_name}</option>)}
        </select>
      </header>

      {message && <div className="journal-message">{message}</div>}

      <section className="journal-grid">
        <form className="journal-editor" onSubmit={submitNote}>
          <div className="journal-editor-cover">
            <FiEdit3 />
            <strong>{editingId ? 'Edit memory' : 'New memory'}</strong>
            <span>{selectedTrip?.destination || 'Choose a trip to begin'}</span>
          </div>
          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Journal title" />
          <select value={form.note_type} onChange={(event) => setForm({ ...form, note_type: event.target.value })}>
            <option value="trip">Trip-wide note</option>
            <option value="city">City note</option>
            <option value="activity">Activity note</option>
            <option value="day">Day-wise note</option>
          </select>
          <textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="Write the moment, reminder, or memory..." />
          <label className="journal-upload">
            <FiCamera />
            <span>{form.image ? form.image.name : 'Attach photo'}</span>
            <input type="file" accept="image/*" onChange={(event) => setForm({ ...form, image: event.target.files?.[0] || null })} />
          </label>
          <button className="primary-button" type="submit" disabled={saving || !selectedTripId}>
            <FiPlus /> {saving ? 'Saving...' : editingId ? 'Update note' : 'Save note'}
          </button>
        </form>

        <div className="journal-timeline">
          {loading ? <div className="journal-skeleton" /> : notes.length ? notes.map((note, index) => (
            <motion.article key={note.id} className="journal-entry" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}>
              {note.image && <img src={note.image} alt={note.title} />}
              <div>
                <span>{note.note_type}</span>
                <h2>{note.title}</h2>
                <p>{note.content}</p>
                <time>{new Date(note.created_at).toLocaleString()}</time>
              </div>
              <div className="journal-entry-actions">
                <button type="button" onClick={() => startEdit(note)}><FiEdit3 /></button>
                <button type="button" onClick={() => deleteNote(note.id)}><FiTrash2 /></button>
              </div>
            </motion.article>
          )) : <div className="journal-empty">No journal entries yet. Add the first note to make this trip feel alive.</div>}
        </div>
      </section>
    </main>
  );
}
